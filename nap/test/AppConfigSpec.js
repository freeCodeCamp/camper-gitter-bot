var expect = require("chai").expect,
    assert = require("chai").assert;

var routes = require("../lib/app/routes.js");
var AppConfig = require("../config/AppConfig"),
    Utils = require('../lib/utils/Utils');

// this is start of test suite, so just clear the screen
// Utils.cls();

describe("AppConfig", function(){

    it("should have default AppConfig", function() {
        expect(AppConfig.testUser).to.equal("bothelp");
    })

    it("should make a topicDmUri", function() {
        var topicDmUri = AppConfig.topicDmUri();
        var expUri = AppConfig.appHost + "/go?dm=y&room=bothelp"

        expect(topicDmUri).to.equal(expUri);
    })

});