var expect = require("chai").expect,
    assert = require("chai").assert;

var routes = require("../lib/app/routes.js");
var AppConfig = require("../config/AppConfig"),
    Utils = require('../lib/utils/Utils');

// this is start of test suite, so just clear the screen
Utils.cls();

describe("AppConfig", function(){

    it("should have default AppConfig", function() {
        expect(AppConfig.testUser).to.equal("bothelp");
    })

});