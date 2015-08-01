"use strict";

function clog(msg, obj) {
    Utils.clog("BotCommands>", msg, obj);
}

// function tlog(msg, obj) {
//     Utils.warn("BotCommands>", msg, obj);
// }

var KBase = require("../../bot/KBase"),
    Utils = require("../../../lib/utils/Utils"),
    TextLib = require("../../../lib/utils/TextLib"),
    AppConfig = require("../../../config/AppConfig");


var commands = {

    wikiLink: function(params) {
        if (!params) { return ""; }
        var link = Utils.linkify(params, "wiki" );
        return link;
    },

    footer: function(params) {
        var link = this.wikiLink(params);
        var str = "";
        // str += "\n----";
        // str += "\n![bothelp](https://avatars1.githubusercontent.com/bothelp?v=3&s=16)  ";
        // str += "\n\nFCC wiki > [" + link + " ] :pencil: ";
        str += `\n:pencil: [read more on the FCC wiki](${link})\n`;
        // output += " [PM CamperBot](" + AppConfig.topicDmUri(topicData.topic) + ")";
        return str;
    },

    wikiUsage: function() {
        // return
        var output = "usage:\n";
        output += "    `wiki $topic`   info on that topic\n";
        output += "    `topics`    for a list of topics\n";
        return output;
    },

    wikiCantFind: function(input) {
        Utils.warn("wiki.js", "cant find topic for", input.params);
        var output = "no wiki entry for: `" + input.params + "`";
        output += "\nwhy not :pencil: ";
        output += this.wikiLink(input.params, "wiki", "create one?");
        output += "\n you could also try typing `find " + input.params + "`";
        return output;
    },

    wiki: function(input, bot) {
        var output = "", topicData;
        // debugger;
        if (!input.params) { return this.wikiUsage(); }
        // else
        topicData = KBase.getTopicData(input.params);
        if (!topicData) { return this.wikiCantFind(input); }

        // else OK

        var link = Utils.linkify(input.params, "wiki");
        output = `## :pencil: ${link} \n`;
        output += topicData.shortData;
        // output += this.footer(input.params);
        return output;
    }
};

module.exports = commands;
