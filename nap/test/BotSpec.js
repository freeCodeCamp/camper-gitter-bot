var expect = require("chai").expect,
    assert = require("chai").assert;

var GBot = require("../lib/bot/GBot.js");

describe("GBot", function(){

    it("should have a name", function() {
        assert.equal(GBot.getName(), "bothelp");
    })

});