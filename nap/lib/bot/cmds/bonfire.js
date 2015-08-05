"use strict";


var TextLib = require("../../../lib/utils/TextLib"),
    Bonfires = require("../../../lib/app/Bonfires"),
    BotCommands = require("../../../lib/bot/BotCommands"),
     KBase = require("../../bot/KBase"),
    Rooms = require("../../../lib/app/Rooms"),
    Utils = require("../../../lib/utils/Utils");
    // HttpWrap = require("../../../lib/utils/HttpWrap")


var newline = "\n";

var commands;
commands = {

    //TODO rename as we merge this object. make it more distinctive
    fixed: {
        footer: "\n\n> type: `bf details` `bf links` `bf spoiler`",
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
            str += " :arrow_forward:";
            return str;
        },
        goToBonfireRoom: function(bf) {
            var link = Utils.linkify(bf.dashedName, "camperbot", "Bonfire's Custom Room");
            var str = "> Spoilers are only in the " + link + " :point_right: ";
            return str;
        }
    },

    // commands to bonfire with a parameter
    bonfire: function (input, bot, blob) {
        var params = input.params;

        var bonfire = this.checkHasBonfire(input, bot);

        switch (params) {
            //no params just return status
            case undefined:
                if (bonfire) {
                    return this.fixed.reminder(bonfire.name);
                } else {
                    return this.fixed.askName;
                }
                break;

            case 'info':
                return Bonfires.bonfireInfo(bonfire);
            case 'details':
                return Bonfires.bonfireDetails(bonfire);
            case 'links':
                return Bonfires.bonfireLinks(bonfire);
            case 'spoiler':
            case 'hint':
                return Bonfires.bonfireHint(bonfire);
            case 'script':
                return Bonfires.bonfireScript(bonfire);
            case 'wiki':
                return Bonfires.bonfireWiki(bonfire);
            case 'name':
                return this.fixed.nameHint;
            case 'status':
                return this.bonfireStatus(bonfire);
            case 'wiki':
                return Bonfires.bonfireWiki(bonfire);

            default:
                Utils.log('params [' + params + ']');
                var newBonfire = Bonfires.findBonfire(params);
                Utils.warn("newBonfire", newBonfire.dashedName);
                if (newBonfire) {
                    this.currentBonfire = newBonfire;
                    return Bonfires.bonfireInfo(newBonfire);
                } else {
                    // TODO - only send this messsage if at the start of a line
                    return this.fixed.cantFind(params);
                }
        }
    },

    // FIXME - this is a bit sketchy, return type is "bonfire name" or true.
    checkHasBonfire: function (input, bot) {
        var roomName = input.message.room.name;
        if (Rooms.isBonfire(roomName)) {
            var bfname = roomName.split("/")[1]
            var bf = Bonfires.findBonfire(bfName);
            return bf;
        }

        if (!this.currentBonfire) {
            return false;
        }

        return (this.currentBonfire);
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


};

// alias
commands.bf = commands.bonfire;

module.exports = commands;

