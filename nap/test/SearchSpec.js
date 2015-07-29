"use strict";

// var assert = require("chai").assert;
var expect = require("chai").expect;

var GBot = require("../lib/bot/GBot.js"),
    Utils = require('../lib/utils/Utils');
    // KBase = require("../lib/bot/KBase.js");

// function clog(msg, obj) {
//     Utils.clog("SearchSpec>", msg, obj)
// }


describe("Search", function (){

    it("should have a find method", function() {
        var msg = Utils.makeMessageFromString("find");
        var res = GBot.findAnyReply(msg);
        expect(res).to.match(/^find \*\*/);
    });

    it("should have a find method that takes parameters", function() {
        var msg = Utils.makeMessageFromString("find css");
        var res = GBot.findAnyReply(msg);
        expect(res).to.match(/^find \*\*css\*\*/);
    });

    it("should accept a find method ", function() {

    });

});

