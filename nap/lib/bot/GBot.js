"use strict";

var assert = require("chai").assert;
var Gitter = require('node-gitter');

var AppConfig = require('../../config/AppConfig'),
    RoomData = require('../../data/RoomData.js'),
    KBase = require("../../lib/bot/KBase.js");

function clog(msg, obj) {
    obj = obj || "";
    console.log("GBot>", msg, obj);
}

var GBot = {

    init: function() {
        KBase.initAsync();
        this.roomList = [];
        this.gitter = new Gitter(AppConfig.token);
        var that = this;
        RoomData.map(function(oneRoomData) {
            var roomUrl = oneRoomData.name;
            // console.log("oneRoomData", oneRoomData);
            console.log("gitter.rooms", that.gitter.rooms);
            that.gitter.rooms.join(roomUrl, function(err, room) {
                if (err) {
                    console.warn('Not possible to join the room: ', err, roomUrl);
                    return;
                }
                GBot.roomList.push(room)
                GBot.listenToRoom(room);
                clog('joined> ', room.uri);
            });
        })
        GBot.status();  // gets called async TODO - use a promise
    },

    status: function() {
        console.log("----- GBot.status>");
        GBot.roomList.map(function(rm) {
            clog(">", rm.name);
        })        
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
                // console.log("------");
                // console.log('operation> ' + message.operation);
                // console.log('model> ', message.model);
                clog('message> ', message.model.text);
                // console.log('room> ', room);
                // console.log("------");
                GBot.sendReply(message, room);
            });
        // });

    },


    getName: function() {
        return AppConfig.botname;
    },

    say: function(text, room) {
        room.send(text);
    },

    // when a new user comes into a room
    announce: function(opts) {
        clog("Bot.announce", opts);

        var text = "----\n";
        var rooms = GBot.roomList.filter(function(rm) {
            console.log("checking room", rm.name, opts.roomObj.name);
            var match = (rm.name == opts.roomObj.name);
            if (match) {
                console.log("matched!")
                return true;
            }
            return false;
        })
        // clog("found rooms", rooms);

        if (opts.who && opts.topic) {
            text += "@" + opts.who + " has a question on\n";
            text += "## " + opts.topic;
        } else if (opts.topic) {
            text += "a question on: **" + opts.topic + "**";
        } else if (opts.who) {
            text += "welcome @" + opts.who;
        }
        GBot.say(text, rooms[0]);
    },

    checkWiki: function(input) {
        assert.isObject(input, "checkWiki expects an object");
        var topic, str;

        if (topic = KBase.staticReplies[input.topic])
            return topic;

        if (topic = KBase.getTopic(input.topic)) {
            clog("topic", topic);
            str = "----\n"
            // str += "## " + input.topic + "\n"
            str += topic.data + "\n"
            // str += "----\n"
            str += "\n> [wikilink: " + topic.topic + "](https://github.com/bothelpers/kbase/wiki/" + topic.topic + ")"
            str += "\n> [DM bothelp](https://gitter.im/bothelp)"
            return str
        }
        // else
        return null
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
        }

        // default
        return "you said: " + text;
    },

    sendReply: function(msg, room) {
        if (msg.operation != "create") {
            console.log("skip msg reply", msg);
            return;
        }
        // console.log("msg\n", msg);
        // console.log("GBot\n", GBot);

        if (msg.model.fromUser.username == AppConfig.botname) {
            console.warn("skip reply to bot");
            return;
        }
        var input = msg.model.text;

        console.log(" in| " + msg.model.fromUser.username + " > " + input);

        // var output = input.toUpperCase();
        var output = this.findAnyReply(input);
        console.log("out|: ", output);
        room.send(output);
        return (output);
    },

    updateRooms: function() {
        this.gitter.currentUser()
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