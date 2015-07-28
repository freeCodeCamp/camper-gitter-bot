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

});