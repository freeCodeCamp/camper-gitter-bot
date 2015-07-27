"use strict"

console.log(__dirname);

var GBot = require("../../lib/bot/GBot.js"),
    Rooms = require('../app/Rooms'),
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

    status: function(input, bot) {        
        var list = bot.roomList.map(function(rm) {
            return rm.name;
        })
        var str = "## roomList\n - "
        str += list.join("\n - ")
        // str += "- " + JSON.stringify(list,null,2) + "```";
        clog("status", str);
        return(str);
    },

    topics: function(input, bot) {
        return "topics command"
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
