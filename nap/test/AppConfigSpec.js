var expect = require("chai").expect,
    assert = require("chai").assert;

var routes = require("../lib/app/routes.js");
var AppConfig = require("../config/AppConfig");


describe("Routes", function(){

    it("should have default AppConfig", function() {
        expect(AppConfig.org).to.equal("dcsan");
    })

});