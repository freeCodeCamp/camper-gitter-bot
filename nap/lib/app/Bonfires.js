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
        hintWarning: "## :construction: ** After this are possible spoiler hints.**\nMake sure you've tried to hard to solve it yourself before proceeding. :construction:"
    },

    load: function () {
        if (this.data) {
            return this.data;
        }
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


    getNextHint: function (bonfire) {
        var hint, hintNum;
        hintNum = bonfire.currentHint || 0;
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
            return "no more hints! Let's start again:" + hintNum;
        }
    },

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


    fromInput: function (input) {
        var roomName, bf;
        roomName = InputWrap.roomShortName(input);
        bf = this.findBonfire(roomName);
        Utils.checkNotNull(bf, 'cant find bonfire for ' + roomName );
        return (bf);
    },

    wikiLinkFooter: function(bonfire) {
        var str = "\n\n> type `more` for next hint  :pencil: ";
        var text = "[Contribute at the FCC Wiki]";
        str += Utils.linkify(bonfire.dashedName, "wiki", text);

        return str;
    },


    getDescription: function (bonfire) {
        var desc = bonfire.description.join('\n');
        return desc;
    },

    // from input
    getHintNum: function (input, num) {
        num = num || 0;
        var output, bf, roomName;
        roomName = InputWrap.roomShortName(input);
        bf = this.findBonfire(roomName);

        if (!bf || !bf.description) {
            var msg = ("no outputs found for: " + roomName);
            Utils.error("Bonfires>", msg, bf);
            return msg;
        }

        output = "hint for " + roomName + newline;
        output += (bf.description[0]);
        return output;
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
    }


};

// ideally KBase should be loaded first,
// though in theory it will load itself before data is needed ...?

Bonfires.load();

module.exports = Bonfires;

