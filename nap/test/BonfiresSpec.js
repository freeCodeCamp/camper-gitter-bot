"use strict";


var assert = require("chai").assert,
    expect = require("chai").expect;

var Bonfires = require("../lib/app/Bonfires.js"),
    InputWrap = require('../lib/bot/InputWrap'),
    Utils = require("../lib/utils/Utils"),
    KBase = require("../lib/bot/KBase.js");

var TestHelper = require('./TestHelper');


function clog(msg, obj) {
    // Utils.warn("BonfiresSpec>", msg, obj);
    obj = obj || "";
    console.log("------------");
    console.log(msg, obj);
    // console.log("callee", arguments.callee);
}

var TESTROOMNAME = 'bonfire-factorialize-a-number';

function getOneBf(roomName) {
    roomName = roomName || TESTROOMNAME;
    var input = TestHelper.stubInput;
    var bf = Bonfires.fromInput(input);
    return bf;
}


describe("Bonfires", function() {

    it("should load the Bonfires", function() {
        var d = Bonfires.load();
        expect(d.challenges[0]).not.to.be.null;
    });

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

    it("should find description from dashedName", function() {
        var d = Bonfires.findBonfire('bonfire-factorialize-a-number');
        expect(d.description[0]).to.equal("Return the factorial of the provided integer.");
    });

    it("should find bf from room dashed-name", function() {
        var bf = getOneBf();
        expect(bf.dashedName).to.equal(TESTROOMNAME);
    });

    it("should find a bf from input", function() {
        var bf = Bonfires.fromInput(TestHelper.stubInput);
        expect(bf.dashedName).to.equal(TESTROOMNAME);
    });

    it("should find links for a bf", function() {
        var links = Bonfires.getLinksFromInput(TestHelper.stubInput);
        expect(links).not.to.be.null;
        expect(links).to.include("links for ")
    });

    // it("would be nice if regexes did not give me a headache", function () {
    //     var res = "help bootstrap".match(/(help|wiki|check) (.*)/);
    //     assert.equal(res[2], "bootstrap");
    // });

});


