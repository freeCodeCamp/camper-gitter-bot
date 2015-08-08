/*globals require, it, describe */

/* jshint -W097 */

"use strict";

require('dotenv').config({path: 'dot.env'});
var expect = require("chai").expect;

console.log("--------------- testrun AppConfig ---------------");

var AppConfig = require("../config/AppConfig");

    // Utils = require("../lib/utils/Utils");

// this is start of test suite, so just clear the screen
// Utils.cls();

describe("AppConfig", function () {

    it("should have default AppConfig", function () {
        expect(AppConfig.testUser).to.equal("bothelp");
    });

    it("should make a topicDmUri", function () {
        var topicDmUri, expUri;
        topicDmUri = AppConfig.topicDmUri();
        expUri = AppConfig.appHost + "/go?dm=y&room=bothelp";

        expect(topicDmUri).to.equal(expUri);
    });

    it("should setup the botname", function() {
        var bn = AppConfig.getBotName();
        expect(bn).to.equal("bothelp", "the botname was:" + bn);
    });

});
