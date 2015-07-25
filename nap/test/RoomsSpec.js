var expect = require("chai").expect,
    assert = require("chai").assert;

var Rooms = require("../lib/app/Rooms.js");

describe("Rooms", function(){

    it("should find a default room", function() {
        var room = Rooms.findRoomFromTopic("ThisDoesntExistRandomXX");
        assert.isDefined(room);
        expect(room.title).to.equal("Default Room");
    })

    it("should find a room for objects topic", function() {
        var room = Rooms.findRoomFromTopic("objects");
        // console.log("topic", topic);
        expect(room.title).to.equal("JS-Basics");
    })

});