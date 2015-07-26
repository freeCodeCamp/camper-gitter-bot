var assert = require("chai").assert;

var GBot = require("../lib/bot/GBot.js"),
    Utils = require('../lib/utils/Utils'),
    KBase = require("../lib/bot/KBase.js");

function clog(msg, obj) {
    Utils.clog("KbaseSpec>", msg, obj)
}


describe("GBot", function(){

    it("would be nice if regexes did not give me a headache", function() {
        var res = "help bootstrap".match(/(help|wiki|check) (.*)/)
        assert.equal(res[2], "bootstrap")
    })

    it("should have a name", function() {
        assert.equal(GBot.getName(), "bothelp");
    })

    it("should format help input", function() {
        var output = GBot.parseInput("help bootstrap");
        assert.propertyVal(output, 'topic', 'bootstrap');
        assert.propertyVal(output, 'help', true);
    })

    it("should format non-help as false", function() {
        var output = GBot.parseInput("DONTxx bootstrap");
        assert.propertyVal(output, 'help', false);
    })

    it("should respond to help", function() {
        var help = GBot.findAnyReply("help foo");
        assert.equal(help, "searching for **foo**");
    })

    it("should have an ebn test response", function() {
        var help = GBot.findAnyReply("help ebn");
        assert.equal(help, "this is the ebn test response");
    })

    it("should have wiki bootstrap content", function() {
        var promise = KBase.initAsync();
        promise.then(function(res) {
            var topic = GBot.checkWiki("bootstrap");
            assert.equal(topic.name, "bootstrap");
            clog(topic);
        })
    })



});