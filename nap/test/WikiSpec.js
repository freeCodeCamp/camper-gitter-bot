"use strict";
require('dotenv').load();

//var clc = require("cli-color");
//process.stdout.write(clc.erase.screen);

var expect = require("chai").expect;

var GBot = require("../lib/bot/GBot.js"),
    Utils = require("../lib/utils/Utils"),
    KBase = require("../lib/bot/KBase.js"),
    TestHelper = require('./TestHelper');

Utils.clog()

// "no-unused-expressions": [0]


describe("Wiki", function () {

    it("should load the KBase", function() {
        var allData = KBase.initSync();
        expect(allData).to.be.instanceOf(Array);
    });

    it("should find css page", function () {
        var entry = KBase.getTopicData("css-selectors");
        expect(entry.dashedName).to.equal("css-selectors");
    });

    it("should find bootstrap page", function () {
        var entry = KBase.getTopicData("bootstrap");
        expect(entry.dashedName).to.equal("bootstrap");
    });

    it("should get wiki data back", function () {
        var entry = KBase.getTopicData("camperbot");
        expect(entry.shortData).to.include("Hi this is **[CamperBot]");
    });



});

