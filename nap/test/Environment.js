"use strict";

var expect = require("chai").expect,
    assert = require("chai").assert;

describe("Environment", function(){
    it("should be running ES6", function() {

        var check = typeof(Map);
        if ('function' !== check) {
            var version = process.versions,
                msg = "ES6 is required; add --harmony";
            console.log(version);
            console.error(msg);
            assert.equal(check, 'function', "not running ES6");
        }

        // node -p process.versions.v8 3.28.71.19

    })
});