"use strict";

var assert = require("chai").assert,
    expect = require("chai").expect;

var GBot = require("../lib/bot/GBot.js"),
    Utils = require("../lib/utils/Utils");



describe("GBot", function () {


    it("should find a thanks command", function () {
        GBot.init();
        var msg = Utils.messageMock("thanks @bob");
        var res = GBot.parseInput(msg);
        expect(res.type).to.equal("thanks");
    });

    it("should parse a thanks command", function () {
        var str, msg, input;
        str = "thanks @bob";
        msg = Utils.makeMessageFromString(str);
        input = GBot.parseInput(msg);
        expect(input.type).to.equal("thanks");
    });

    it("should parse a thanks command with a hashtag", function () {
        GBot.init();
        var msg = Utils.makeMessageFromString("thanks @bob #tag");
        var res = GBot.parseInput(msg);
        expect(res.type).to.equal("thanks");
    });


});
