var assert = require("chai").assert;

var GBot = require("../lib/bot/GBot.js"),
    Utils = require('../lib/utils/Utils'),
    KBase = require("../lib/bot/KBase.js");

function clog(msg, obj) {
    Utils.clog("KbaseSpec>", msg, obj)
}



describe("GBot", function(){

    var res, str, msg;

    it("would be nice if regexes did not give me a headache", function() {
        var res = "help bootstrap".match(/(help|wiki|check) (.*)/)
        assert.equal(res[2], "bootstrap")
    })

    it("should have a name", function() {
        assert.equal(GBot.getName(), "bothelp");
    })

    it("should format help input", function() {
        var msg = Utils.makeMessageFromString("help bootstrap")
        var output = GBot.parseInput(msg);
        assert.propertyVal(output, 'topic', 'bootstrap');
        assert.propertyVal(output, 'help', true);
    })

    it("should format non-help as false", function() {
        var msg = Utils.makeMessageFromString("DONT bootstrap")
        var output = GBot.parseInput(msg);
        assert.propertyVal(output, 'help', false);
    })

    it("should respond to help", function() {
        var msg = Utils.makeMessageFromString("help foo")
        var help = GBot.findAnyReply(msg);
        assert.equal(help, "help for **foo**");
    })

    it("should have an ebn test response", function() {
        var msg = Utils.makeMessageFromString("help ebn")
        var help = GBot.findAnyReply(msg);
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

    it("should have a menu command", function() {
        var msg = Utils.makeMessageFromString("menu");
        var help = GBot.findAnyReply(msg);
        assert.match(help, /Help with/ );
    })

    it("should have a topics command", function() {
        msg = Utils.makeMessageFromString("topics");
        res = GBot.findAnyReply(msg);
        assert.match(res, /^## topics/i);
    })

    it("should have a rejoin command", function() {
        GBot.init();
        var msg = Utils.makeMessageFromString("rejoin");
        var res = GBot.findAnyReply(msg);
        assert.equal(res, "rejoined");
    })

    it("should parse a thanks command", function() {
        str = "thanks @bob"
        msg = Utils.makeMessageFromString(str);
        input = GBot.parseInput(msg);
        assert.isTrue(input.thanks, str);
        // console.log("tx res", input)
        // console.log("thanks parse", res);
    })

    it("should parse a thanks command with a hashtag", function() {
        GBot.init();
        var msg = Utils.makeMessageFromString("thanks @bob #tag");
        var res = GBot.parseInput(msg);
        assert.isTrue(res.thanks);
        // console.log(res);
    })


    it("should find a thanks command", function() {
        GBot.init();
        var msg = Utils.messageMock("thanks @bob");
        var res = GBot.parseInput(msg);
        assert.isTrue(res.thanks);
    })


    it("should send a thanks karm reply", function() {
        GBot.init();
        var msg = Utils.messageMock("thanks @bob");
        var res = GBot.findAnyReply(msg);
        // console.log("thanks msg> ", res);
        assert.match(res, /^@testuser sends karma to/ );
    })


});