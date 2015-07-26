"use strict";

var Utils = require('../lib/utils/Utils');

function clog(msg, obj) {
    Utils.clog("AppConfig", msg, obj)
}

var AppConfig = {
    roomId: '55b1a9030fc9f982beaac901', // botzy
    clientId: process.env.GITTER_APP_KEY,
    token: process.env.GITTER_USER_TOKEN,
    org: "bothelp",
    testUser: 'bothelp',
    botname: 'bothelp',
    webuser: 'dcsan',
    dmLink: "https://gitter.im/bothelp",
    appHost: "http://localhost:7000",

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
        return (AppConfig.org);
    },

    topicDmUri: function(topic) {
        var uri = this.appHost + "/go?room=" + this.botname;
        if (topic) {
            uri += "&topic=" + topic;
        }
        clog("topicDmUri", uri);
        return uri;
    }

}

module.exports = AppConfig;