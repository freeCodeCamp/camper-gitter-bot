"use strict";

// var _ = require("underscore");

var RoomData = require('../../data/RoomData.js'),
    Bonfires = require('./Bonfires'),
    AppConfig = require('../../config/AppConfig');

var Rooms = {

    findByTopic: function(topic) {

        var rooms = RoomData.filter(function(rm) {
            var topics = rm.topics;
            if (!topics) {
                return false;
            }

            if (topics.indexOf(topic) !== -1) {
                return true;
            }
            return false;
        });

        return (this.checkRoom(rooms[0], 'findByTopic', topic));
    },

    // var rooms = GBot.roomList.filter(function(rm) {
    //     clog("checking room", rm.name + "==" + opts.roomObj.name);
    //     var match = (rm.name == opts.roomObj.name);
    //     if (match) {
    //         console.log("matched!")
    //         return true;
    //     }
    //     return false;
    // })

    findByName: function(name) {
        var rooms = RoomData.filter( function(rm) {
            return (rm.name === name);
        });
        return (this.checkRoom(rooms[0], 'findByName', name));
    },

    names: function() {
        this.roomList = RoomData.map(function(room) {
            return room.name;
        });
        return this.roomList;
    },

    checkRoom: function(room, how, tag) {
        if (room) {
            return room;
        }
        // Utils.warn("Rooms", "failed", how, tag);
        return (RoomData.defaultRoom);  // careful, this is a property not a func
    },

    // bonfireRooms: function() {
    //     var list = Bonfires.data.challenges.map(function(item) {
    //         var roomLink = item.dashedName();
    //         return roomLink;
    //     })
    //     return(list);
    // }

};


module.exports = Rooms;
