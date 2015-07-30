"use strict";



var expect = require("chai").expect;
var Gitter = require("node-gitter"),
    GitterHelper = require("../../lib/gitter/GitterHelper");

var AppConfig = require("../../config/AppConfig"),
    RoomData = require("../../data/RoomData"),
    Utils = require("../../lib/utils/Utils"),
    KBase = require("../../lib/bot/KBase"),
    BotCommands = require("../../lib/bot/BotCommands"),
    Bonfires = require("../app/Bonfires");

function clog(msg, obj) {
    Utils.clog("GBot>", msg, obj);
}

var GBot = {

    init: function () {
        // TODO refresh and add oneToOne rooms
        KBase.initAsync();
        this.roomList = [];
        this.gitter = new Gitter(AppConfig.token);
        this.joinKnownRooms();
        this.joinBonfireRooms();
        this.scanRooms();
        BotCommands.init(this);
    },

    getName: function () {
        return AppConfig.botlist[0];
    },

    say: function (text, input) {
        expect(input.message).to.exist;
        expect(input.message.room).to.exist;
        var room = input.message.room;
        room.send(text);
    },

    // main IO routine called from room listener
    handleReply: function (message) {
        clog(" in|", message.model.fromUser.username + "> " + message.model.text);
        var output = this.findAnyReply(message);
        clog("out| ", output);
        message.room.send(output);
        return (output);
    },

    // search all reply methods
    // returns a string to send
    // handleReply takes care of sending to chat system
    findAnyReply: function (message) {
        var input, output;
        debugger;
        input = this.parseInput(message);
        if (input.command) {
            output = BotCommands[input.keyword](input, this);
        }
        return output;
    },

    // turns raw text input into a json format
    parseInput: function (message) {
        var cleanText, input;

        cleanText = message.model.text;
        cleanText = Utils.sanitize(cleanText);

        input = Utils.splitParams(cleanText);
        input.message = message;
        input.cleanText = cleanText;

        if (BotCommands.isCommand(input)) {
            input.command = true;
        }

        clog("input", input);
        return input;
    },


    // ---------------- room related ----------------


    announce: function (opts) {
        this.scanRooms();
        this.joinRoom(opts, true);
    },

    joinRoom: function (opts) {
        var roomUrl = opts.roomObj.name;
        GBot.gitter.rooms.join(roomUrl, function (err, room) {
            if (err) {
                console.warn("Not possible to join the room: ", err, roomUrl);
                return null; // check - will this add nulls to the list of rooms?
            }
            GBot.roomList.push(room);
            GBot.listenToRoom(room);
            var text = GBot.getAnnounceMessage(opts);
            GBot.say(text, room);
            clog("joined> ", room.uri);
            return room;
        });
        return false;
    },

    // checks if joined already, otherwise adds
    addToRoomList: function (room) {
        // check for dupes
        this.roomList = this.roomList || [];
        if (this.hasAlreadyJoined(room, this.roomList)) {
            return false;
        }

        clog("addToRoomList", room.name);
        this.roomList.push(room);
        return true;
    },

    // checks if a room is already in bots internal list of joined rooms
    // this is to avoid listening twice
    // see https://github.com/gitterHQ/node-gitter/issues/15
    // note this is only the bots internal tracking
    // it has no concept if the gitter API/state already thinks you're joined/listening
    hasAlreadyJoined: function (room) {
        var checks = this.roomList.filter(function (rm) {
            return (rm.name === room.name);
        });
        var checkOne = checks[0];
        if (checkOne) {
            Utils.warning("GBot", "hasAlreadyJoined:", checkOne);
            return true;
        }
        return false;
    },


    getAnnounceMessage: function (opts) {
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

    // dont reply to bots
    isBot: function(who) {
        for (var bot of AppConfig.botlist) {
            if (who === bot) {
                Utils.warn("GBot", "isBot!");
                return true;
            }
        }
        return false;
    },

    // listen to a know room
    // does a check to see if not already joined according to internal data
    listenToRoom: function (room) {
        // gitter.rooms.find(room.id).then(function (room) {

        if (this.addToRoomList(room) === false) {
            return;
        }

        var chats = room.streaming().chatMessages();
        // The 'chatMessages' event is emitted on each new message
        chats.on("chatMessages", function (message) {
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

    // this joins rooms contained in the data/RoomData.js file
    // ie a set of bot specific discussion rooms
    joinKnownRooms: function () {
        var that = this;
        RoomData.map(function (oneRoomData) {
            var roomUrl = oneRoomData.name;
            // console.log("oneRoomData", oneRoomData);
            // clog("gitter.rooms", that.gitter.rooms);
            that.gitter.rooms.join(roomUrl, function (err, room) {
                if (err) {
                    // Utils.warn("Not possible to join the room:", err, roomUrl);
                    return;
                }
                that.listenToRoom(room);
                clog("joined> ", room.name);
            });
        });
    },


    joinBonfireRooms: function () {
        var that = this;
        Bonfires.allDashedNames().map(function (name) {
            var roomUrl = AppConfig.currentBot() + "/" + name;
            // Utils.clog("bf room", roomUrl);
            that.gitter.rooms.join(roomUrl, function (err, room) {
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
    scanRooms: function (user, token) {
        user = user || this.gitter.currentUser();
        token = token || AppConfig.token;

        clog("user", user);
        clog("token", token);
        var that = this;

        GitterHelper.fetchRooms(user, token, function (err, rooms) {
            if (err) {
                Utils.error("GBot", "fetchRooms", rooms);
            }
            clog("scanRooms.rooms", rooms);
            if (!rooms) {
                Utils.warn("cant scanRooms");
                return;
            }
            // else
            rooms.map(function (room) {
                if (room.oneToOne) {
                    clog("oneToOne", room.name);
                        that.gitter.rooms.find(room.id).then(function (roomObj) {
                        that.listenToRoom(roomObj);
                    });
                }
            });
        });
        // GBot.gitter.rooms.find().then(function (rooms) {
        //     clog("found rooms", rooms)
        // })
    },

    // FIXME doesnt work for some reason >.<
    // needs different type of token?
    updateRooms: function () {
        GBot.gitter.currentUser()
            .then(function (user) {
                var list = user.rooms(function (err, obj) {
                    clog("rooms", err, obj);
                });
                clog("user", user);
                clog("list", list);
                return (list);
            });
    }

};

module.exports = GBot;

