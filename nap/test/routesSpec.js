"use strict";

require('dotenv').load();

var expect = require("chai").expect;
var assert = require("chai").assert;
var routes = require("../lib/app/routes.js");
var AppConfig = require("../config/AppConfig");

describe("Routes", function(){

    it("should use room from params for route redir", function() {
        var query = {room: "random"};
        var redir = routes.findRedirect(query);
        assert.property(redir, 'room', 'redir has a room');
        assert.property(redir, 'org', 'route has an org');
        assert.property(redir, 'url', 'route has a url');

        var url = "https://gitter.im/" + query.room;

        assert.equal(redir.url, url);
    })



    it("should find DM room go URI", function() {
        var query = {room: "bothelp"};
        var redir = routes.findRedirect(query);
        assert.property(redir, 'room', 'redir has a room');
        assert.property(redir, 'url', 'route has a url');

        var url = "https://gitter.im/" + query.room;

        assert.equal(redir.url, url);
    })

    // it("should find route for a default room", function() {
    //     var topic = topics.findRoom("blah");
    //     expect(topic.room).to.equal("default room");
    // })

});