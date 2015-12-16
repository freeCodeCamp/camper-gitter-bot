'use strict';

const Utils = require('../utils/Utils');

const InputWrap = {
  roomShortName: function(input) {
    let name = input.message.room.name;
    name = name.split('/');
    name = name[1] || name[0];
    return name;
  },

  fromUser: function(input) {
    try {
      return '@' + input.message.model.fromUser.username;
    } catch (e) {
      Utils.error('InputWrap', 'no fromUser', input);
    }
  },

  mentioned: function(input) {
    const mentions = input.message.model.mentions;
    let names;
    if (mentions) {
      // TODO - build a list
      return names;
    }
    return null;
  }
};

module.exports = InputWrap;
