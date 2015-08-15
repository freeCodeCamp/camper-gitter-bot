"use strict";
require('dotenv').config({path: 'dot.env'});

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
        expect(output).to.include("> testuser sends brownie points to @dcsan and @berkeleytrue");
        //var res = "help bootstrap".match(/(help|wiki|check) (.*)/);
        //assert.equal(res[2], "bootstrap");
    });


    //TODO - hard to test as it relies on an async http call to get the info
    //it("about should work", function () {
    //    var input = TestHelper.makeInputFromString("about @dcsan @bob");
    //    var output = GBot.findAnyReply(input.message);
    //    Utils.tlog("input", input);
    //    Utils.tlog("mentions", input.message.model.mentions);
    //    Utils.tlog("output", output);
    //    expect(output).to.include("> about @dcsan");
    //});

    //HttpWrap.callApi(apiPath, options, function(apiResult) {
    //    console.log(apiResult);
    //    expect(apiResult.response.about.username).to.equal("berkeleytrue");
    //    expect(apiResult.response.about.github).to.equal("http://github.com/BerkeleyTrue");
    //    // expect(apiResult.about.bio).to.include("something");
    //    done();
    //});


});
