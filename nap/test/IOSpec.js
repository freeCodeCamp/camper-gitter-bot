"use strict";

var assert = require("chai").assert,
    expect = require("chai").expect;

var GBot = require("../lib/bot/GBot.js"),
    Utils = require("../lib/utils/Utils"),
    KBase = require("../lib/bot/KBase.js");

function clog(msg, obj) {
    Utils.warn("KbaseSpec>", msg, obj);
}


// "no-unused-expressions": [0]


describe("IO", function () {

    it("should load the KBase", function() {
        var p = KBase.initAsync();
        p.then(function() {
            expect(KBase.topics).not.to.be.null;
        });
    });

    it("command: test", function () {
        var res, msg;
        msg = Utils.makeMessageFromString("test");
        res = GBot.findAnyReply(msg);
        expect(res).to.include("All bot systems are go!");
    });

    it("command: help", function () {
        var res, msg;
        msg = Utils.makeMessageFromString("help");
        res = GBot.findAnyReply(msg);
        expect(res).to.include("Hi this is CamperBot");
    });

    // // failing for now - need to stip down to the command
    it("command: test with extra words should be ignored", function () {
        var res, msg;
        msg = Utils.makeMessageFromString("test with some other stuff");
        res = GBot.findAnyReply(msg);
        expect(res).to.be.null;
    });

});

