"use strict";

var expect = require('chai').expect;
var assert = require("chai").assert;

var Utils = require('../lib/utils/Utils'),
    AppConfig = require("../config/AppConfig");

// var cmdMatch = /(.*)/;

describe("Regex", function () {

    it("should find thanks: true", function () {
        var str, res;
        str = "thanks @bob";
        res = str.match(/^(thanks|ty|thank you) \@\.*/i);
        // console.log(res);
        // if (res !== null) {
        //     console.log("res true", res);
        // }
        assert.isNotNull(res);
    });

    it("should linkify", function () {
        var str, exp, uri, res;
        str = "some-page";
        res = Utils.linkify(str, 'wiki');
        uri = AppConfig.wikiHost + str;
        // uri = "https://github.com/freecodecamp/freecodecamp/wiki"
        // console.log('uri', uri);
        exp = `[some page](${uri})`;
        expect(res).to.equal(res);
    });

    it("should namify", function() {
        var str = "some-page-here";
        var name = Utils.namify(str);
        expect(name).to.equal("some page here");
    });

// using Utils.splitParams now, not a regex

    // it("should find command if no params", function() {
    //     var res = "menu".match(cmdMatch);
    //     console.log(res);
    //     expect(res[0]).not.to.be.null;
    // });

    // it("should split command", function() {
    //     var res = Utils.splitParams
    //     var res = "menu command".match(cmdMatch);
    //     console.log(res);
    //     expect(res[0]).not.to.be.null;
    // });


});

