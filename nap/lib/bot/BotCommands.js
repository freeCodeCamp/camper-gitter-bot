/*jslint todo: true */
"use strict";

var GBot = require("../../lib/bot/GBot.js"),
    KBase = require("../bot/KBase"),
    Utils = require("../../lib/utils/Utils"),
    AppConfig = require("../../config/AppConfig");

var assert = require("chai").assert;

    // Rooms = require('../app/Rooms'),
    // RoomData = require('../../data/RoomData');


function clog(msg, obj) {
    Utils.clog("BotCommands>", msg, obj);
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

    test: function (input, bot) {
        var msg = "All bot systems are go!";
        return msg;
    },


    wiki: function(input, bot) {
        var output = "", topicData;
        debugger;

        topicData = KBase.getTopicData(input.params);
        if (topicData) {
            output = `**${input.params}** wikiEntry\n`;
            output += topicData.data + "\n";
            output += "\n![bothelp](https://avatars1.githubusercontent.com/bothelp?v=3&s=16)";
            output += " [PM CamperBot](" + AppConfig.topicDmUri(topicData.topic) + ")";
            output += " | [wikilink **" + topicData.topic + "**](" + AppConfig.wikiHost + topicData.topic + ")";
        } else {
            Utils.warn(`cant find topic for [ ${input.params} ]`);
            output = `no wiki entry for ${input.params}`;
        }
        return output;
    },


    thanks: function (input) {
        // assert.isInstanceOf(input, String)
        assert.isObject(input, "checkThanks expects an object");
        var mentions, output, fromUser, toUser;

        clog("thanks input.message>", input.message);

        mentions = input.message.model.mentions;
        if (mentions) {
            // TODO - build a list
            toUser = "@" + mentions[0].screenName;
        }
        fromUser = "@" + input.message.model.fromUser.username;
        output = fromUser + " sends karma to " + toUser;
        output += "\n :thumbsup: :thumbsup: :thumbsup: :thumbsup: :thumbsup: :sparkles: :sparkles: ";
        return output;
    },


    init: function (bot) {
        // FIXME - this is sketchy storing references like a global
        // called from the bot where we don't always have an instance
        BotCommands.bot = bot;
    },

    help: function (input, bot) {
        // input;
        // var msg = Utils.makeMessageFromString("help help");
        // return "try this: `wiki $topic` or topics for a list";
        // return bot.findAnyReply(msg);
        if (input.params) {
            return this.wiki(input, bot);
        } else {
            var topicData = KBase.getTopicData("help");
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

    // search: function (input, bot) {
    //     var str = topLine + wipHeader;
    //     str += "## search for" + input.text;
    //     str += "\n results will be here!";
    //     str += contactBox;
    //     return str;
    // },

};


// setup aliases
// BotCommands.help = BotCommands.menu;
BotCommands.hi = BotCommands.welcome;
// BotCommands.bothelp = BotCommands.menu;
BotCommands.hello = BotCommands.welcome;
BotCommands.index = BotCommands.topics;

// BotCommands['@bothelp hi'] = BotCommands.menu;

// TODO - some of these should be filtered/as private
BotCommands.cmdList = Object.keys(BotCommands);

module.exports = BotCommands;
