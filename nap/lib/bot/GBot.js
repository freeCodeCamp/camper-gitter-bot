"use strict";

var assert = require("chai").assert;
var Gitter = require('node-gitter'),
    GitterHelper = require('../../lib/gitter/GitterHelper');

var AppConfig = require('../../config/AppConfig'),
    RoomData = require('../../data/RoomData'),
    Utils = require('../../lib/utils/Utils'),
    KBase = require("../../lib/bot/KBase"),
    BotCommands = require('../../lib/bot/BotCommands');

function clog(msg, obj) {
    Utils.clog("GBot>", msg, obj);
}

var GBot = {

    // TODO refresh and add oneToOne rooms
    init: function() {
        KBase.initAsync();
        this.roomList = [];
        this.gitter = new Gitter(AppConfig.token);
        var that = this;
        this.joinKnownRooms();
        this.scanRooms();
        BotCommands.init(this);
    },

    announce: function(opts) {
        this.scanRooms();
        this.joinRoom(opts, true);
    },

    joinRoom: function(opts, announce) {
        var roomUrl = opts.roomObj.name;
        GBot.gitter.rooms.join(roomUrl, function(err, room) {
            if (err) {
                console.warn('Not possible to join the room: ', err, roomUrl);
                return;
            }
            GBot.roomList.push(room)
            GBot.listenToRoom(room);
            var text = GBot.getAnnounceMessage(opts)
            GBot.say(text, room);
            clog('joined> ', room.uri);
            return (room);
        });
    },


    getName: function() {
        return AppConfig.botname;
    },

    say: function(text, room) {
        room.send(text);
    },


    // when a new user comes into a room
    // announce: function(opts) {
    //     clog("Bot.announce", opts);

    getAnnounceMessage: function(opts) {
        var text = "----\n";
        if (opts.who && opts.topic) {
            text += "@" + opts.who + " has a question on\n";
            text += "## " + opts.topic;
        } else if (opts.topic) {
            text += "a question on: **" + opts.topic + "**";
        } else if (opts.who) {
            text += "welcome @" + opts.who;
        }
        return (text);
    },

    checkWiki: function(input) {
        assert.isObject(input, "checkWiki expects an object");
        var topic, str, dmLink;
        clog("checkWiki", input);

        dmLink = AppConfig.dmLink;

        if (topic = KBase.staticReplies[input.cleanTopic])
            return topic;

        if (topic = KBase.getTopic(input.cleanTopic)) {
            clog("topic", topic);
            str = "----\n"
            // str += "## " + input.topic + "\n"
            str += topic.data + "\n"
            str += "----\n"
            str += "\n> ![bothelp](https://avatars1.githubusercontent.com/bothelp?v=3&s=32)"
            str += " [DM bothelp](" + AppConfig.topicDmUri(topic.topic) + ")"
            str += " | [wikilink **" + topic.topic + "**](https://github.com/bothelpers/kbase/wiki/" + topic.topic + ")"
            return str
        }
        // else
        return null
    },

    checkCommands: function(input) {

        var cmds = BotCommands.cmdList.filter(function(c) {
            return (c == input.topic || c == input.text)
        })
        var cmd = cmds[0]
        if (cmd) {
            var res = BotCommands[cmd](input, this);
            return res;
        }
        return false;
    },

    checkHelp: function(input) {
        assert.isObject(input, "checkHelp expects an object");
        var wiki, str, topic;

        wiki = this.checkWiki(input)
        if (wiki) return wiki;

        // else
        str = "help for **" + input.topic + "**";
        return str;
    },

    checkThanks: function(input) {
        // assert.isInstanceOf(input, String)
        assert.isObject(input, "checkThanks expects an object");
        assert.isTrue(input.thanks);
        var mentions, output, fromUser, toUser;

        clog("thanks input.message>", input.message);

        mentions = input.message.model.mentions;
        if (mentions) {
            // TODO - build a list
            toUser = "@" + mentions[0].screenName
        }
        fromUser = "@" + input.message.model.fromUser.username
        output = fromUser + " sends karma to " + toUser;
        output += "\n :thumbsup: :thumbsup: :thumbsup: :thumbsup: :thumbsup: :sparkles: :sparkles: "
        return output;
    },

    // turns raw text input into a json format
    parseInput: function(message) {
        var res, str, topic, cleanText, input;

        cleanText = message.model.text;
        cleanText = cleanText.valueOf();    // get value so we avoid circular refs with input.msg
        cleanText = Utils.sanitize(cleanText);

        // TODO sanitize
        input = {
            text: cleanText,
            message: message,
            help: false,
            thanks: false
        };

        if (res = input.text.match(/(thanks|ty|thank you) \@(.*)/)) {
            input.thanks = true;
            return input;
        }

        // FIXME this is matching on bothelp not just help
        if (res = input.text.match(/^(help|wiki|check|hint|tip) (.*)/)) {
            input.topic = res[2]
            input.cleanTopic = input.topic.replace(" ", "-").toLowerCase();
            input.help = true
            input.intent = res[1]
            return input
        }

        clog('input', input);
        return input;
    },

    // search all reply methods
    // returns a string to send
    findAnyReply: function(message) {
        var res;
        var input = this.parseInput(message);

        if (input.help) {
            return this.checkHelp(input)
        } else if (input.thanks) {
            return this.checkThanks(input)
        } else if (res = this.checkCommands(input)) {
            return res;
        } else {
            return;
            // return "you said: " + input.text;
        }

    },


    // checks if joined already, otherwise adds
    addToRoomList: function(room) {
        // check for dupes
        this.roomList = this.roomList || [];
        if (this.hasAlreadyJoined(room, this.roomList)) {
            return false;
        };

        clog("addToRoomList", room.name);
        this.roomList.push(room);
        return true;
    },

    // checks if a room is already in bots internal list of joined rooms
    // this is to avoid listening twice 
    // see https://github.com/gitterHQ/node-gitter/issues/15
    // note this is only the bots internal tracking
    // it has no concept if the gitter API/state already thinks you're joined/listening
    hasAlreadyJoined: function(room) {
        var checks = this.roomList.filter(function(rm) {
            rm.name == room.name;
        })
        var checkOne = checks[0];
        if (checkOne) {
            Utils.warning("GBot", "hasAlreadyJoined:", checkOne);
            return true;
        }
        return false;
    },

    // listen to a know room
    // does a check to see if not already joined according to internal data
    listenToRoom: function(room) {
        // gitter.rooms.find(room.id).then(function(room) {

        if (this.addToRoomList(room) == false) {
            return;
        }

        var chats = room.streaming().chatMessages();
        // The 'chatMessages' event is emitted on each new message
        chats.on('chatMessages', function(message) {
            // clog('message> ', message.model.text);
            if (message.operation != "create") {
                // console.log("skip msg reply", msg);
                return;
            }

            if (message.model.fromUser.username == AppConfig.botname) {
                // console.warn("skip reply to bot");
                return;
            }
            message.room = room; // why don't gitter do this?
            GBot.sendReply(message);
        });
    },

    sendReply: function(message) {
        clog(" in|", message.model.fromUser.username + "> " + message.model.text);
        var output = this.findAnyReply(message);
        clog("out| ", output);
        message.room.send(output);
        return (output);
    },

    // this joins rooms contained in the data/RoomData.js file
    // ie a set of bot specific discussion rooms
    joinKnownRooms: function() {
        var that = this;
        RoomData.map(function(oneRoomData) {
            var roomUrl = oneRoomData.name;
            // console.log("oneRoomData", oneRoomData);
            // clog("gitter.rooms", that.gitter.rooms);
            that.gitter.rooms.join(roomUrl, function(err, room) {
                if (err) {
                    console.warn('Not possible to join the room: ', err, roomUrl);
                    return;
                }
                that.listenToRoom(room);
                clog('joined> ', room.name);
            });
        })
    },

    // uses gitter helper to fetch the list of rooms this user is "in"
    // and then tries to listen to them
    // this is mainly to pick up new oneOnOne conversations  
    // when a user DMs the bot
    // as I can't see an event the bot would get to know about that
    // so its kind of like "polling" and currently only called from the webUI
    scanRooms: function(user, token) {
        var user = user || this.gitter.currentUser(),
            token = token || AppConfig.token;

        clog('user', user)
        clog('token', token)
        var that = this;

        GitterHelper.fetchRooms(user, token, function(err, rooms) {
            if (err) Utils.error("GBot", "fetchRooms", rooms);
            clog("scanRooms.rooms", rooms);
            if (!rooms) {
                Utils.warn("cant scanRooms")
                return;
            }
            // else
            rooms.map(function(room) {
                if (room.oneToOne) {
                    clog("oneToOne", room.name)
                    that.gitter.rooms.find(room.id).then(function(roomObj) {
                        that.listenToRoom(roomObj);
                    })
                }
            })
        });
        // GBot.gitter.rooms.find().then(function(rooms) {
        //     clog("found rooms", rooms)
        // })
    },

    // FIXME doesnt work for some reason >.<
    // needs different type of token?
    updateRooms: function() {
        GBot.gitter.currentUser()
            .then(function(user) {
                var list = user.rooms(function(err, obj) {
                    clog("rooms", err, obj)
                });
                clog("user", user);
                clog("list", list);
                return (list);
            })
    }

}

module.exports = GBot;