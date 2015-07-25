"use strict";

var AppConfig = {
    roomId: '55b1a9030fc9f982beaac901', // botzy
    clientId: process.env.GITTER_APP_KEY,
    token: process.env.GITTER_USER_TOKEN,
    org: "bothelp",
    testUser: 'bothelp',
    botname: 'bothelp'
}

// TODO - fill in username if we get it from oAuth request
AppConfig.who = function(req) {
    if (req.user) {
        console.warn("got a user in the request but ignoring");
    }
    return (AppConfig.testUser);
}

// TODO read from config file for dev/live modes and running env
AppConfig.getOrg = function(req) {
    return (AppConfig.org);
}


AppConfig.topics = require("../data/topics");

module.exports = AppConfig;