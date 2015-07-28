"use strict";

var assert = require("chai").assert,
    expect = require("chai").expect;

var GBot = require("../lib/bot/GBot.js"),
    Utils = require('../lib/utils/Utils'),
    KBase = require("../lib/bot/KBase.js");

function clog(msg, obj) {
    Utils.clog("KbaseSpec>", msg, obj);
}



describe("GBot", function () {

    it("would be nice if regexes did not give me a headache", function () {
        var res = "help bootstrap".match(/(help|wiki|check) (.*)/);
        assert.equal(res[2], "bootstrap");
    });

    it("should have a name", function () {
        assert.equal(GBot.getName(), "bothelp");
    });

    it("should format help input", function () {
        var msg, output;
        msg = Utils.makeMessageFromString("help bootstrap")
        output = GBot.parseInput(msg);
        assert.propertyVal(output, 'topic', 'bootstrap');
        assert.propertyVal(output, 'help', true);
    });

    it("should format non-help as false", function () {
        var msg, output;
        msg = Utils.makeMessageFromString("DONT bootstrap");
        output = GBot.parseInput(msg);
        assert.propertyVal(output, 'help', false);
    });

    it("should respond to help", function () {
        var msg, res;
        msg = Utils.makeMessageFromString("help foo");
        res = GBot.findAnyReply(msg);
        expect(res).to.equal("help for **foo**");
    });

    it("should have a test response", function () {
        var msg, res;
        msg = Utils.makeMessageFromString("test");
        res = GBot.findAnyReply(msg);
        expect(res).to.equal("All bot systems are go!");
    });

    it("should have wiki bootstrap content", function () {
        var promise = KBase.initAsync();
        promise.then(function () {
            var topic = GBot.checkWiki("bootstrap");
            assert.equal(topic.name, "bootstrap");
            clog(topic);
        });
    });

    it("should have a menu command", function () {
        var msg, res;
        msg = Utils.makeMessageFromString("menu");
        res = GBot.findAnyReply(msg);
        expect(res).to.match(/^menu/);
        // assert.match(help, /Help with/ );
    });

    it("should have a topics command", function () {
        var msg, res;        
        msg = Utils.makeMessageFromString("topics");
        res = GBot.findAnyReply(msg);
        assert.match(res, /^## topics/i);
    });

    it("should have a rejoin command", function () {
        var msg, res;
        GBot.init();
        msg = Utils.makeMessageFromString("rejoin");
        res = GBot.findAnyReply(msg);
        assert.equal(res, "rejoined");
    });

    it("should parse a thanks command", function () {
        var str, msg, input;
        str = "thanks @bob";
        msg = Utils.makeMessageFromString(str);
        input = GBot.parseInput(msg);
        assert.isTrue(input.thanks, str);
        // console.log("tx res", input)
        // console.log("thanks parse", res);
    });

    it("should parse a thanks command with a hashtag", function () {
        GBot.init();
        var msg = Utils.makeMessageFromString("thanks @bob #tag");
        var res = GBot.parseInput(msg);
        assert.isTrue(res.thanks);
        // console.log(res);
    });


    it("should find a thanks command", function () {
        GBot.init();
        var msg = Utils.messageMock("thanks @bob");
        var res = GBot.parseInput(msg);
        assert.isTrue(res.thanks);
    });


    it("should send a thanks karm reply", function () {
        GBot.init();
        var msg = Utils.messageMock("thanks @bob");
        var res = GBot.findAnyReply(msg);
        // console.log("thanks msg> ", res);
        assert.match(res, /^@testuser sends karma to/ );
    });


});