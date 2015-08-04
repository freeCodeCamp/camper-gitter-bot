"use strict";


var TextLib = require("../../../lib/utils/TextLib"),
    Bonfires = require("../../../lib/app/Bonfires"),
     BotCommands = require("../../../lib/bot/BotCommands"),
    // KBase = require("../../bot/KBase"),
    Utils = require("../../../lib/utils/Utils");
    // HttpWrap = require("../../../lib/utils/HttpWrap")


var newline = "\n";

var commands;
commands = {

    //TODO rename as we merge this object. make it more distinctive
    fixed: {
        footer: "\n\n> type: `bf details` `bf links` `bf room`",
        menu: "\n- `bonfire info` for more info " +
        "\n- `bonfire links` " +
        "\n- `bonfire script` for the script",
        askName: "give the name of the bonfire and I'll try to look it up!",
        setName: "Set a bonfire to talk about with `bonfire name`",
        comingSoon: "Coming Soon! We're working on it!",
        nameHint: "no, type part of the name of the bonfire! eg `bonfire roman` ",
        alert: "\n - :construction: **spoiler alert** :construction:",
        reminder: function (name) {
            return "we're talking about bonfire :fire: " + name;
        },
        cantFind: function (name) {
            return "> Sorry, can't find a bonfire called " + name + ". [ [Check the map?](http://www.freecodecamp.com/map#Basic-Algorithm-Scripting) ]";
        },
        roomLink: function(name) {
            var str =  ":construction: **spoiler alert** ";
            str += "[dedicated chatroom](https://gitter.im/camperbot/" + name + ")"
            str += ":arrow_forward:";
            return str;
        }
    },

    checkHasBonfire: function () {
        if (!this.currentBonfire) {
            return this.fixed.setName;
        } else {
            return true;
        }
    },

    // commands to bonfire with a parameter
    bonfire: function (input, bot, blob) {
        var params = input.params;

        switch (params) {
            case undefined:
                if (this.currentBonfire) {
                    return this.fixed.reminder(this.currentBonfire.name);
                } else {
                    return this.fixed.askName;
                }
                break;

            case 'info':
                return this.bonfireInfo();
            case 'details':
                return this.bonfireDetails();
            case 'links':
                return this.bonfireLinks();
            case 'spoiler':
            case 'n':
                return this.bonfireHint();
            case 'script':
                return this.bonfireScript();
            case 'wiki':
                return this.bonfireWiki(input, bot, blob);
            case 'name':
                return this.fixed.nameHint;
            case 'status':
                return this.bonfireStatus(input, bot, blob);


            default:
                Utils.log('params [' + params + ']');
                var bonfire = Bonfires.findBonfire(params);
                if (bonfire) {
                    this.currentBonfire = bonfire;
                    return this.bonfireInfo(bonfire);
                } else {
                    // TODO - only send this messsage if at the start of a line
                    return this.fixed.cantFind(params);
                }
        }
    },

    bonfireStatus: function(input, bot, blob) {
        var bf = this.currentBonfire;
        if (!bf) return;
        var str = "\n- hints: " + bf.hints.length;
            //str += "\n- wikiHints: " + bf.wikiHints.length;
            //str += "\n- description: " + bf.description.length;
        return str;
    },
    bonfireHeader: function () {
        var res = this.checkHasBonfire();
        if (res !== true) {
            return res;
        }

        var str = "## :fire:";
        str += TextLib.mdLink(
            this.currentBonfire.name,
            "www.freecodecamp.com/challenges/" + this.currentBonfire.dashedName
        );
        str += " :link:";
        return str;
    },

    bonfireInfo: function () {
        var str = this.bonfireHeader() + newline;
        str += this.bonfireScript() + newline;
        str += this.bonfireDescription(1) + newline;
        str += newline + this.fixed.footer;
        return str;
    },

    bonfireDetails: function () {
        var res = this.checkHasBonfire();
        if (res !== true) {
            return res;
        }

        var name = this.currentBonfire.dashedName;

        var str = this.bonfireHeader();
        str += newline + this.bonfireScript();
        str += newline + this.bonfireDescription();
        str += newline + this.bonfireLinks();
        str += newline + '\n-----\n';
        //str += newline + this.fixed.menu;
        str += newline + this.fixed.roomLink(name)

        return str;
    },

    bonfireDescription: function (lines) {
        if (lines) {
            var desc = this.currentBonfire.description.slice(0, lines);
        } else {
            desc = this.currentBonfire.description;
        }
        return desc.join('\n');
    },

    // bonfire features
    bonfireHint: function (input, bot) {
        var res = this.checkHasBonfire();
        if (res !== true) {
            return res;
        }
        return Bonfires.getNextHint(this.currentBonfire);
    },

    bonfireLinks: function (input, bot) {
        var res = this.checkHasBonfire();
        if (res !== true) {
            return res;
        }
        return Bonfires.getLinks(this.currentBonfire);
    },

    bonfireScript: function (input, bot) {
        var res = this.checkHasBonfire();
        if (res !== true) {
            return res;
        }
        return Bonfires.getSeed(this.currentBonfire);
    },

    blah: function(input, bot) {
        console.log("blah", input);
    },

    more: function (input, bot) {
        if (input.params) {
            return;  // random user input matched more ...
        }
        return(this.bonfireHint(input, bot));
    },

    bonfireWiki: function (input, bot, blob) {
        if (!this.currentBonfire) {
            return null;
        } else {
            input.params = this.currentBonfire.name;
            //return(BotCommands.wiki(input, bot));
        }
    }

};

// alias
commands.bf = commands.bonfire;

module.exports = commands;

