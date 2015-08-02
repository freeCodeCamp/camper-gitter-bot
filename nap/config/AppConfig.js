"use strict";

/* jshint -W097 */
/*jslint node: true */
/*global require, module, process, console  __dirname */

var _ = require("lodash-node");


var envConfigs = {

    // replace this with your own ID
    YOUR_GITHUB_ID: {
        appHost: "http://localhost:7000",
        apiServer: "beta.freecodecamp.com",
        appRedirectUrl: "http://localhost:7891/login/callback",
        botname: "YOUR_GITHUB_ID"
    },

    demobot: {
        appHost: "http://localhost:7000",
        apiServer: "beta.freecodecamp.com",
        appRedirectUrl: "http://localhost:7891/login/callback",
        botname: "YOUR_GITHUB_ID"
    },

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


var AppConfig = {
    clientId: process.env.GITTER_APP_KEY,
    token: process.env.GITTER_USER_TOKEN,
    botname: null,
    roomId: "55b1a9030fc9f982beaac901", // default room botzy
    org: "bothelp",
    testUser: "bothelp",
    // so bot doesnt get in a loop replying itself
    botlist: ["bothelp", "camperbot", "YOUR_GITHUB_ID", "demobot"],
    webuser: "webuser",
    wikiHost: "https://github.com/freecodecamp/freecodecamp/wiki/",
    gitterHost: "https://gitter.im/",
    mdn: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/",
    botVersion: "0.0.3",
    MAX_WIKI_LINES: 40,

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
        this.showConfig();
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

AppConfig.init();

// AppConfig.apiServer = envConfigs.apiServer[serverEnv];


// calculated items


console.log("AppConfig", AppConfig);

module.exports = AppConfig;

