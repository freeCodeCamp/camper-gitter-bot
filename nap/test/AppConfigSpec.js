var expect = require("chai").expect,
    assert = require("chai").assert;

var routes = require("../lib/app/routes.js");
var AppConfig = require("../config/AppConfig");


describe("AppConfig", function(){

    it("should have default AppConfig", function() {
        expect(AppConfig.testUser).to.equal("bothelp");
    })

});