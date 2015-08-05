"use strict";

require('dotenv').load();

var expect = require("chai").expect;

var HttpWrap = require("../lib/utils/HttpWrap.js"),
    Utils = require("../lib/utils/Utils"),
    TestHelper = require("./TestHelper");

function clog(msg, obj) {
    Utils.warn("HttpWrapSpec>", msg, obj);
}


// "no-unused-expressions": [0]

// var showInfo = function(input, bot, blob) {
//     clog("showInfo", blob);
//     expect(blob.about.username).to.equal("berkeleytrueX");
// };


describe("HttpWrap", function () {

    it("should load user info", function(done) {
        // var input = TestHelper.stubInput;
        // var bot = "dummyBot";
        var name = "berkeleytrue";
        var apiPath = '/api/users/about?username=' + name;
        var options = {method: 'GET'};

        HttpWrap.callApi(apiPath, options, function(apiResult) {
            console.log(apiResult);
            expect(apiResult.response.about.username).to.equal("berkeleytrue");
            expect(apiResult.response.about.github).to.equal("http://github.com/BerkeleyTrue");
            // expect(apiResult.about.bio).to.include("something");
            done();
        });

    });

});

