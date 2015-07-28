var expect = require('chai').expect,
    assert = require("chai").assert;

var AppConfig = require("../config/AppConfig"),
    Utils = require('../lib/utils/Utils');

describe("Utils", function(){
    var str, res

    it("should sanitize file name strings", function() {
        str = "something-awful?.md"
        var str2 = Utils.sanitize(str)
        assert.equal(str2, "something-awful");
    })

    it("not remove spaces", function() {
        str = "thanks bob"
        str = Utils.sanitize(str, {spaces: false})
        assert.equal(str, "thanks bob");
    })

    it("change spaces to dashes", function() {
        str = "thanks for that"
        str = Utils.sanitize(str, {spaces: true})
        assert.equal(str, "thanks-for-that");
    })


    it("should split params", function() {
        var input = {text: "search for food"}
        var res = Utils.splitParams(input)
        expect(res.params).to.equal("for food")
        expect(res.command).to.equal("search")
        expect(res.text).to.equal("search for food")
    })


});