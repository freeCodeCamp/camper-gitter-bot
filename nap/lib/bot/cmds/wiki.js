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
        var link = Utils.linkify(params, "wiki");
        return link;
    },

    footer: function(params) {
        var link = this.wikiLink(params);
        var str = "";
        // str += "\n----";
        // str += "\n![bothelp](https://avatars1.githubusercontent.com/bothelp?v=3&s=16)  ";
        str += "\n\nFCC wiki > [" + link + " ] :pencil: ";
        // str += ` [edit the wiki](${link})\n`;
        // output += " [PM CamperBot](" + AppConfig.topicDmUri(topicData.topic) + ")";
        return str;
    },

    wiki: function(input, bot) {
        var output = "", topicData;
        // debugger;
        if (!input.params) {
            output = "usage:\n";
            output += "    `wiki $topic`   info on that topic\n";
            output += "    `topics`    for a list of topics\n";
            return output;
        }
        // else
        topicData = KBase.getTopicData(input.params);
        clog('topicData', topicData);
        if (topicData) {
            var link = this.wikiLink(input.params);
            output = `## :pencil: ${link} \n`;
            output += topicData.shortData;
        } else {
            Utils.warn("wiki.js", "cant find topic for", input.params);
            output = "no wiki entry for: `" + input.params + "`";
            output += "\nwhy not create one?";
            output += "\n:pencil: " + this.wikiLink(input.params);
        }

        // output += this.footer(input.params);
        return output;
    }
};

module.exports = commands;
