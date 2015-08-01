"use strict";


var GBot = require("../../../lib/bot/GBot.js"),
    KBase = require("../../bot/KBase"),
    Utils = require("../../../lib/utils/Utils"),
    AppConfig = require("../../../config/AppConfig"),
    HttpWrap = require("../../../lib/utils/HttpWrap");

var clog = require('../../utils/clog.js');

// response format:
// {
//     "about": {
//         "username": "berkeleytrue",
//         "bio": "Cyber Wizard @ http://r3dm.com, Camp Counselor @ freecodecamp.com",
//         "github": "http://github.com/BerkeleyTrue"
//     }
//     debug: "XXX"
// }


// TODO - merge this with the 'thanks' function, as that also shows user info.

var showInfo = function(input, bot, blob) {
    Utils.clog('about', "showInfo", blob);

    if (blob.error) {
        var msg = "user not found";
        msg += Utils.betaFooter();
        bot.say(msg, input.message.room);
        Utils.error("about", "user not found", input);
        return;
    }

    var username = blob.about.username;
    var about = blob.about;

    // var bioData = `
    // bio: ${about.bio}
    // [github](${about.github})
    // BPs: ${about.browniePoints} `;

    var bio = about.bio || "no bio set";

    var str = `
![${username}](https://avatars2.githubusercontent.com/${username}?&s=64) | [${username}](http://www.freecodecamp.com/${username})
-------------                       | -------------
:star: ${about.browniePoints}       | ${bio}

`;
    str += Utils.betaFooter();
    bot.say(str, input.message.room);
};


var about = function(input, bot) {
    // var mentioned = InputWrap.mentioned(input);
    var mentions, them, name;

    clog("input---------");
    // console.log(JSON.stringify(input));
    debugger;
    
    mentions = input.message.model.mentions;
    them = mentions[0];
    if (!them) {
        return "you need to ask about @someone!";
    }
    clog('them', them);
    // name = "berkeleytrue";
    name = them.screenName.toLowerCase();

    var apiPath = '/api/users/about?username=' + name;
    HttpWrap.getApi(apiPath, function(apiRes) {
        showInfo(input, bot, apiRes);
    });

};

module.exports = about;

