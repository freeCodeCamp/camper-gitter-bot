"use strict"

console.log(__dirname);

var AppConfig = require("../../config/AppConfig"),
    GBot = require("../../lib/bot/GBot.js"),
    Rooms = require('../app/Rooms'),
    KBase = require('../bot/KBase'),
    Utils = require('../../lib/utils/Utils'),
    RoomData = require('../../data/RoomData');


function clog(msg, obj) {
    Utils.clog("BotCommands>", msg, obj);
}

var contactBox = "\n if you'd like to help please [get in touch!](https://github.com/bothelpers) :thumbsup: ",
    topLine = "----\n",
    wipHeader = "\n work in progress!";


var BotCommands = {

    init: function(bot) {
        // FIXME - this is sketchy storing references like a global
        // called from the bot where we don't always have an instance
        BotCommands.bot = bot;
    },

    menu: function(input, bot) {
        var msg = Utils.makeMessageFromString('help help');
        return bot.findAnyReply(msg);
    },

    test: function(input, bot) {
        var msg = "All bot systems are go!";
        return msg;
    },

    // TODO - sort alphabetically
    rooms: function(input, bot) {
        var roomNames = bot.roomList.map(function(rm) {
            var uri = "https://gitter.im/" + rm.name
            var link = "\n- [" + rm.name + "](" + uri + ")  "
            return link
        })
        var str = "## rooms" + roomNames
        return(str);
    },

    topics: function(input, bot) {
        var str = "## topics\n"
        var list = KBase.topicList.map(function(t) {
            return (Utils.linkify(t, 'wiki'));
        })
        str += list.join("\n")
        return str;
    },

    welcome: function(input, bot) {
        var str = "## welcome " + input.message.model.fromUser.username;
        str += "\n type `help` for some things the bothelp can do.";
        return str;
    },

    topic: function(input, bot) {
        if (input.topic) {
            return "/topic " + input.topic;
        } else {
            return "what topic do you want to talk about?"
            bot.say("> type topics for a list of topics")
        }
    },

    search: function(input, bot) {
        var str = topLine + wipHeader;
        str += "## search for" + input.text;
        str += "\n results will be here!";
        str += contactBox;
    },

    index: function(input, bot) {
        var str = "## index of all topics";
        str += wipHeader;
        return str;
        // KBase.
    },

    commands: function(input, bot) {
        var str = "## commands:\n";
        str += BotCommands.cmdList.join("\n- ");
        return str;
    },

    // FIXME - this isn't working it seems
    rejoin: function(input, bot) {
        clog("GBot", GBot);
        BotCommands.bot.scanRooms();
        return "rejoined";
    },
    music: function(input, bot) {
        var str = "## Music!"
        str += "\n http://plug.dj/freecodecamp"
        return str
    },

    rickroll: function(input, bot) {
        var fromUser = "@" + input.message.model.fromUser.username
        var str = fromUser + " has a nice video"
        str += "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        return str;
    },

    'wiki-update': function(input, bot) {
        return "WIP wiki-update";
    },

    camperCount: function(input, bot) {
        return "WIP camperCount";
    }

}


// setup aliases
BotCommands.help = BotCommands.menu;
BotCommands.hi = BotCommands.welcome;
// BotCommands.bothelp = BotCommands.menu;
BotCommands.hello = BotCommands.welcome;
// BotCommands['@bothelp hi'] = BotCommands.menu;

// TODO - some of these should be filtered/as private
BotCommands.cmdList = Object.keys(BotCommands);

module.exports = BotCommands;
