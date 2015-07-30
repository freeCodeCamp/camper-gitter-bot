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

    wiki: function(input, bot) {
        var output = "", topicData;
        debugger;

        topicData = KBase.getTopicData(input.params);
        clog('topicData', topicData);
        if (topicData) {
            var wikilink = AppConfig.wikiHost + topicData.topic;
            // output += " | [wikilink **" + topicData.topic + "**](" +  +  + ")";
            output = `### [${input.params}](${wikilink})\n`;
            output += TextLib.trimLines(topicData.data);
            output += "\n----"
            output += "\n![bothelp](https://avatars1.githubusercontent.com/bothelp?v=3&s=16)";
            output += ` [edit the wiki](${wikilink})\n`;
            // output += " [PM CamperBot](" + AppConfig.topicDmUri(topicData.topic) + ")";
            
        } else {
            Utils.warn(`cant find topic for [ ${input.params} ]`);
            output = `no wiki entry for ${input.params}`;
        }
        return output;
    }
};

module.exports = commands;
