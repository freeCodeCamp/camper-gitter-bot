"use strict";

require('dotenv').config({path: 'dot.env'});

var expect = require("chai").expect;
require("../lib/patch/StringPatch");

var RoomMessages = require("../data/rooms/RoomMessages");
var TestHelper = require("./TestHelper");
var GBot = require("../lib/bot/GBot");
var Utils = require("../lib/utils/Utils");

describe("RoomMessages", function(){

    it("should find a message for ", function() {
        var chat = "you gotta holler i say";
        var input = TestHelper.makeInputFromString(chat);
        var msg = RoomMessages.scanInput(input, "camperbot/testing", 1);
        expect(msg.text).to.equal("> holler back!");
    });

    it("should be silent in 0 chance rooms", function() {
        var chat = "you gotta holler i say";
        var input = TestHelper.makeInputFromString(chat);
        var msg = RoomMessages.scanInput(input, "camperbot/testing", 0);
        expect(msg).to.equal(null);
    });

    it("should find a message three ticks ''' ", function() {
        var chat = "mistake ''' text";
        var input = TestHelper.makeInputFromString(chat);
        var msg = RoomMessages.scanInput(input, "camperbot/testing", 1);
        //Utils.tlog("ticks msg", msg);
        expect(msg.text).to.include("> :bulb: to format");
    });

    it("should find a message for bonfire", function() {
        var chat = "help for bonfire XXX";
        var input = TestHelper.makeInputFromString(chat);
        var msg = RoomMessages.scanInput(input, "camperbot/testing", 1);
        expect(msg.text).to.include("> type `bonfire name`");
    });

});
