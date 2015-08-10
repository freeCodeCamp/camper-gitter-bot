"use strict";

require('dotenv').config({path: 'dot.env'});


var expect = require("chai").expect;

//this should go before other stuff
var    GBot  = require("../lib/bot/GBot");
var    Utils = require("../lib/utils/Utils");
var    GitterHelper = require("../lib/gitter/GitterHelper");
var    Utils = require("../lib/utils/Utils");

var TestHelper = require('./TestHelper');


var TEST_ROOM_NAME = "camperbot/localdev";

describe("GitterHelper", function() {

    /*
    it("should find a room by name", function (done) {
        var foundRoom = function(blob) {
            //Utils.tlog("foundRoom", blob);
            var foundRoomName = blob.gitterRoom.uri.toLowerCase();
            expect(foundRoomName).to.equal(TEST_ROOM_NAME);
            done();
        }
        var name = GitterHelper.findRoomByName(TEST_ROOM_NAME, foundRoom);
    });


    it("should store room info in the cache", function (done) {
        var foundRoom = function(blob) {
            //Utils.tlog("foundRoom", blob);
            //expect(blob.gitterRoom.uri).to.equal(TEST_ROOM_NAME);
            //Utils.tlog("cache", GitterHelper.roomDataCache);
            var cachedRoom = GitterHelper.roomDataCache[TEST_ROOM_NAME];
            expect(cachedRoom.uri).to.equal(TEST_ROOM_NAME);
            done();
        }
        var name = GitterHelper.findRoomByName(TEST_ROOM_NAME, foundRoom);
    });

    */

    it("should send a message to a named room", function () {
        var name = GitterHelper.sayToRoomName("autotest", TEST_ROOM_NAME);
    });


});