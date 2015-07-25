var expect = require("chai").expect,
    assert = require("chai").assert;

var Rooms = require("../lib/app/Rooms.js");

describe("Rooms", function(){

    it("should find a default room", function() {
        var room = Rooms.findByTopic("ThisDoesntExistRandomXX");
        assert.isDefined(room);
        expect(room.title).to.equal("GeneralChat");
    })

    it("should find a room for objects topic", function() {
        var room = Rooms.findByTopic("objects");
        // console.log("topic", topic);
        expect(room.title).to.equal("JS-Basics");
    })

    it("should find a room by name", function() {
        var room = Rooms.findByName("JS-Basics");
        expect(room.title).to.equal("JS-Basics");
    })

});