"use strict";

var expect = require("chai").expect;

var GBot = require("../lib/bot/GBot.js"),
    Utils = require("../lib/utils/Utils"),
    KBase = require("../lib/bot/KBase.js"),
    TestHelper = require('./TestHelper');

function clog(msg, obj) {
    Utils.warn("KbaseSpec>", msg, obj);
}


// "no-unused-expressions": [0]


describe("Wiki", function () {

    it("should load the KBase", function() {
        var p = KBase.initAsync();
        p.then(function() {
            expect(KBase.topics).not.to.be.null;
        });
    });

    it("should have wikilinks in output", function () {
        var res, msg;
        msg = TestHelper.makeMessageFromString("wiki css");
        res = GBot.findAnyReply(msg);
        expect(res).to.include("## :pencil: [css](https://github.com/freecodecamp/freecodecamp/wiki/css)");
    });

});

