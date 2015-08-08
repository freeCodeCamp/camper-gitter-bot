"use strict";

require('dotenv').config({path: 'dot.env'});

var assert = require("chai").assert,
    expect = require("chai").expect;

var GBot = require("../lib/bot/GBot.js"),
    Utils = require("../lib/utils/Utils"),
    TestHelper = require("./TestHelper");



describe("Parser", function () {

    it("should find a thanks command", function () {
        GBot.init();
        var msg = TestHelper.makeMessageFromString("thanks @bob");
        var res = GBot.parseInput(msg);
        expect(res.keyword).to.equal("thanks");
        expect(res.command).to.be.true;
    });

    it("should parse a thanks command with a hashtag", function () {
        var str, msg, input;
        str = "thanks @bob #hashtag";
        msg = TestHelper.makeMessageFromString(str);
        input = GBot.parseInput(msg);
        expect(input.keyword).to.equal("thanks");
    });


});
