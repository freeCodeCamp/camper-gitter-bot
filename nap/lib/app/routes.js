"use strict";

var assert = require("chai").assert;

// FIXME - this seems a bit hacky? 
// should be a passed in object?
// but needed for tests too so want this class self contained

var AppConfig = require('../../config/AppConfig'),
    Rooms = require('../../lib/app/Rooms.js'),
    Utils = require('../../lib/utils/Utils'),
    RoomData = require('../../data/RoomData.js');

function clog(msg, obj) {
    Utils.clog("Routes>", msg, obj)
}


var Router = {

    // query can include a room or a topic
    findRedirect: function(query) {
        assert.isObject(query);
        query.org = AppConfig.getOrg();

        if (query.topic) {
            query.roomObj = Rooms.findByTopic(query.topic);
        } else if (query.room) {
            query.roomObj = Rooms.findByName(query.room);
        }
        // clog("found ", query.roomObj);
        assert.isObject(query.roomObj);

        query.url = "https://gitter.im/" + query.roomObj.name;
        return query;
    },

    init: function(app, gbot, passport) {
        Router.gbot = gbot;
        var that = this;
        app.get('/test', function(req, res) {
            res.send("test");
        });

        // http://localhost:7000/in?topic=FreeCodecamp
        app.get("/go", function(req, res) {
            // console.log(req);
            var topic = req.query.topic,
                room  = req.query.room,
                who   = AppConfig.who(req),
                redir = that.findRedirect(req.query);

            gbot.announce(redir)
            res.redirect(redir.url);

        });

        app.get('/rooms', function(req, res) {
            // console.log("that", that);
            res.render('rooms', {
                user: req.user,
                who: AppConfig.who(req),
                token: req.session.token,
                rooms: RoomData
            });
        });

        app.get('/login', passport.authenticate('oauth2'));

        app.get('/login/callback',
            passport.authenticate('oauth2', {
                successRedirect: '/home',
                failureRedirect: '/'
            })
        );

        app.get('/logout', function(req, res) {
            req.session.destroy();
            res.redirect('/');
        });

        app.get('/', function(req, res) {
            res.render('landing');
        });

        // after login home show token
        app.get('/home', function(req, res) {
            if (!req.user) return res.redirect('/');

            res.render('home', {
                user: req.user,
                sessionToken: req.session.token,
                rooms: []
            });

        });

        app.get('/rooms/update', function(req, res) {
            var rooms = Router.gbot.updateRooms();
            res.send("rooms:" + rooms);
        })

    }

}

module.exports = Router;