"use strict";
require('dotenv').load();

// var assert = require("chai").assert;
var expect = require("chai").expect;

var GBot = require("../lib/bot/GBot.js"),
    Utils = require('../lib/utils/Utils'),
    TestHelper = require('./TestHelper');

var KBase = require("../lib/bot/Kbase");

    // KBase = require("../lib/bot/KBase.js");

// function clog(msg, obj) {
//     Utils.clog("SearchSpec>", msg, obj)
// }


describe("Search", function (){

    it("should have a find method", function() {
        KBase.initSync();
        var msg = TestHelper.makeMessageFromString("find XXX");
        var res = GBot.findAnyReply(msg);
        expect(res).to.match(/^find \*\*/);
    });

    // it("should have a find method that takes parameters", function() {
    //     var msg = TestHelper.makeInputFromString("find css");
    //     var res = GBot.findAnyReply(msg);
    //     expect(res).to.match(/^find \*\*css\*\*/);
    // });

    //it("should accept a find method ", function() {
    //
    //});

});

