/* jshint -W097 */
/*jslint node: true */
/*global require, module, process, console  __dirname */


"use strict";

// DONT require this as it creates a circular dependency
// var Utils = require("../lib/utils/Utils");


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
        apiServer: "beta.freecodecamp.com",
        appRedirectUrl: "http://bot.freecodecamp.com/login/callback",
        botname: "camperbot"
    }
};

var _ = require("lodash-node");



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

    init: function() {
        var serverEnv = process.env.SERVER_ENV;
        AppConfig.serverEnv = serverEnv;
        this.warn("AppConfig.init serverEnv:", serverEnv);

        var thisConfig = envConfigs[serverEnv];
        if (!thisConfig) {
            var msg = ("FATAL ERROR! cant find env: " + serverEnv);
            console.error(msg);
            throw new Error(msg);
        }
        _.merge(AppConfig, thisConfig);
    },

    warn: function(msg, obj) {
        console.error("AppConfig", msg, obj);
    },

    // TODO cleanup
    // use as a function so it can be set at startup
    // before other code calls it at runtime
    getBotName: function() {
        if (!AppConfig.botname) {
            AppConfig.init();
            console.log("tried to call botname before it was set");
        }
        // this.warn("getBotName()", AppConfig.botname );
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
        //   this.warn("ignoring req.org");
        // }
        return (AppConfig.org);
    },

    topicDmUri: function(topic) {
        var uri = AppConfig.appHost + "/go?dm=y&room=" + AppConfig.getBotName();
        if (topic) {
            uri += "&topic=" + topic;
        }
        return uri;
    },

    dmLink: function() {
        return "https://gitter.im/" + AppConfig.getBotName();
    }
};

AppConfig.init();

// AppConfig.apiServer = envConfigs.apiServer[serverEnv];


// calculated items


// console.log("AppConfig", AppConfig);

module.exports = AppConfig;

