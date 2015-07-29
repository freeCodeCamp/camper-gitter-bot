"use strict";

var yaml = require('js-yaml');
var fs = require('fs');

var Utils = require('../../lib/utils/Utils'),
    InputWrap = require('../../lib/bot/InputWrap');

var newline = '\n';

var Bonfires = {
    data: null,

    load: function() {
        if (this.data) {
            return this.data;
        }
        // Get document, or throw exception on error
        try {
            this.data = yaml.safeLoad(fs.readFileSync('./data/bonfires/basic-bonfires.yml', 'utf8'));
        } catch (e) {
            Utils.error("can't load bonfire data", e);
        }
        return this;  // chainable
    },

    allDashedNames: function() {
        return this.fieldList('dashedName');
    },

    allNames: function() {
        return this.fieldList('name');
    },

    fieldList: function(field) {
        var list = this.data.challenges.map(function(item) {
            // console.log(item);
            // console.log('-----------');
            return item[field];
        });
        return list;
    },

    findBonfire: function(bfName) {
        var bfs = this.data.challenges.filter(function (item) {
            return (item.dashedName === bfName);
        });
        var bf = bfs[0];
        Utils.checkNotNull(bf, `cant find bonfire for ${bfName}`);
        return bf;
    },

    fromInput: function(input) {
        var roomName, bf;
        roomName = InputWrap.roomShortName(input);
        bf = this.findBonfire(roomName);
        Utils.checkNotNull(bf, `cant find bonfire for ${roomName}`);
        return (bf);
    },

    getHint: function(input, num) {
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

    getLinksFromInput: function(input) {
        var output, bf, roomName;
        roomName = InputWrap.roomShortName(input);
        bf = Bonfires.fromInput(input);

        if (!bf || !bf.MDNlinks) {
            var msg = ("no links found for: " + input.params);
            Utils.error("Bonfires>", msg, bf);
            return msg;
        }

        // console.log(bf)
        // return bf.MDNlinks;

        output = "links for " + roomName + newline;
        output += Utils.makeUrlList(bf.MDNlinks, 'mdn');
        return output;
    },

    getChallengeSeedFromInput: function(input) {
        var output, bf, roomName, seed;
        roomName = InputWrap.roomShortName(input);
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

Bonfires.load();

module.exports = Bonfires;

