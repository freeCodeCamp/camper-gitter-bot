/*jslint todo: true */
"use strict";

var assert = require("chai").assert;

var GBot = require("../../../lib/bot/GBot.js"),
    KBase = require("../../bot/KBase"),
    Utils = require("../../../lib/utils/Utils"),
    AppConfig = require("../../../config/AppConfig"),
    HttpWrap = require("../../../lib/utils/Utils");


var newline = '\n';


function clog(msg, obj) {
    Utils.clog("BotCommands>", msg, obj);
}

function tlog(msg, obj) {
    Utils.warn("BotCommands>", msg, obj);
}

var thanks = function (input, bot) {
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
};

module.exports = thanks;

