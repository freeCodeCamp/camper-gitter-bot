"use strict"

console.log(__dirname);

var GBot = require("../../lib/bot/GBot.js"),
    Rooms = require('../app/Rooms'),
    Utils = require('../../lib/utils/Utils'),
    RoomData = require('../../data/RoomData');


function clog(msg, obj) {
    Utils.clog("BotCommands>", msg, obj);
}

var BotCommands = {

    init: function(bot) {
        // FIXME - this is sketchy storing references like a global
        BotCommands.bot = bot;
    },

    menu: function(input, bot) {
        return "menu command";
    },

    status: function(bot) {
        return "status command"
    },

    topics: function(bot) {
        return "topics command"
    },

    index: function(bot) {
        var str = "## index of all topics"
        // KBase.
    },

    rejoin: function() {
        clog("GBot", GBot);
        BotCommands.bot.scanRooms();
        return "rejoined";
    }

}


// setup aliases?
BotCommands.help = BotCommands.menu;

// TODO - some of these should be filtered/as private
BotCommands.cmdList = Object.keys(BotCommands);

module.exports = BotCommands;
