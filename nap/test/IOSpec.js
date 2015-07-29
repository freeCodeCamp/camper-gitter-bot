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
        expect(res).to.equal("All bot systems are go!");
    });

    it("command: help", function () {
        var res, msg;
        msg = Utils.makeMessageFromString("help");
        res = GBot.findAnyReply(msg);
        expect(res).to.include("try typing");
    });

    // // failing for now - need to stip down to the command
    it("command: test with extra words should be ignored", function () {
        var res, msg;
        msg = Utils.makeMessageFromString("test stuff");
        res = GBot.findAnyReply(msg);
        expect(res).to.equal("All bot systems are go!");
    });

    it("command: wiki test", function () {
        var res, msg;
        msg = Utils.makeMessageFromString("wiki css");
        res = GBot.findAnyReply(msg);
        expect(res).to.include("**css** wikiEntry\n# Cascading");
    });

    it("wiki command with param: chai assert", function () {
        var res, msg;
        msg = Utils.makeMessageFromString("wiki chai assert");
        res = GBot.findAnyReply(msg);
        expect(res).to.include("**chai assert** wikiEntry\n# ");
    });

});

