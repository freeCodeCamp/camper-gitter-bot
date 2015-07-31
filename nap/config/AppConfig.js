/* jshint -W097 */
/*jslint node: true */
/*global require, module, process, console  __dirname */


"use strict";

// DONT require this as it creates a circular dependency
// var Utils = require("../lib/utils/Utils");

var _ = require("lodash-node");

var Utils = require("../lib/utils/Utils");

var AppConfig = {
    clientId: process.env.GITTER_APP_KEY,
    token: process.env.GITTER_USER_TOKEN,
    roomId: "55b1a9030fc9f982beaac901", // default room botzy
    org: "bothelp",
    testUser: "bothelp",
    botlist: ["bothelp", "camperbot"],
    webuser: "dcsan",
    wikiHost: "https://github.com/freecodecamp/freecodecamp/wiki/",
    gitterHost: "https://gitter.im/",
    mdn: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/",
    botVersion: "0.0.3",
    MAX_WIKI_LINES: 10,


    // TODO cleanup
    // use as a function so it can be set at startup
    // before other code calls it at runtime
    getBotName: function() {
        if (!AppConfig.botname) {
            Utils.error("tried to call botname before it was set");
            return "ERROR_BOTNAME"; // or crash?
        }
        // Utils.warn("getBotName()", AppConfig.botname );
        return AppConfig.botname;
    },

    who: function(req) {
        var who;

        if (req.user) {
            console.warn("got a user in the request but ignoring");
        } else if (req.who) {
            who = req.who;
        } else {
            who = AppConfig.webuser;
        }
        return who;
    },

    // TODO read from config file for dev/live modes and running env
    getOrg: function(req) {
        // if (req && req.org) {
        //   Utils.warn("ignoring req.org");
        // }
        return (AppConfig.org);
    },

    topicDmUri: function(topic) {
        var uri = AppConfig.appHost + "/go?dm=y&room=" + AppConfig.botname;
        if (topic) {
            uri += "&topic=" + topic;
        }
        return uri;
    }

};


var envConfigs = {
    test: {
        appHost: "http://localhost:7000",
        apiServer: "beta.freecodecamp.com",
        appRedirectUrl: "http://localhost:7891/login/callback",
        botname: "bothelp"
    },

    local: {
        appHost: "http://localhost:7000",
        apiServer: "beta.freecodecamp.com",
        appRedirectUrl: "http://localhost:7891/login/callback",
        botname: "bothelp"
    },
    beta: {
        appHost: "http://localhost:7000",
        apiServer: "beta.freecodecamp.com",
        appRedirectUrl: "http://localhost:7891/login/callback",
        botname: "bothelp"
    },
    prod: {
        appHost: "http://bot.freecodecamp.com",
        apiServer: "freecodecamp.com",
        appRedirectUrl: "http://bot.freecodecamp.com/login/callback",
        botname: "camperbot"
    }
};

// AppConfig.apiServer = envConfigs.apiServer[serverEnv];


var serverEnv = process.env.SERVER_ENV;
AppConfig.serverEnv = serverEnv;

var thisConfig = envConfigs[serverEnv];
if (!thisConfig) {
    var msg = ("cant find env:", serverEnv);
    console.error(msg);
}

_.merge(AppConfig, thisConfig);

// calculated items
AppConfig.dmLink = "https://gitter.im/" + AppConfig.botname;

console.log("AppConfig", AppConfig);

module.exports = AppConfig;

