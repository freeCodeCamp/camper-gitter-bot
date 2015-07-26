"use strict";

// var chai = require("chai");
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);

var assert = require("chai").assert,
    should = require("chai").should();

var Utils = require('../lib/utils/Utils'),
    KBase = require("../lib/bot/KBase.js");

function clog(msg, obj) {
    Utils.clog("KbaseSpec>", msg, obj)
}


describe("KBase", function() {

    it("should have a bootstrap entry", function() {
        var promise = KBase.initAsync();
        promise.then(function(res) {
            var topic = KBase.getTopic("bootstrap");
            // clog("KB.then topic=", topic);
            // clog("KB.then res=", res);
            assert.equal(topic.name, "bootstrap");
        })
    });

});




    // it("should have a bootstrap entry", function() {
    //     // KBase.init();
    //     function cb() {
    //         clog("cb check")
    //         var topic = KBase.getTopic("bootstrap");
    //         assert.equal(topic.name, "bootstrap");            
    //     }

    //     // Promise.resolve().should.eventually.equal("doneX");
    //     var promise = new Promise(function(resolve, reject) {
    //         res = KBase.init(function(res) {
    //             clog("res", res);
    //             if (res=="ok") {
    //                 resolve("Stuff worked!");
    //             }
    //             else {
    //                 reject(Error("It broke"));
    //             }
    //         });
    //     });

    // })
