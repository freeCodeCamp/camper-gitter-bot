"use strict";

var RoomData = require('../../data/RoomData.js'),
    _ = require("underscore");

var Rooms = {

    findRoomFromTopic: function(topic) {
        debugger;

        var rooms = RoomData.filter(function(rm) {
            console.log("filter ", rm);
            if (rm.topics && rm.topics.indexOf(topic) > 0) {
                return true;
            }
            return false;
        })
        console.log("topic", topic, "filtered:", rooms);
        var room = rooms[0]
        if (room) return room;

        console.warn("cant findRoomFromTopic ", topic)
        return RoomData[0];
    },

};

module.exports = Rooms;