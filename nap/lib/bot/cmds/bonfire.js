"use strict";


var TextLib = require("../../../lib/utils/TextLib"),
    Bonfires = require("../../../lib/app/Bonfires");
    // GBot = require("../../../lib/bot/GBot.js"),
    // KBase = require("../../bot/KBase"),
    // Utils = require("../../../lib/utils/Utils"),
    // HttpWrap = require("../../../lib/utils/HttpWrap")


var newline = "\n";

var commands = {

    fixed: {
        infoFooter: "\n- `bonfire info` for more info " +
            "\n- `bonfire links` " +
            "\n- `bonfire script` for the script" +
            "\n- `bonfire spoiler` for some clues on how to solve it" +
            "\n- `bonfire wiki` for related info from the wiki ",
        askName: "give the name of the bonfire and I'll try to look it up!",
        setName: "Set a bonfire to talk about with `bonfire name`",
        reminder: function(name) {
            return "we're talking about bonfire :fire: " + name;
        }
    },

    checkHasBonfire: function() {
        if (!this.currentBonfire) {
            return this.fixed.setName;
        } else {
            return true;
        }
    },

    bonfire: function(input, bot, blob) {
        var params = input.params;

        switch (params) {
            case null:
                if (this.currentBonfire) {
                    return this.fixed.reminder(this.currentBonfire.name);
                } else {
                    return this.fixed.askName;
                }
                break;

            case 'info':
                return this.bonfireInfo();
            case 'links':
                return this.bonfireLinks();
            case 'spoiler':
                return this.bonfireHint();
            case 'script':
                return this.bonfireScript();
            default:
                var bonfire = Bonfires.findBonfire(params);
                if (bonfire) {
                    this.currentBonfire = bonfire;
                    return this.bonfireInfo(bonfire);
                } else {
                    // TODO - only send this messsage if at the start of a line
                    return "can't find a bonfire called " + params;
                }
        }
    },

    bonfireInfo: function() {
        var res = this.checkHasBonfire();
        if (res !== true) {
            return res;
        }

        var str = "Let's talk about \n ## :fire:";
        str += TextLib.mdLink(
            this.currentBonfire.name,
            "www.freecodecamp.com/challenges/" + this.currentBonfire.dashedName
        );
        if (this.bonfire.description) {
            str += newline + this.bonfire.description[0];
        }
        str += newline + this.fixed.infoFooter;
        return str;
    },

    // bonfire features
    bonfireHint: function(input, bot) {
        var res = this.checkHasBonfire();
        if (res !== true) { return res; }
        return Bonfires.getNextHint(this.currentBonfire);
    },

    bonfireLinks: function(input, bot) {
        var res = this.checkHasBonfire();
        if (res !== true) { return res; }
        return Bonfires.getLinks(this.currentBonfire);
    },

    bonfireScript: function(input, bot) {
        var res = this.checkHasBonfire();
        if (res !== true) { return res; }
        return Bonfires.getSeed(this.currentBonfire);
    },

};

// alias
commands.bf = commands.bonfire;

module.exports = commands;

