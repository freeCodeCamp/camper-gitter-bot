"use strict";

require('dotenv').load();

var expect = require("chai").expect,
    assert = require("chai").assert;

var Rooms = require("../lib/app/Rooms.js");

describe("Rooms", function(){

// not any more since we have new oneToOne rooms at any time
    // it("should find a default room", function() {
    //     var room = Rooms.findByTopic("ThisDoesntExistRandomXX");
    //     assert.isDefined(room);
    //     expect(room.title).to.equal("GeneralChat");
    //     expect(room.name).to.equal("bothelp/GeneralChat");
    // })

    it("should find a room for objects topic", function() {
        var room = Rooms.findByTopic("bonfires");
        // console.log("topic", topic);
        expect(room.name).to.equal("bothelp/HelpBonfires");
    });

    it("should find a room by name", function() {
        var room = Rooms.findByName("bothelp/HelpBonfires");
        expect(room.name).to.equal("bothelp/HelpBonfires");
    });

    it("should find a bonfire room", function() {
        var room = Rooms.findByName("bothelp/bonfire-factorialize-a-number");
        expect(room.name).to.equal("bothelp/bonfire-factorialize-a-number");
        expect(room.isBonfire).to.equal(true);
    });

});

