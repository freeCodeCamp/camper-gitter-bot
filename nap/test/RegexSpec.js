var expect = require('chai').expect;
var assert = require("chai").assert;

var AppConfig = require("../config/AppConfig"),
    Utils = require('../lib/utils/Utils');

describe("Regex", function(){
    var str, res;

    it("should find thanks", function() {
        str = "thanks @bob"
        res = str.match(/^(thanks|ty|thank you) \@(.*)/i)
        if (res != null) console.log("res true", res )
        var test = assert.isNotNull(res, true, JSON.stringify(res) );
    })


    it("should linkify", function() {
        str = "some-page"
        var link = Utils.linkify(str, 'wiki')
        var uri = AppConfig.wikiHost + str
        var res = `[${str}](${uri})`;
        // res = str.indexOf(link, res)
        // assert.equal(res, link);
        expect(res).to.equal(link);
    })


});

