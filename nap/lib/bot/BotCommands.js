/*jslint todo: true */
"use strict";

var assert = require("chai").assert;
var _ = require("lodash");

var GBot = require("../../lib/bot/GBot.js"),
    KBase = require("../bot/KBase"),
    Utils = require("../../lib/utils/Utils"),
    TextLib = require("../../lib/utils/TextLib"),
    AppConfig = require("../../config/AppConfig"),
    Bonfires = require("../app/Bonfires"),
    InputWrap = require("../bot/InputWrap");

// var httpSync = require('http-sync');


var newline = '\n';

    // Rooms = require('../app/Rooms'),
    // RoomData = require('../../data/RoomData');


function clog(msg, obj) {
    Utils.clog("BotCommands>", msg, obj);
}

function tlog(msg, obj) {
    Utils.warn("BotCommands>", msg, obj);
}

// function tlog(p1, p2, p3, p4) {
//     Utils.tlog("BotCommands>", p1, p2, p3, p4);
// }


// var contactBox = "\n if you'd like to help please [get in touch!](https://github.com/freecodecamp/freecodecamp) :thumbsup: ",
//     topLine = "----\n",
//     wipHeader = "\n work in progress!";


var BotCommands = {

    isCommand: function (input) {
        var cmds, one, res;
        cmds = BotCommands.cmdList.filter(function (c) {
            return (c === input.keyword);
        });
        one = cmds[0];
        if (one) {
            res = true;
        } else {
            res = false;
            Utils.warn('isCommand', 'not command', input);
            Utils.warn('isCommand',
                `[ isCommand: ${input.keyword} ] one: ${one} | res ${res} ` );
        }
        return res;
    },

    version: function(){
        return "botVersion: " + AppConfig.botVersion;
    },

    test: function (input, bot) {
        var msg = "All bot systems are go!  \n";
        msg += this.version();
        return msg;
    },

    // bonfire features
    hint: function(input, bot) {
        var str;
        str = Bonfires.getHint(input);
        return (str);
    },

    links: function(input, bot) {
        var str;
        str = Bonfires.getLinksFromInput(input);
        return str;
    },

    seed: function(input, bot) {
        var str;
        str = Bonfires.getChallengeSeedFromInput(input);
        return str;
    },

    archive: function(input, bot) {
        var str, roomName, shortName, roomUri, timeStamp;
        roomName = input.message.room.name;
        shortName = InputWrap.roomShortName(input);

        roomUri = AppConfig.gitterHost + roomName + "/archives/" ;
        str = "Archives for **" + shortName + "**" + newline;
        str += "\n- [All Time](" + roomUri + "all)";

        timeStamp = Utils.timeStamp("yesterday");
        str += "\n- [Yesterday](" + roomUri + timeStamp + ")";

        // tlog(str);

        return str;
        // https://gitter.im/dcsan/botzy/archives/all
        // date ; //# => Thu Mar 31 2011 11:14:50 GMT+0200 (CEST)        
        // https://gitter.im/bothelp/GeneralChat/archives/2015/07/25
    },

    init: function (bot) {
        // FIXME - this is sketchy storing references like a global
        // called from the bot where we don't always have an instance
        BotCommands.bot = bot;
    },

    // help on its own we return `help bothelp`
    help: function (input, bot) {
        // input;
        // var msg = Utils.makeMessageFromString("help help");
        // return "try this: `wiki $topic` or topics for a list";
        // return bot.findAnyReply(msg);
        if (input.params) {
            return this.wiki(input, bot);
        } else {
            var topicData = KBase.getTopicData("bothelp");
            return topicData.data;
        }
    },

    menu: function (input, bot) {
        var msg = "type help for a list of things the bot can do";
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
        str += "\n type `help` for some things the bot can do.";
        return str;
    },

    // gitter limits to first 10 lines or so
    // TODO - pagination
    topics: function (input, bot) {
        var str, shortList, list;
        str = "## topics\n";
        shortList = KBase.topicList.slice(0, 10);
        list = shortList.map(function (t) {
            return (Utils.linkify(t, "wiki"));
        });
        str += list.join("\n");
        // clog("shortList", shortList);
        // clog("topics", str);
        // return "list"
        return str;
    },

    find: function (input, bot) {
        var str = `find **${input.params}**\n`;
        var shortList = KBase.findTopics(input.params);
        bot.context = {
            state: "finding",
            commands: shortList.commands
        };
        str += shortList;
        clog("find", str);
        return (str);
    },

    commands: function (input, bot) {
        var str = "## commands:\n- ";
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
        var str = "## Music!";
        str += "\n http://plug.dj/freecodecamp";
        return str;
    },

    rickroll: function (input, bot) {
        var fromUser = "@" + input.message.model.fromUser.username;
        var str = fromUser + " has a nice video";
        str += "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        return str;
    },

    wikiUpdate: function (input, bot) {
        return "WIP wiki-update";
    },

    camperCount: function (input, bot) {
        return "WIP camperCount";
    },

    search: function (input, bot) {

        var data = KBase.search(input.params);
        return "searching for " + data;

        // var str = topLine + wipHeader;
        // str += "## search for" + input.text;
        // str += "\n results will be here!";
        // str += contactBox;
        return str;
    },

};

BotCommands.about = require("./cmds/about");
BotCommands.thanks = require("./cmds/thanks");

// TODO - iterate and read all files in /cmds
var wiki = require("./cmds/wiki"),
    thanks = require("./cmds/thanks");

_.merge(BotCommands, wiki, thanks);

// Object.assign(BotCommands, wiki);


// setup aliases
// BotCommands.help = BotCommands.menu;
BotCommands.hi = BotCommands.welcome;
// BotCommands.bothelp = BotCommands.menu;
BotCommands.hello = BotCommands.welcome;
BotCommands.index = BotCommands.topics;

BotCommands.log = BotCommands.archive;
BotCommands.archives = BotCommands.archive;

// BotCommands['@bothelp hi'] = BotCommands.menu;

// TODO - some of these should be filtered/as private
BotCommands.cmdList = Object.keys(BotCommands);

clog(BotCommands.cmdList);

module.exports = BotCommands;
