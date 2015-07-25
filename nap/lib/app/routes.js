"use strict";

var assert = require("chai").assert;

// FIXME - this seems a bit hacky? 
// should be a passed in object?
// but needed for tests too so want this class self contained

var AppConfig = require('../../config/AppConfig'),
    Rooms = require('../../lib/app/Rooms.js');

var routes = {

    // query can include a room or a topic
    findRedirect: function(query) {
        assert.isObject(query);

        var room, url, topic, org = AppConfig.org;

        if (query.topic) {
            room = Rooms.findByTopic(query.topic);
        }

        if (query.room) {
            room = Rooms.findByName(query.room);
        }

        assert.isObject(room);

        var url = "https://gitter.im/" + org + "/" + room.title;
        var redir = {
            room: room,
            topic: query.topic,   // could be null
            org: org,
            url: url
        }
        return redir;
    },

    init: function(app, bot) {
        var that = this;
        app.get('/test', function(req, res) {
            res.send("test");
        });

        // http://localhost:7000/in?topic=FreeCodecamp
        app.get("/go", function(req, res) {
            // console.log(req);
            var topic = req.query.topic,
                room  = req.query.room,
                redir = that.findRedirect(req.query);

            bot.say("----");
            bot.say("topic: **" + topic + "**");
            res.redirect(redir.url);

        })

        app.get('/rooms', function(req, res) {
            // console.log("that", that);
            res.render('rooms', {
                user: req.user,
                token: req.session.token,
                rooms: Rooms.list()
            });
        })
    }

}

module.exports = routes;