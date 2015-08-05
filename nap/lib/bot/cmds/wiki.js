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

    // wikiLink: function(params) {
    //     if (!params) { return ""; }
    //     var link = Utils.linkify(params, "wiki" );
    //     return link;
    // },

    wikiFooter: function(params) {
        var text = ("read more about " + params + " on the FCC Wiki");
        var link = Utils.linkify(params, "wiki", text );
        var str = "";
        // str += "\n----";
        // str += "\n![bothelp](https://avatars1.githubusercontent.com/bothelp?v=3&s=16)  ";
        // str += "\n\nFCC wiki > [" + link + " ] :pencil: ";
        str += "\n:pencil: " + link;
        // output += " [PM CamperBot](" + AppConfig.topicDmUri(topicData.dashedName) + ")";
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
        output += "\n:pencil: ";
        output += Utils.linkify(input.params, "wiki", "click here to create one now!");
        output += "after creating your page type `update` to reload it here";
        //output += "\n you could also try typing `find " + input.params + "`";
        return output;
    },

    wiki: function(input, bot) {
        var output, topicData;
        // debugger;
        if (!input.params) { return this.wikiUsage(); }
        // else
        topicData = KBase.getTopicData(input.params);
        if (!topicData) {
            Utils.warn("cant find topic for ", input.params);
            return this.wikiCantFind(input);
        }

        // else OK
        Utils.log('topicData', topicData);
        var link = Utils.linkify(topicData.dashedName, "wiki", topicData.displayName + "  [wiki]");
        output = '## :point_right: ' + link + '\n';
        output += topicData.shortData;
        output += this.wikiFooter(topicData.dashedName);
        return output;
    }
};

module.exports = commands;
