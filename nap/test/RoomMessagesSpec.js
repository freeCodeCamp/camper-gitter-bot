"use strict";

require('dotenv').config({path: 'dot.env'});

var expect = require("chai").expect;

var RoomMessages = require("../data/rooms/RoomMessages.js");
var TestHelper = require("./TestHelper.js");


describe("RoomMessages", function(){

    it("should find a message for ", function() {
        var chat = "you gotta holler i say";
        var input = TestHelper.makeInputFromString(chat);
        var msg = RoomMessages.scanInput(input, "camperbot/testing", 1);
        expect(msg).to.equal("> holler back!");
    });

    it("should be silent in 0 chance rooms", function() {
        var chat = "you gotta holler i say";
        var input = TestHelper.makeInputFromString(chat);
        var msg = RoomMessages.scanInput(input, "camperbot/testing", 0);
        expect(msg).to.equal(null);
    });



});

