"use strict";

require('dotenv').load();

var assert = require("chai").assert,
    expect = require("chai").expect;

var GBot = require("../lib/bot/GBot.js"),
    BotCommands = require("../lib/bot/BotCommands"),
    Utils = require("../lib/utils/Utils"),
    KBase = require("../lib/bot/KBase.js"),
    TestHelper = require('./TestHelper');


function clog(msg, obj) {
    Utils.clog("KbaseSpec>", msg, obj);
}

function checkInput(text) {
    var msg, res;
    msg = TestHelper.makeInputFromString(text);
    res = GBot.parseInput(msg);
    return (res);
}


describe("Commands", function () {

    it("should load the KBase", function() {
        var p = KBase.initSync();
    });

    it("command: menu", function () {
        var res = Utils.splitParams("menu");
        expect(res.keyword).to.equal("menu");
        expect(res.params).to.be.undefined;
    });

    it("command: menu options", function () {
        var res = Utils.splitParams("menu options");
        expect(res.keyword).to.equal("menu");
        expect(res.params).to.equal("options");
    });

    it("command: menu with more stuff", function () {
        var res = Utils.splitParams("menu with more stuff");
        expect(res.keyword).to.equal("menu");
        expect(res.params).to.equal("with more stuff");
    });


    it("isCommand: menu true", function () {
        var input = {
            keyword: "menu"
        };
        var res = BotCommands.isCommand(input);
        expect(res).to.be.true;
    });


    it("isCommand: XXXX false", function () {
        var res = BotCommands.isCommand("XXXX");
        expect(res).to.be.false;
    });


    it("should show archives", function() {
        var archive = BotCommands.archive(TestHelper.stubInput);
        expect(archive).not.to.be.null;
        expect(archive).to.include("Archives for ");
    });

    it("should have a find command", function() {
        var input = TestHelper.makeInputFromString("find bootstrap");
        //console.log('input', input);
        expect(input.keyword).to.equal("find");
        expect(input.params).to.equal("bootstrap");
        var res = BotCommands.find(input, {} );
        expect(res).to.include("find **bootstrap**");
    });


    it("should show archive", function() {
        var input = TestHelper.stubInput;
        input.keyword = "archive";
        var res = BotCommands.archive(input);
        expect(res).not.to.be.null;
        expect(res).to.include("Archives for");
    });

    // it("should show about @mention", function() {
    //     var msg = "";
    //     var archive = BotCommands.archive(TestHelper.stubInput);
    //     expect(archive).not.to.be.null;
    //     expect(archive).to.include("archive for ")
    // });



});

