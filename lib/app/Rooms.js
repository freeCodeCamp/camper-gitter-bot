'use strict';

const RoomData = require('../../data/RoomData'),
      _ = require('lodash'),
      Utils = require('../utils/Utils');

const Rooms = {

  findByTopic: function(topic) {
    const rooms = RoomData.rooms().filter(rm => {
      const topics = rm.topics;
      if (topics && topics.indexOf(topic) !== -1) {
        return true;
      }
      return false;
    });

    return (this.checkRoom(rooms[0], 'findByTopic', topic));
  },

  findByName: function(name) {
    const room = _.findWhere(RoomData.rooms(), { name: name });
    if (room) {
      return room;
    }
    Utils.error('cant find room name:', name);
  },

  isBonfire: function(name) {
    const room = this.findByName(name);
    if (room) {
      return room.isBonfire;
    }
    return false;
  },

  names: function() {
    this.roomList = RoomData.rooms().map(room => room.name);
    return this.roomList;
  },

  checkRoom: function(room, how, tag) {
    if (room) {
      return room;
    }
    Utils.error('Rooms.checkRoom> failed', how, tag);
  }
};

module.exports = Rooms;
