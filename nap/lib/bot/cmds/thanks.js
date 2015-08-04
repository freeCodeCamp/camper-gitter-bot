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


var commands = {

    thanks: function (input, bot) {
        Utils.hasProperty(input, "message", "thanks expects an object");

        var mentions, output, fromUser, toUser, toUserMessage;
        mentions = input.message.model.mentions;
        if (mentions && mentions.length === 0 ) { return null; } // just 'thanks' in a message

        fromUser = input.message.model.fromUser.username.toLowerCase();
        var options = {
            method: 'POST',
            input: input,
            bot: bot
        };

        var namesList = mentions.map(function (m) {
            toUser = m.screenName.toLowerCase();
            var apiPath = "/api/users/give-brownie-points?receiver=" + toUser + "&giver=" + fromUser;
            HttpWrap.callApi(apiPath, options, commands.showInfo);
            return toUser;
        });
        toUserMessage = namesList.join(" and @");
        output = "> " + fromUser + " sends brownie points to @" + toUserMessage;
        output += " :sparkles: :thumbsup: :sparkles: ";
        return output;
    },

    about: function(input, bot) {
        // var mentioned = InputWrap.mentioned(input);
        var mentions, them, name;

        mentions = input.message.model.mentions;
        them = mentions[0];
        if (!them) {
            return "you need to ask about @someone!";
        }
        name = them.screenName.toLowerCase();
        var options = {
            method: 'GET',
            input: input,
            bot: bot
        }

        var apiPath = '/api/users/about?username=' + name;
        HttpWrap.callApi(apiPath, options, commands.showInfo);
    },

    // called back from apiCall
    // blob:
    //      response
    //      bot
    //      input

    showInfo: function(blob) {
        //Utils.clog('thanks>', "showInfo>", blob);

        if (blob.response.error) {
            var message = cleanMessage(blob.response.error.message);
            message += Utils.betaFooter();
            Utils.warn("WARN @thanks>", blob.response.error.message, blob.response.error);
            //blob.bot.say(message, blob.input.message.room);
            return false;
        }

        var username = blob.response.about.username;
        var about = blob.response.about;
        var bio = blob.response.about.bio || "no bio set";

        var str = `
![${username}](https://avatars2.githubusercontent.com/${username}?&s=32) | [${username}](http://www.freecodecamp.com/${username})
        -------------                       | -------------
        :star: ${about.browniePoints}       | ${bio}

        `;
        //Utils.clog("thanks callback>", str);
        blob.bot.say(str, blob.input.message.room);
    }

};

module.exports = commands;
