"use strict";

//var yaml = require('js-yaml');
var fs = require('fs');

var Utils = require('../../lib/utils/Utils'),
    InputWrap = require('../../lib/bot/InputWrap'),
    KBase = require('../../lib/bot/KBase'),
    TextLib = require('../../lib/utils/TextLib');


var newline = '\n';

// https://raw.githubusercontent.com/FreeCodeCamp/freecodecamp/staging/seed/challenges/basic-bonfires.json
// https://github.com/FreeCodeCamp/freecodecamp/blob/staging/seed/challenges/basic-bonfires.json

// based on original json format from FCC
/*
    "id": "bd7139d8c441eddfaeb5bdef",
    "name": "Waypoint: Pair Program on Bonfires",
    "dashedName": "waypoint-pair-program-on-bonfires",
    "difficulty": 0.44,
    "challengeSeed": ["119657641"],
    "description": [],
    "challengeType": 2,
    "tests": [],
    "nameCn": "",
    "descriptionCn": [],
    "nameFr": "",
    "descriptionFr": [],
    "nameRu": "",
    "descriptionRu": [],
    "nameEs": "",
    "descriptionEs": [],
    "namePt": "",
    "descriptionPt": []
*/


var Bonfires;

Bonfires = {
    data: null,
    fixed: {
        hintWarning: "## :construction: ** After this are possible spoiler hints.**\nMake sure you've tried to hard to solve it yourself before proceeding. :construction:",
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
            var str = "> :construction: Spoilers are only in the " + link + " :point_right: ";
            return str;
        },
        pleaseContribute: function(bf) {
            var link = Utils.linkify(bf.dashedName, "wiki", "Bonfire's Wiki Hints Page");
            var str = "These hints depend on people like you! Please add to this :point_right: " + link;
            return str;
        }
    },

    load: function () {
        //for now always load as webUI calls this
        //if (this.data) {
        //    return this.data;
        //}
        // Get document, or throw exception on error
        try {
            // this.data = yaml.safeLoad(fs.readFileSync('./data/bonfires/basic-bonfires.yml', 'utf8'));
            this.raw = fs.readFileSync('./data/seed/challenges/basic-bonfires.json', 'utf8');
            this.data = JSON.parse(this.raw);
            Bonfires.loadWikiHints();
            // this.data = Utils.toMarkdown(this.data);
            // Utils.log("bonfires", this.data);
        } catch (e) {
            Utils.error("can't load bonfire data", e);
        }
        return this;  // chainable
    },

    loadWikiHints: function () {
        //Utils.tlog("-- Bonfires.loadWikiHints start / WikiHints >", testBf.wikiHints);
        this.data.challenges = this.data.challenges.map(function (bf) {
            bf.hints = [Bonfires.fixed.hintWarning];  //bf.description;
            var wikiHints = KBase.getWikiHints(bf.dashedName);
            if (wikiHints) {
                bf.hints = bf.hints.concat(wikiHints);
                //bf.wikiHints = wikiHints;
            } else {
                //Utils.tlog("bf.wikiHints not found", bf.dashedName);
            }
            return bf;
        });
        //Utils.tlog("Bonfires.loadWikiHints end / WikiHints >", testBf.wikiHints);
    },

    findBonfire: function (bfName) {
        var flag;
        bfName = TextLib.dashedName(bfName);
        var bfs = this.data.challenges.filter(function (item) {
            flag = (item.dashedName.includes(bfName));
            //Utils.tlog(item.dashedName, bfName);
            return flag;
        });
        var bf = bfs[0];
        if (!bf) {
            Utils.warn("cant find bonfire for " + bfName);
            return null;
        } else {
            return bf;
        }
    },


    getNextHint: function (bonfire, input) {
        var hint, hintNum;

        hintNum = parseInt(input.params);
        if (isNaN(hintNum)) {
            hintNum = bonfire.currentHint || 0;
        }
        hint = bonfire.hints[hintNum];

        if (hintNum < bonfire.hints.length) {
            var hintCounter = hintNum + 1; // cant do math inside a string concat line
            hint = "`hint [" + hintCounter + "/" + bonfire.hints.length + "]`\n## " + hint;
            bonfire.currentHint = hintNum + 1;
            hint += this.wikiLinkFooter(bonfire);
            return hint;
        } else {
            bonfire.currentHint = 0;
            Utils.log("no hints", hintNum, bonfire);
            var str = Bonfires.fixed.pleaseContribute(bonfire);
            //str += newline + this.wikiLinkFooter(bonfire);
            return str;
        }
    },


    // from input
    //getHintNum: function (input, num) {
    //    num = num || 0;
    //    var output, bf, roomName;
    //    roomName = InputWrap.roomShortName(input);
    //    bf = this.findBonfire(roomName);
    //
    //    if (!bf || !bf.description) {
    //        var msg = ("no outputs found for: " + roomName);
    //        Utils.error("Bonfires>", msg, bf);
    //        return msg;
    //    }
    //
    //    output = "hint for " + roomName + newline;
    //    output += (bf.description[0]);
    //    return output;
    //},

    // bonfire features
    //bonfireHint: function (bonfire) {
    //    Utils.log("currentBonfire:", this.currentBonfire);
    //    return Bonfires.getNextHint(this.currentBonfire);
    //},

    toMarkdown: function (data) {
        this.data.challenges = this.data.challenges.map(function (item) {
            item.description = item.description.map(function (desc) {
                return Utils.toMarkdown(desc);
            });
        });
    },

    allDashedNames: function () {
        return this.fieldList('dashedName');
    },

    allNames: function () {
        return this.fieldList('name');
    },

    fieldList: function (field) {
        var list = this.data.challenges.map(function (item) {
            // console.log(item);
            // console.log('-----------');
            return item[field];
        });
        return list;
    },

    fromInput: function (input) {
        var roomName, bf;
        roomName = InputWrap.roomShortName(input);
        bf = this.findBonfire(roomName);
        Utils.checkNotNull(bf, 'cant find bonfire for ' + roomName );
        return (bf);
    },


    wikiLinkFooter: function(bonfire) {
        var str = "\n\n> type `hint` for next hint  :pencil: ";
        var text = "[Contribute at the FCC Wiki]";
        str += Utils.linkify(bonfire.dashedName, "wiki", text);

        return str;
    },
    getDescription: function (bonfire) {
        var desc = bonfire.description.join('\n');
        return desc;
    },

    getLinks: function (bonfire) {
        // FIXME - change to actual links see
        // https://github.com/dcsan/gitterbot/issues/45
        var output = "links: \n";
        output += Utils.makeUrlList(bonfire.MDNlinks, 'mdn');
        return output;
    },

    getLinksFromInput: function (input) {
        var bf;
        bf = Bonfires.fromInput(input);

        if (!bf || !bf.MDNlinks) {
            var msg = ("no links found for: " + input.params);
            Utils.error("Bonfires>", msg, bf);
            return msg;
        }
        return this.getLinks(bf);
    },

    getSeed: function (bonfire) {
        var output, seed;
        seed = bonfire.challengeSeed.join("\n");
        output = "```js " + newline;
        output += seed;
        output += "```";
        return output;
    },

    getChallengeSeedFromInput: function (input) {
        var output, bf, seed;
        //var roomName = InputWrap.roomShortName(input);
        bf = Bonfires.fromInput(input);

        if (!bf || !bf.challengeSeed) {
            var msg = ("no challengeSeed found for: " + input.params);
            Utils.error("Bonfires>", msg, bf);
            return msg;
        }

        seed = bf.challengeSeed.join("\n");

        output = "```js " + newline;
        output += seed;
        output += "```";
        return output;
    },

    //methods that describe a bonfire that accept/expect a bonfire parameter
    bonfireInfo: function (bonfire) {
        if(!bonfire){
            Utils.error("Bonfires.bonfireInfo", "no bonfire");
        } else {
            Utils.warn("Bonfires.bonfireInfo", "bonfire:", bonfire.dashedName);
        }
        var str = this.bonfireHeader(bonfire) + newline;
        str += this.bonfireScript(bonfire) + newline;
        str += this.bonfireDescription(bonfire) + newline;
        str += newline + this.fixed.footer;
        return str;
    },

    bonfireStatus: function(bonfire) {
        var str = "\n- hints: " + bonfire.hints.length;
        //str+= "\n- room.name: " + input.message.room.name;
        //str+= "\n- isBonfire: " + Rooms.isBonfire(input.message.room.name);
        //str += "\n- wikiHints: " + bf.wikiHints.length;
        //str += "\n- description: " + bf.description.length;
        return str;
    },


    bonfireHeader: function (bonfire) {

        var str = "## :fire:";
        str += TextLib.mdLink(
            bonfire.name,
            "www.freecodecamp.com/challenges/" + bonfire.dashedName
        );
        str += " :link:";
        return str;
    },

    bonfireDetails: function (bonfire) {
        var name = bonfire.dashedName;

        var str = this.bonfireHeader(bonfire);
        str += newline + this.bonfireScript(bonfire);
        str += newline + this.bonfireDescription(bonfire);
        str += newline + this.bonfireLinks(bonfire);
        //str += newline + '\n-----\n';
        //str += newline + this.fixed.menu;
        //str += newline + this.fixed.roomLink(name)

        return str;
    },

    bonfireDescription: function (bonfire, lines) {
        if (lines) {
            var desc = bonfire.description.slice(0, lines);
            return desc.join('\n');
        } else {
            desc = bonfire.description[0];
            return desc;
        }
    },

    bonfireLinks: function (bonfire) {
        return Bonfires.getLinks(bonfire);
    },

    bonfireScript: function (bonfire) {
        return Bonfires.getSeed(bonfire);
    },

    bonfireWiki: function (bonfire) {
        var link = Utils.linkify(this.currentBonfire.name)
        return "> :fire: wiki: " + link;
    }

};

// ideally KBase should be loaded first,
// though in theory it will load itself before data is needed ...?

Bonfires.load();

Bonfires.allDashedNames().map(function(bf) {
    console.log(bf);
})

module.exports = Bonfires;

