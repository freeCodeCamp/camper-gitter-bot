"use strict";

/* jshint -W097 */
/*jslint node: true */
/*global require, module, process, console  __dirname */

var _ = require("lodash");

var AppConfig = {
    clientId: process.env.GITTER_APP_KEY,
    token: process.env.GITTER_USER_TOKEN,
    apiKey: process.env.FCC_API_KEY,
    supportDmRooms: false,   // open more rooms on startup
    botname: null,
    roomId: "55b1a9030fc9f982beaac901", // default room botzy
    org: "bothelp",
    testUser: "bothelp",
    // so bot doesnt get in a loop replying itself
    botlist: ["bothelp", "camperbot", "YOUR_GITHUB_ID", "demobot"],
    webuser: "webuser",
    wikiHost: "https://github.com/freecodecamp/freecodecamp/wiki/",
    gitterHost: "https://gitter.im/",
    botVersion: "0.0.11",
    MAX_WIKI_LINES: 20,
    botNoiseLevel: 1,

    init: function() {
        var serverEnv = process.env.SERVER_ENV;
        AppConfig.serverEnv = serverEnv;
        this.warn("AppConfig.init serverEnv:", serverEnv);

        var thisConfig = envConfigs[serverEnv];
        if (!thisConfig) {
            var msg = ("FATAL ERROR! cant find serverEnv: " + serverEnv);
            console.error(msg);
            throw new Error(msg);
        }
        _.merge(AppConfig, thisConfig);
        //this.showConfig();
    },

    showConfig: function() {
        // console.log("AppConfig");
        console.log("AppConfig");
        Object.keys(AppConfig)
        .sort()
        .forEach(function(v, i) {
            if (typeof AppConfig[v] !== 'function') {
                console.log("\t", v, ":\t\t", AppConfig[v]);
            }
        });
    },

    warn: function(msg, obj) {
        console.warn("WARN> AppConfig", msg, obj);
    },

    // TODO cleanup
    // use as a function so it can be set at startup
    // before other code calls it at runtime
    getBotName: function() {
        if (!AppConfig.botname) {
            AppConfig.init();
            this.warn("getBotName()", AppConfig.botname );
            console.log("tried to call botname before it was set");
        }
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


var envConfigs = {

    // replace this with your own ID
    YOUR_GITHUB_ID: {
        botname: "YOUR_GITHUB_ID",
        appHost: "http://localhost:7000",
        apiServer: "freecodecamp.com",
        appRedirectUrl: "http://localhost:7891/login/callback",
    },

    demobot: {
        botname: "demobot",
        appHost: "http://localhost:7000",
        apiServer: "www.freecodecamp.com",
        appRedirectUrl: "http://localhost:7891/login/callback",
    },

    test: {
        botname: "bothelp",
        appHost: "http://localhost:7000",
        apiServer: "www.freecodecamp.com",
        appRedirectUrl: "http://localhost:7891/login/callback",
    },

    local: {
        botname: "bothelp",
        appHost: "http://localhost:7000",
        apiServer: "www.freecodecamp.com",
        appRedirectUrl: "http://localhost:7891/login/callback",
    },
    beta: {
        botname: "bothelp",
        appHost: "http://localhost:7000",
        apiServer: "beta.freecodecamp.com",
        appRedirectUrl: "http://localhost:7891/login/callback",
    },
    prod: {
        botname: "camperbot",
        appHost: "http://bot.freecodecamp.com",
        apiServer: "www.freecodecamp.com",
        appRedirectUrl: "http://bot.freecodecamp.com/login/callback",
    }
};

AppConfig.init();

// AppConfig.apiServer = envConfigs.apiServer[serverEnv];


// calculated items

// console.log("AppConfig", AppConfig);

module.exports = AppConfig;
