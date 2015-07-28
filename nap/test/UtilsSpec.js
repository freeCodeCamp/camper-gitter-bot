var assert = require("chai").assert;

var AppConfig = require("../config/AppConfig"),
    Utils = require('../lib/utils/Utils');

describe("Utils", function(){

    it("should sanitize file name strings", function() {
        var str = "something-awful?.md"
        Utils.sanitize(str)
        assert.equal(str, "something-awful");
    })

});