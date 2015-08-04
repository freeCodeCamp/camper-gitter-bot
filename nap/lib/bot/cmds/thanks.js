/*jslint todo: true */
"use strict";

var // GBot = require("../../../lib/bot/GBot.js"),
    //KBase = require("../../bot/KBase"),
    Utils = require("../../../lib/utils/Utils"),
    //AppConfig = require("../../../config/AppConfig"),
    HttpWrap = require("../../../lib/utils/HttpWrap");



//var newline = '\n';

//var clog = require('../../utils/clog.js');

// clog("clog from thanks");

// function clog(msg, obj) {
//     Utils.clog("BotCommands>", msg, obj);
// }

// function tlog(msg, obj) {
//     Utils.warn("BotCommands>", msg, obj);
// }

// in case we want to filter the message
function cleanMessage(message) {
    return message;
    //if (message.match(/^count not/)) {
    //     //fix typo
    //}
    //return message;
}

var showInfo = function(input, bot, blob) {
    Utils.clog('thanks', "showInfo", blob);

    if (blob.error) {
        var message = cleanMessage(blob.error.message);
        message += Utils.betaFooter();
        bot.say(message, input.message.room);
        Utils.warn("WARN @thanks>", blob.error.message, blob.error);
        return false;
    }

    var username = blob.about.username;
    var about = blob.about;
    var bio = about.bio || "no bio set";

    var str = `
![${username}](https://avatars2.githubusercontent.com/${username}?&s=64) | [${username}](http://www.freecodecamp.com/${username})
-------------                       | -------------
:star: ${about.browniePoints}       | ${bio}

`;
    //Utils.clog("thanks callback>", str);
    bot.say(str, input.message.room);
};

var bpCallback = function (apiRes, options) {
    Utils.clog("bpCallback", "options", options);
    showInfo(options.input, options.bot, apiRes);
};


var commands = {
    thanks: function (input, bot) {
        Utils.hasProperty(input, "message", "thanks expects an object");

        var mentions, output, fromUser, toUser, toUserMessage;
        mentions = input.message.model.mentions;
        if (!mentions) { return null; } // just 'thanks' in a message

        fromUser = input.message.model.fromUser.username.toLowerCase();
        var options = {
            method: 'POST',
            input: input,
            bot: bot
        };

        var namesList = mentions.map(function (m) {
            toUser = m.screenName.toLowerCase();
            var apiPath = "/api/users/give-brownie-points?receiver=" + toUser + "&giver=" + fromUser;
            HttpWrap.callApi(apiPath, options, bpCallback);
            return toUser;
        });
        toUserMessage = namesList.join(" and @");
        output = "> " + fromUser + " sends brownie points to @" + toUserMessage;
        output += " :sparkles: :thumbsup: :sparkles: ";
        return output;
    }
};

module.exports = commands;
