"use strict"

var expect = require('chai').expect;
var assert = require("chai").assert;

var AppConfig = require("../config/AppConfig"),
    Utils = require('../lib/utils/Utils');

describe("Regex", function(){

    it("should find thanks", function() {
        var str = "thanks @bob"
        var res = str.match(/^(thanks|ty|thank you) \@(.*)/i)
        if (res != null) console.log("res true", res )
        var test = assert.isNotNull(res, true, JSON.stringify(res) );
    })


    it("should linkify", function() {
        var str = "some-page"
        var link = Utils.linkify(str, 'wiki')
        var uri = AppConfig.wikiHost + str
        var res = `[some page](${uri})`;
        // res = str.indexOf(link, res)
        // assert.equal(res, link);
        expect(res).to.equal(link);
    })


    it("should namify", function() {
        var str = "some-page-here";
        var name = Utils.namify(str)
        expect(name).to.equal("some page here");
    })

});

