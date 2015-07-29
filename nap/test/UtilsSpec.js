"use strict";

var expect = require('chai').expect,
    assert = require("chai").assert;

var Utils = require('../lib/utils/Utils');

describe("Utils", function (){

    it("should sanitize file name strings", function() {
        var str = "something-awful?.md";
        var str2 = Utils.sanitize(str);
        assert.equal(str2, "something-awful");
    });

    it("not remove spaces", function() {
        var str = "thanks bob";
        str = Utils.sanitize(str, {spaces: false});
        assert.equal(str, "thanks bob");
    });

    it("change spaces to dashes", function() {
        var str = "thanks for that";
        str = Utils.sanitize(str, {spaces: true});
        assert.equal(str, "thanks-for-that");
    });


    it("should split params", function() {
        var res = Utils.splitParams("search for food");
        expect(res.params).to.equal("for food");
        expect(res.keyword).to.equal("search");
    });


});

