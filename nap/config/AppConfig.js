"use strict";

var AppConfig = {
    roomId: '55b1a9030fc9f982beaac901', // botzy
    clientId: process.env.GITTER_KEY,
    token: process.env.GITTER_TOKEN,
    org: "dcsan"        // TODO read from config file for dev/live modes
}

AppConfig.topics = require("../data/topics");

module.exports = AppConfig;