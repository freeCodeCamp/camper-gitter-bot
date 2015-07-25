var expect = require("chai").expect,
    assert = require("chai").assert;

var Bot = require("../lib/bot/Bot.js");

describe("Bot", function(){

    it("should have a name", function() {
        assert.equal(Bot.getName(), "bothelp");
    })

});