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

clog("clog from thanks");

// function clog(msg, obj) {
//     Utils.clog("BotCommands>", msg, obj);
// }

// function tlog(msg, obj) {
//     Utils.warn("BotCommands>", msg, obj);
// }



var showInfo = function(input, bot, blob) {
    Utils.clog('thanks', "showInfo", blob);

    if (blob.error) {
        var msg = ":frowning: " + blob.error.message;
        bot.say(msg, input.room);
        Utils.error("thanks", blob.error.message, input);
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
    bot.say(str, input.room);
};


var commands = {
    thanks: function (input, bot) {
        assert.isObject(input, "checkThanks expects an object");
        var mentions, output, fromUser, toUser;

        clog("thanks input.message>", input.message);

        mentions = input.message.model.mentions;
        if (mentions) {
            // TODO - build a list
            toUser = mentions[0].screenName.toLowerCase();
        }
        fromUser = input.message.model.fromUser.username.toLowerCase();
        output = `@${fromUser} sends karma to @${toUser}`;
        output += "\n :thumbsup: :thumbsup: :thumbsup: :thumbsup: :thumbsup: :sparkles: :sparkles: ";

        var apiPath = `/api/users/give-brownie-points?receiver=${toUser}&giver=${fromUser}`;
        HttpWrap.getApi(apiPath, function(apiRes) {
            showInfo(input, bot, apiRes);
        });

        return output;
    }
};

module.exports = commands;

