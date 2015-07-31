"use strict";

var assert = require("chai").assert,
    expect = require("chai").expect;

var AppConfig = require("../config/AppConfig"),
    GBot = require("../lib/bot/GBot"),
    Utils = require("../lib/utils/Utils"),
    TestHelper = require("./TestHelper"),
    KBase = require("../lib/bot/KBase");

function clog(msg, obj) {
    Utils.clog("KbaseSpec>", msg, obj);
}


describe("GBot", function () {

    it("should load the KBase", function() {
        var p = KBase.initAsync();
        p.then(function() {
            expect(KBase.topics).not.to.be.null;
        });
    });

    it("would be nice if regexes did not give me a headache", function () {
        var res = "help bootstrap".match(/(help|wiki|check) (.*)/);
        assert.equal(res[2], "bootstrap");
    });

    it("should have a name", function () {
        assert.equal(GBot.getName(), "bothelp");
    });

    it("should not reply to itself", function () {
        var botname = AppConfig.getBotName();
        var flag = GBot.isBot(botname);
        if (!flag) {
            Utils.error('GBotSpec', "botname: [" + botname + " ]");
        }
        expect(flag).to.be.true;
    });

    it("should parseInput wiki xxxx", function () {
        var input, output;
        input = TestHelper.makeInputFromString("wiki bootstrap");
        output = GBot.parseInput(input.message);
        assert.propertyVal(output, "keyword", "wiki");
        assert.propertyVal(output, "params", "bootstrap");
    });

    it("should format non-help as false", function () {
        var output,
            message = TestHelper.makeMessageFromString("DONT bootstrap");
        output = GBot.parseInput(message);
        // assert.propertyVal(output, "command", false);
        expect(output).not.to.be.true;
    });

    it("should respond to wiki css", function () {
        var msg, res;
        GBot.init();
        msg = TestHelper.makeMessageFromString("wiki css");
        res = GBot.findAnyReply(msg);
        expect(res).to.contain('## :pencil: [css]');
    });

    it("should have a botstatus response", function () {
        var msg, res;
        msg = TestHelper.makeMessageFromString("botstatus");
        res = GBot.findAnyReply(msg);
        expect(res).to.include("All bot systems are go!", "test message was: " + res);
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
        msg = TestHelper.makeMessageFromString("menu");
        res = GBot.findAnyReply(msg);
        expect(res).to.contain("type help for a list");
        // assert.match(help, /Help with/ );
    });

    it("should have a topics command", function () {
        var msg, res;
        msg = TestHelper.makeMessageFromString("topics");
        res = GBot.findAnyReply(msg);
        assert.match(res, /^## topics/i);
    });

    it("should have a rejoin command", function () {
        var msg, res;
        GBot.init();
        msg = TestHelper.makeMessageFromString("rejoin");
        res = GBot.findAnyReply(msg);
        assert.equal(res, "rejoined");
    });


    it("should send a thanks karma reply", function () {
        var msg, res;
        msg = TestHelper.makeMessageFromString("thanks @bob");
        res = GBot.findAnyReply(msg);
        // console.log("thanks msg> ", res);
        assert.match(res, /^@testuser sends karma to/ );
    });


});

