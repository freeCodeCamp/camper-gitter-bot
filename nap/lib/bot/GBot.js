"use strict";


var Gitter = require("node-gitter"),
    GitterHelper = require("../../lib/gitter/GitterHelper");

var AppConfig = require("../../config/AppConfig"),
    RoomData = require("../../data/RoomData"),
    Utils = require("../../lib/utils/Utils"),
    KBase = require("../../lib/bot/KBase"),
    BotCommands = require("../../lib/bot/BotCommands"),
    Bonfires = require("../app/Bonfires");

var RoomMessages = require("../../data/rooms/RoomMessages");

function clog(msg, obj) {
    Utils.clog("GBot>", msg, obj);
}

var GBot = {

    init: function() {
        var that = this;
        // TODO refresh and add oneToOne rooms
        KBase.initSync();
        this.roomList = [];
        this.gitter = new Gitter(AppConfig.token);
        this.joinKnownRooms();
        this.joinBonfireRooms();
        this.gitter.currentUser().then(function(user) {
            that.scanRooms(user, AppConfig.token)
        }, function(err) {
            Utils.error("GBot.currentUser>", "failed", err);
        });
        BotCommands.init(this);
    },

    getName: function() {
        return AppConfig.botlist[0];
    },

    // listen to a known room
    // does a check to see if not already joined according to internal data

    listenToRoom: function(room) {
        // gitter.rooms.find(room.id).then(function (room) {

        if (this.addToRoomList(room) === false) {
            return;
        }

        // Utils.clog("listenToRoom ->", room);
        var chats = room.streaming().chatMessages();

        // The 'chatMessages' event is emitted on each new message
        chats.on("chatMessages", function(message) {
            // clog('message> ', message.model.text);
            if (message.operation !== "create") {
                // console.log("skip msg reply", msg);
                return;
            }

            if (GBot.isBot(message.model.fromUser.username)) {
                // console.warn("skip reply to bot");
                return;
            }
            message.room = room; // why don't gitter do this?
            GBot.handleReply(message);
        });
    },

    handleReply: function(message) {
        clog(message.room.uri + " @" + message.model.fromUser.username + ":");
        clog(" in|",  message.model.text);
        var output = this.findAnyReply(message);
        if (output) {
            clog("out| ", output);
            GBot.say(output, message.room);
            // message.room.send(output);
            // this.listReplyOptions = [];
        }
        return (output);  // for debugging
    },

    //using a callback to get roomId
    sayToRoom: function(text, roomName) {
        var sayIt = function() {
            console.log("sayIt", text, roomName);
            GBot.say(text, roomName);
        }
        var roomId = GitterHelper.findRoomByName(roomName, sayIt);
    },

    say: function(text, room) {
        //Utils.clog("GBot.say:", text, room);
        Utils.hasProperty(room, 'path', 'expected room object'); // did we get a room
        if (!text) {
            console.warn("tried to say with no text");
        }
        try {
            //room.send(text);
            GitterHelper.sayToRoomName(text, room.uri);

        } catch (err) {
            Utils.warn("GBot.say>", "failed", err);
            Utils.warn("GBot.say>", "room", room);
        }
    },

    // search all reply methods
    // returns a string to send
    // handleReply takes care of sending to chat system
    findAnyReply: function(message) {
        var input, output, scanCommand;
        input = this.parseInput(message);
        var listReplyOptionsAvailable = this.findListOption(input);

        if (input.command) {
            // this looks up a command and calls it
            output = BotCommands[input.keyword](input, this);
            if (input.keyword === 'find') {
                this.makeListOptions(output); // this could be moved to the find command?
            }
        } else if (listReplyOptionsAvailable !== false) {
            output = listReplyOptionsAvailable;
        } else {
            // non-command keywords like 'troll'
            scanCommand = RoomMessages.scanInput(input, input.message.room.name, AppConfig.botNoiseLevel);
            if (scanCommand) {
                if (scanCommand.text) {
                    output = (scanCommand.text);
                }
                if (scanCommand.func) {
                    Utils.tlog("func", scanCommand.func);
                    output = scanCommand.func(input, this);
                }
            }
        }
        // TODO - check its a string or nothing
        return output;
    },

    // save a list of options
    // when the bot sends out a list
    makeListOptions: function(output) {
        var matches = [];
        output.replace(/\[([a-zA-Z ]+)\]/g, function(g0,g1){
            matches.push(g1);
        });
        this.listReplyOptions = matches;
        //clog('ListOptions| ', matches);
        return matches;
    },

    // reply option to user
    // if they chose an option from the list
    findListOption: function(input) {
        if (this.listReplyOptions === undefined || this.listReplyOptions[0] === undefined) {
            return false;
        }
        else if (input.cleanText.match(/^[0-9]+$/i) === null) {
            return false;
        }
        else if (this.listReplyOptions[input.cleanText] === undefined) {
            return 'List option **' + input.cleanText + '** not found.';
        }
        //var output = 'User chose option: **' + this.listReplyOptions[input.cleanText] + '**';
        var output = BotCommands['wiki']({ params: this.listReplyOptions[input.cleanText] }, this);
        this.listReplyOptions = [];
        //clog('ListOutput |', 'wiki ' + this.listReplyOptions[input.cleanText]);
        return output;
    },

    // turns raw text input into a json format
    parseInput: function(message) {
        Utils.hasProperty(message, 'model');
        var cleanText, input;

        cleanText = message.model.text;
        cleanText = Utils.sanitize(cleanText);

        input = Utils.splitParams(cleanText);
        input = this.cleanInput(input);
        input.message = message;
        input.cleanText = cleanText;

        if (BotCommands.isCommand(input)) {
            input.command = true;
        }
        return input;

    },

    cleanInput: function(input) {
        // 'bot' keyword is an object = bad things happen when called as a command
        if (input.keyword == 'bot') {
            input.keyword = 'help';
        }
        return input;
    },

    announce: function(opts) {
        clog("announce", opts);
        // this.scanRooms();
        // Utils.clog("announce -->", opts);
        this.joinRoom(opts, true);
        // Utils.clog("announce <ok", opts);
    },

    joinRoom: function(opts, announceFlag) {
        var roomUrl = opts.roomObj.name;

        GBot.gitter.rooms.join(roomUrl, function(err, room) {
            if (err) {
                console.warn("Not possible to join the room: ", err, roomUrl);
                // return null; // check - will this add nulls to the list of rooms?
            }
            GBot.roomList.push(room);
            GBot.listenToRoom(room);
            var text = GBot.getAnnounceMessage(opts);
            GBot.say(text, room);
            // clog("joined> ", room.uri);
            return room;
        });
        return false;
    },

    // checks if joined already, otherwise adds
    addToRoomList: function(room) {
        // check for dupes
        this.roomList = this.roomList || [];
        if (this.hasAlreadyJoined(room, this.roomList)) {
            return false;
        }

        // clog("addToRoomList>", room.name);
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
            return (rm.name === room.name);
        });
        var oneRoom = checks[0];
        if (oneRoom) {
            Utils.warn("GBot", "hasAlreadyJoined:", oneRoom.url);
            return true;
        }
        return false;
    },

    getAnnounceMessage: function(opts) {
        return "";
        // disable
        var text = "----\n";
        if (opts.who && opts.topic) {
            text += "@" + opts.who + " has a question on\n";
            text += "## " + opts.topic;
        } else if (opts.topic) {
            text += "a question on: **" + opts.topic + "**";
        } else if (opts.who) {
            text += "welcome @" + opts.who;
        }
        return text;
    },

    // dont reply to bots or you'll get a feedback loop
    isBot: function(who) {
        // 'of' IS correct even tho ES6Lint doesn't get it
        for (var bot of AppConfig.botlist) {
            if (who === bot) {
                //Utils.warn("GBot", "isBot!");
                return true;
            }
        }
        return false;
    },

    // this joins rooms contained in the data/RoomData.js file
    // ie a set of bot specific discussion rooms
    joinKnownRooms: function() {
        var that = this;
        clog("botname on rooms", AppConfig.getBotName() );
        RoomData.rooms().map(function(oneRoomData) {
            var roomUrl = oneRoomData.name;
            // clog("oneRoomData", oneRoomData);
            // clog("gitter.rooms", that.gitter.rooms);
            that.gitter.rooms.join(roomUrl, function(err, room) {
                if (err) {
                    // Utils.warn("Not possible to join the room:", err, roomUrl);
                    return;
                }
                that.listenToRoom(room);
                clog("joined> ", room.name);
            });
        });
    },


    joinBonfireRooms: function() {
        var that = this;
        Bonfires.allDashedNames().map(function(name) {
            var roomUrl = AppConfig.getBotName() + "/" + name;
            // Utils.clog("bf room", roomUrl);
            that.gitter.rooms.join(roomUrl, function(err, room) {
                if (err) {
                    // Utils.warn("Not possible to join the room:", err, roomUrl);
                    return;
                }
                that.listenToRoom(room);
            });
        });
    },

    // uses gitter helper to fetch the list of rooms this user is "in"
    // and then tries to listen to them
    // this is mainly to pick up new oneOnOne conversations
    // when a user DMs the bot
    // as I can't see an event the bot would get to know about that
    // so its kind of like "polling" and currently only called from the webUI
    scanRooms: function(user, token) {
        var that = this;
        clog("user", user);
        clog("token", token);
        GitterHelper.fetchRooms(user, token, function(err, rooms) {
            if (err) {
                Utils.warn("GBot", "fetchRooms", err);
            }
            if (!rooms) {
                Utils.warn("cant scanRooms");
                return;
            }
            // else
            clog("scanRooms.rooms", rooms);
            rooms.map(function(room) {
                if (room.oneToOne) {
                    clog("oneToOne", room.name);
                    that.gitter.rooms.find(room.id)
                        .then(function(roomObj) {
                            that.listenToRoom(roomObj);
                        });
                }
            });
        });
    },

    // FIXME doesnt work for some reason >.<
    // needs different type of token?
    updateRooms: function() {
        GBot.gitter.currentUser()
            .then(function(user) {
                var list = user.rooms(function(err, obj) {
                    clog("rooms", err, obj);
                });
                clog("user", user);
                clog("list", list);
                return (list);
            });
    }

};

module.exports = GBot;
