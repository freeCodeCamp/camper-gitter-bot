"use strict";

require('dotenv').load();


var assert = require("chai").assert,
    expect = require("chai").expect;

//this should go before other stuff
var KBase = require("../lib/bot/KBase.js");

var Bonfires = require("../lib/app/Bonfires.js"),
    InputWrap = require('../lib/bot/InputWrap'),
    Utils = require("../lib/utils/Utils"),
    TestHelper = require("./TestHelper"),
    GBot  = require("../lib/bot/GBot.js");

var TestHelper = require('./TestHelper');


function clog(msg, obj) {
    // Utils.warn("BonfiresSpec>", msg, obj);
    obj = obj || "";
    console.log("------------");
    console.log(msg, obj);
    // console.log("callee", arguments.callee);
}

var TESTROOMNAME = 'bonfire-factorialize-a-number',
    TEST_BF_NAME = "bonfire factorialize a number",
    TEST_BF_TITLE = "Bonfire Factorialize a Number";

function getOneBf(roomName) {
    roomName = roomName || TESTROOMNAME;
    var input = TestHelper.stubInput;
    var bf = Bonfires.fromInput(input);
    return bf;
}

// sets a bonfire as active inside the current chat
function activateBonfire() {
    var message = TestHelper.makeMessageFromString("bonfire " + TEST_BF_NAME);
    var res = GBot.findAnyReply(message);
    return res;
}


describe("Bonfires", function() {

    it("should load the Bonfires", function() {
        var d = Bonfires.load();
        expect(d.challenges[0]).not.to.be.null;
    });

    it("should prep the KBase", function() {
        KBase.initSync();
    }),

    it("should find a bonfire by roomname", function() {
        var bfName = 'bonfire-factorialize-a-number';
        var bf = Bonfires.findBonfire(bfName);
        expect(bf.dashedName).to.equal(bfName);
    }),

    it("stubInput should have a message.room.name", function() {
        expect(TestHelper.stubInput.message.room.name).to.equal("bothelp/bonfire-factorialize-a-number");
        var sname = InputWrap.roomShortName(TestHelper.stubInput);
        expect(sname).to.equal('bonfire-factorialize-a-number');
    });

    it("should initialize the allDashedNames", function() {
        var d = Bonfires.allDashedNames();
        expect(d[0]).to.equal("waypoint-pair-program-on-bonfires");
    });

    it("should initialize the allNames", function() {
        var d = Bonfires.allNames();
        expect(d[0]).to.equal("Waypoint: Pair Program on Bonfires");
    });

    it("should find bonfire from lowercase name", function() {
        var d = Bonfires.findBonfire('bonfire factorialize a number');
        expect(d.description[0]).to.equal("Return the factorial of the provided integer.");
    });

    it("should find links for a bf", function() {
        var bf = Bonfires.findBonfire(TEST_BF_NAME);
        var links = Bonfires.getLinks(bf);
        expect(links).not.to.be.null;
        expect(links).to.include("links:")
    });

    it("should respond to bonfire info", function() {
        var res = activateBonfire();
        var message = TestHelper.makeMessageFromString("bonfire info");
        var res = GBot.findAnyReply(message);
        expect(res).to.include("## :fire:[Bonfire");
    });

    it("should find bf from Input and have links", function() {
        var res = activateBonfire();
        var message = TestHelper.makeMessageFromString("bonfire links");
        var res = GBot.findAnyReply(message);
        expect(res).to.include("links:");
    });


    it("should respond to bonfire script", function() {
        var res = activateBonfire();
        //expect(res).to.include("Let's talk about");

        var message = TestHelper.makeMessageFromString("bonfire script");
        var res = GBot.findAnyReply(message);
        expect(res).to.include("```js \nfunction");
    });

    it("should find raw wiki hints for bonfire from KBase", function() {
        var bfName = "Bonfire Factorialize a Number";
        var hints = KBase.getWikiHints(bfName);
        expect(hints).to.be.instanceOf(Array);
    });

    it("loaded should have wikiHints linked to bonfire object", function() {
        var bf = Bonfires.findBonfire(TEST_BF_TITLE);
        //Utils.tlog('bf returned to spec', bf);
        expect(bf.wikiHints).to.be.instanceOf(Array);
    });



});


