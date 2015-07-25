"use strict";

var _ = require("underscore");

var RoomData = require('../../data/RoomData.js');

var Rooms = {

    findByTopic: function(topic) {
        debugger;

        var rooms = RoomData.filter(function(rm) {
            var topics = rm.topics;
            if (!topics) return false;

            if (topics.indexOf(topic) != -1) {
                return true;
            }
            return false;
        })

        return (this.checkRoom(rooms[0], 'findByTopic', topic))
    },

    findByName: function(name) {
        var rooms = RoomData.filter( function(rm) {
            return (rm.title == name);
        })
        return (this.checkRoom(rooms[0], 'findByName', name))
    },

    names: function() {
        this.roomList = RoomData.map(function(room) {
            return room.title
        })
        return this.roomList;
    },

    checkRoom: function(room, how, tag) {
        if (room) return room;
        console.warn("cant findRoom ", how, tag);
        return (RoomData.defaultRoom);  // careful, this is a property not a func
    }

};

module.exports = Rooms;