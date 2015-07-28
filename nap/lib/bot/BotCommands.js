/*jslint todo: true */
/*global it */

"use strict";



var AppConfig = require("../../config/AppConfig"),
    GBot = require("../../lib/bot/GBot.js"),
    Rooms = require('../app/Rooms'),
    KBase = require('../bot/KBase'),
    Utils = require('../../lib/utils/Utils'),
    RoomData = require('../../data/RoomData');


function clog(msg, obj) {
    Utils.clog("BotCommands>", msg, obj);
}

var contactBox = "\n if you'd like to help please [get in touch!](https://github.com/freecodecamp/freecodecamp) :thumbsup: ",
    topLine = "----\n",
    wipHeader = "\n work in progress!";


var BotCommands = {

    init: function (bot) {
        // FIXME - this is sketchy storing references like a global
        // called from the bot where we don't always have an instance
        BotCommands.bot = bot;
    },

    menu: function (input, bot) {
        // input;
        var msg = Utils.makeMessageFromString('help help');
        return bot.findAnyReply(msg);
    },

    test: function (input, bot) {
        var msg = "All bot systems are go!";
        return msg;
    },

    // TODO - sort alphabetically
    rooms: function (input, bot) {
        var uri, link, str, roomNames;
        roomNames = bot.roomList.map(function (rm) {
            uri = "https://gitter.im/" + rm.name;
            link = "\n- [" + rm.name + "](" + uri + ")  ";
            return link;
        });
        str = "## rooms" + roomNames;
        return str;
    },

    welcome: function (input, bot) {
        var str = "## welcome " + input.message.model.fromUser.username;
        str += "\n type `help` for some things the bothelp can do.";
        return str;
    },

    // topic: function (input, bot) {
    //     if (input.topic) {
    //         return "/topic " + input.topic;
    //     } else {
    //         return "what topic do you want to talk about?"
    //         bot.say("> type topics for a list of topics")
    //     }
    // },

    // gitter limits to first 10 lines or so
    // DOME - pagination
    topics: function (input, bot) {
        var str, shortList, list;
        str = "## topics\n";
        shortList = KBase.topicList.slice(0, 10);
        list = shortList.map(function (t) {
            return (Utils.linkify(t, 'wiki'));
        });
        str += list.join("\n");
        clog("shortList", shortList);
        clog("topics", str);
        // return "list"
        return str;
    },

    find: function (input, bot) {
        var str = `find **${input.params}**\n`;
        var shortList = KBase.findTopics(input.params);
        bot.context = {
            state: "finding",
            commands: shortList.commands
        }
        str += shortList;
        clog("find", str);
        return (str);
    },

    // search: function (input, bot) {
    //     var str = topLine + wipHeader;
    //     str += "## search for" + input.text;
    //     str += "\n results will be here!";
    //     str += contactBox;
    //     return str;
    // },

    commands: function (input, bot) {
        var str = "## commands:\n";
        str += BotCommands.cmdList.join("\n- ");
        return str;
    },

    // FIXME - this isn't working it seems
    rejoin: function (input, bot) {
        clog("GBot", GBot);
        BotCommands.bot.scanRooms();
        return "rejoined";
    },
    music: function (input, bot) {
        var str = "## Music!"
        str += "\n http://plug.dj/freecodecamp"
        return str
    },

    rickroll: function (input, bot) {
        var fromUser = "@" + input.message.model.fromUser.username
        var str = fromUser + " has a nice video"
        str += "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        return str;
    },

    'wiki-update': function (input, bot) {
        return "WIP wiki-update";
    },

    camperCount: function (input, bot) {
        return "WIP camperCount";
    }

}


// setup aliases
BotCommands.help = BotCommands.menu;
BotCommands.hi = BotCommands.welcome;
// BotCommands.bothelp = BotCommands.menu;
BotCommands.hello = BotCommands.welcome;
BotCommands.index = BotCommands.topics;

// BotCommands['@bothelp hi'] = BotCommands.menu;

// TODO - some of these should be filtered/as private
BotCommands.cmdList = Object.keys(BotCommands);

module.exports = BotCommands;
