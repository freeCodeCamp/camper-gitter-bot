/**
 * Created by dc on 8/3/15.
 */

"use strict";

var expect = require("chai").expect;

var AppConfig = require("../config/AppConfig"),
    GBot = require("../lib/bot/GBot"),
    Utils = require("../lib/utils/Utils"),
    TestHelper = require("./TestHelper"),
    KBase = require("../lib/bot/KBase");

function clog(msg, obj) {
    Utils.clog("KbaseSpec>", msg, obj);
}


describe("Thanks", function () {

    it("should work for two users", function () {
        var input = TestHelper.makeInputFromString("thanks @dcsan @bob");
        var output = GBot.findAnyReply(input.message);
        expect(output).to.include("> testuser sends brownie points to @mentioneduserone and @mentionedusertwo");
        //var res = "help bootstrap".match(/(help|wiki|check) (.*)/);
        //assert.equal(res[2], "bootstrap");
    });

});
