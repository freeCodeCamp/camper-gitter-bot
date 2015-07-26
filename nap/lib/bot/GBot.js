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
        GBot.gitter = new Gitter(AppConfig.token);
        var that = this;
        RoomData.map(function(oneRoomData) {
            var roomUrl = oneRoomData.name;
            // console.log("oneRoomData", oneRoomData);
            // clog("gitter.rooms", that.gitter.rooms);
            GBot.gitter.rooms.join(roomUrl, function(err, room) {
                if (err) {
                    console.warn('Not possible to join the room: ', err, roomUrl);
                    return;
                }
                GBot.roomList.push(room)
                GBot.listenToRoom(room);
                clog('joined> ', room.uri);
            });
        })
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
            var text = GBot.getMessage(opts)
            GBot.say(text, room);
            clog('joined> ', room.uri);
            return(room);
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

    getMessage: function(opts) {        
        var text = "----\n";
        if (opts.who && opts.topic) {
            text += "@" + opts.who + " has a question on\n";
            text += "## " + opts.topic;
        } else if (opts.topic) {
            text += "a question on: **" + opts.topic + "**";
        } else if (opts.who) {
            text += "welcome @" + opts.who;
        }
        return(text);
    },

    checkWiki: function(input) {
        assert.isObject(input, "checkWiki expects an object");
        var topic, str, dmLink;

        dmLink = AppConfig.dmLink;

        if (topic = KBase.staticReplies[input.topic])
            return topic;

        if (topic = KBase.getTopic(input.topic)) {
            clog("topic", topic);
            str = "----\n"
            // str += "## " + input.topic + "\n"
            str += topic.data + "\n"
            // str += "----\n"
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
            return (c == input.topic || c==input.text)
        })
        var cmd = cmds[0]
        if (cmd) {
            var res = BotCommands[cmd](input);
            return res;
        }
        return false;
    },

    checkHelp: function(input) {
        assert.isObject(input, "checkHelp expects an object");
        var wiki, str, topic;

        wiki = this.checkWiki(input)
        if (wiki) return wiki;

        str = "searching for **" + input.topic + "**";
        return str;
    },

    // turns raw text input into a json format
    parseInput: function(text) {
        var res, str, topic;
        var blob = {
            text: text
        };

        if (res = text.match(/(help|wiki|check) (.*)/)) {
            blob.topic = res[2]
            blob.help = true
            blob.intent = res[1]
        } else {
            blob.help = false;
        }
        return blob;
    },

    // search all reply methods
    findAnyReply: function(text) {
        var reply, res;
        var input = this.parseInput(text);

        if (input.help == true) {
            return this.checkHelp(input)
        } else if (res = this.checkCommands(input)) {
            return res;
        } else {
            return "you said: " + text;    
        }
        
    },


    listenToRoom: function(room) {
        // gitter.rooms.find(room.id).then(function(room) {

        var events = room.streaming().chatMessages();

        // The 'snapshot' event is emitted once, with the last messages in the room
        // events.on('snapshot', function(snapshot) {
        //     console.log(snapshot.length + ' messages in the snapshot');
        // });

        // The 'chatMessages' event is emitted on each new message
        events.on('chatMessages', function(message) {
            // clog('message> ', message.model.text);
            if (message.operation != "create") {
                // console.log("skip msg reply", msg);
                return;
            }

            if (message.model.fromUser.username == AppConfig.botname) {
                // console.warn("skip reply to bot");
                return;
            }
            GBot.sendReply(message, room);
        });
    },

    sendReply: function(msg, room) {
        var input = msg.model.text;
        clog(" in| " + msg.model.fromUser.username + " > " + input);
        var output = this.findAnyReply(input);
        clog("out|: ", output);
        room.send(output);
        return (output);
    },

    scanRooms: function() {
        var user = this.gitter.currentUser(),
            token = AppConfig.token;

        GitterHelper.fetchRooms(user, token, function(err, rooms) {
            if (err) Utils.error("GBot", "fetchRooms", rooms);
            clog("scanRooms.rooms", rooms);
        });
        
        // GBot.gitter.rooms.find().then(function(rooms) {
        //     clog("found rooms", rooms)
        // })
    },

    // FIXME doesnt work for some reason >.<
    updateRooms: function() {
        GBot.gitter.currentUser()
        .then(function(user) {
            var list = user.rooms(function(err, obj) {
                clog("rooms", err, obj)
            });
            console.log("list", list);
            return(list);
        })
    }

}

module.exports = GBot;