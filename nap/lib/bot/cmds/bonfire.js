"use strict";


var TextLib = require("../../../lib/utils/TextLib"),
    Bonfires = require("../../../lib/app/Bonfires"),
    //BotCommands = require("../../../lib/bot/BotCommands"),
     KBase = require("../../bot/KBase"),
    Rooms = require("../../../lib/app/Rooms"),
    Utils = require("../../../lib/utils/Utils");
    // HttpWrap = require("../../../lib/utils/HttpWrap")




var commands;
commands = {


    // commands to bonfire with a parameter
    bonfire: function (input, bot, blob) {

        var bonfire = this.checkHasBonfire(input, bot);

        var foundCmd = false;
        var opts = {
            bonfire: bonfire,
            input: input,
            bot: bot,
            blob: blob
        };
        if (bonfire) {
            foundCmd = this.checkBonfireCommands(opts);
            if(foundCmd) {
                return foundCmd;
            }
        }
        if (!foundCmd) {
            return this.searchBonfire(input, bot);
        }
    },

    checkBonfireCommands: function(opts) {
        var bonfire = opts.bonfire;
        switch (opts.input.params) {
            //no params just return status
            case undefined:
                return Bonfires.fixed.reminder(bonfire.name);
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

    searchBonfire: function(input, bot) {
        if (!input.params) {
            return Bonfires.fixed.askName;
        }
        Utils.log('params ', input.params);
        var newBonfire = Bonfires.findBonfire(input.params);
        if (newBonfire) {
            //Utils.warn("newBonfire", newBonfire.dashedName);
            //side effects
            this.currentBonfire = newBonfire;
            return Bonfires.bonfireInfo(newBonfire);
        } else {
            // TODO - only send this messsage if at the start of a line
            return Bonfires.fixed.cantFind(input.params);
        }
    },

    // FIXME - this is a bit sketchy, return type is "bonfire name" or true.
    checkHasBonfire: function (input, bot) {
        var roomName = input.message.room.name;
        if (Rooms.isBonfire(roomName)) {
            var bfName, bf;
            bfName = roomName.split("/")[1];
            var bf = Bonfires.findBonfire(bfName);
            return bf;
        }

        if (!this.currentBonfire) {
            return false;
        }

        return (this.currentBonfire);
    },

    inBonfireRoom: function(input, bot, bonfire) {
        var roomName = input.message.room.name;
        return !!Rooms.isBonfire(roomName);
    },

    //this is a naked command
    hint: function (input, bot) {
        var bonfire = this.checkHasBonfire(input, bot);
        if (!bonfire) {
            return Bonfires.fixed.setName;
        }

        if (!this.inBonfireRoom(input, bot)) {
            return Bonfires.fixed.goToBonfireRoom(bonfire);
        }
        // all good so:
        return(Bonfires.getNextHint(bonfire, input));
    }


};

// alias
commands.bf = commands.bonfire;

module.exports = commands;

