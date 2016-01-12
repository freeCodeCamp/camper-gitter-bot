'use strict';

const Bonfires = require('../../../lib/app/Bonfires'),
      Rooms = require('../../../lib/app/Rooms'),
      Utils = require('../../../lib/utils/Utils');

const commands = {

  // commands to bonfire with a parameter
  bonfire: function(input, bot, blob) {

    const bonfire = this.checkHasBonfire(input, bot);
    let foundCmd = false;

    const opts = {
      bonfire: bonfire,
      input: input,
      bot: bot,
      blob: blob
    };

    if (bonfire) {
      foundCmd = this.checkBonfireCommands(opts);
      if (foundCmd) {
        return foundCmd;
      }
    }
    if (!foundCmd) {
      return this.searchBonfire(input, bot);
    }
  },

  checkBonfireCommands: function(opts) {
    const bonfire = opts.bonfire;
    switch (opts.input.params) {
      // no params just return status
      /* eslint-disable no-undefined */
      case undefined:
        return Bonfires.fixed.reminder(bonfire.name);
      /* eslint-enable no-undefined */
      case 'info':
        return Bonfires.bonfireInfo(bonfire);
      case 'details':
        return Bonfires.bonfireDetails(bonfire);
      case 'links':
        return Bonfires.bonfireLinks(bonfire);
      case 'spoiler':
      case 'hint':
        return this.hint(opts.input, opts.bot);
      case 'script':
        return Bonfires.bonfireScript(bonfire);
      case 'wiki':
        return Bonfires.bonfireWiki(bonfire);
      case 'name':
        return Bonfires.fixed.nameHint;
      case 'status':
        return Bonfires.bonfireStatus(bonfire);
      default:
        return false;
    }
  },

  searchBonfire: function(input) {
    if (!input.params) {
      return Bonfires.fixed.askName;
    }

    Utils.log('params ', input.params);
    const newBonfire = Bonfires.findBonfire(input.params);

    if (newBonfire) {
      this.currentBonfire = newBonfire;
      return Bonfires.bonfireInfo(newBonfire);
    } else {
      // TODO - only send this messsage if at the start of a line
      return Bonfires.fixed.cantFind(input.params);
    }
  },

  // TODO - FIXME this is a bit sketchy, return type is 'bonfire name' or true.
  checkHasBonfire: function(input) {
    const roomName = input.message.room.name;
    if (Rooms.isBonfire(roomName)) {
      const bfName = roomName.split('/')[1];
      return Bonfires.findBonfire(bfName);
    }

    if (!this.currentBonfire) {
      return false;
    }

    return this.currentBonfire;
  },

  inBonfireRoom: function(input) {
    const roomName = input.message.room.name;
    return !!Rooms.isBonfire(roomName);
  },

  // this is a naked command
  hint: function(input, bot) {
    const bonfire = this.checkHasBonfire(input, bot);
    if (!bonfire) {
      return Bonfires.fixed.setName;
    }

    if (!this.inBonfireRoom(input, bot)) {
      return Bonfires.fixed.goToBonfireRoom(bonfire);
    }
    // all good so:
    return Bonfires.getNextHint(bonfire, input);
  }
};

// alias
commands.bf = commands.bonfire;

module.exports = commands;
