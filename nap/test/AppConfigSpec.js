var expect = require("chai").expect,
    assert = require("chai").assert;

var routes = require("../lib/app/routes.js");
var AppConfig = require("../config/AppConfig");


describe("Routes", function(){

    it("should have default AppConfig", function() {
        expect(AppConfig.org).to.equal("dcsan");
    })

    it("AppConfig should have topics", function() {
        expect(AppConfig.topics.data.defaultTopic.room).to.equal("default room");
    })

    it("AppConfig should have default room", function() {
        var topic = AppConfig.topics.findTopic("default");
        assert.equal(topic.room, "default room");
    })


});