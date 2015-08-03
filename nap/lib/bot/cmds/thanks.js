/*jslint todo: true */
"use strict";

var assert = require("chai").assert;

var GBot = require("../../../lib/bot/GBot.js"),
    KBase = require("../../bot/KBase"),
    Utils = require("../../../lib/utils/Utils"),
    AppConfig = require("../../../config/AppConfig"),
    HttpWrap = require("../../../lib/utils/HttpWrap");



var newline = '\n';

var clog = require('../../utils/clog.js');

// clog("clog from thanks");

// function clog(msg, obj) {
//     Utils.clog("BotCommands>", msg, obj);
// }

// function tlog(msg, obj) {
//     Utils.warn("BotCommands>", msg, obj);
// }


function cleanMessage(message) {
    return "Couldn't find that user at FCC :frowning: \nCheck their github ID matches their FCC ID!";
    //if (message.match(/^count not/)) {
        // fix typo
    //}
    //return message;
}

var showInfo = function(input, bot, blob) {
    Utils.clog('thanks', "showInfo", blob);

    if (blob.error) {
        var message = cleanMessage(blob.error.message);
        message += Utils.betaFooter();
        //bot.say(message, input.message.room);
        Utils.warn("WARN @thanks>", blob.error.message);
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
    bot.say(str, input.message.room);
};

var bpCallback = function (apiRes, options) {
    Utils.clog("bpCallback", "options", options);
    showInfo(options.input, options.bot, apiRes);
};


var commands = {
    thanks: function (input, bot) {
        assert.isObject(input, "checkThanks expects an object");
        var mentions, output, fromUser, toUser, toUserMessage;

        //clog("thanks input.message>", input.message);

        mentions = input.message.model.mentions;
        if (mentions) {
            // TODO - build a list
            console.log(mentions);
            var namesList = mentions.map(function (m) {
                console.log(m.screenName);
                return m.screenName;
            });

            console.log(namesList);
            toUserMessage = namesList.join(", ").toLowerCase();

            var options = {
                method: 'POST',
                input: input,
                bot: bot
            };

            for (var i = 0; i < namesList.length; i++) {
                Utils.log('names', namesList);
                Utils.log('firstName', namesList[i]);
                toUser = namesList[i];
                var apiPath = "/api/users/give-brownie-points?receiver=" + toUser + "&giver=" + fromUser;
                HttpWrap.callApi(apiPath, options, bpCallback);
            }
        }

        fromUser = input.message.model.fromUser.username.toLowerCase();
        output = "> " + fromUser + " sends brownie points to " + toUserMessage;
        output += " :thumbsup: :sparkles: :sparkles: ";
        return output;
    }
};

module.exports = commands;
