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
        query.org = AppConfig.getOrg();

        if (query.topic) {
            query.roomObj = Rooms.findByTopic(query.topic);
        }
        if (query.room) {
            query.roomObj = Rooms.findByName(query.room);
        }
        assert.isObject(query.roomObj);

        query.url = "https://gitter.im/" + query.org + "/" + query.roomObj.title;
        return query;
    },

    init: function(app, bot, gitter, passport) {
        var that = this;
        app.get('/test', function(req, res) {
            res.send("test");
        });

        // http://localhost:7000/in?topic=FreeCodecamp
        app.get("/go", function(req, res) {
            // console.log(req);
            var topic = req.query.topic,
                room = req.query.room,
                redir = that.findRedirect(req.query);

            bot.announce(redir)

            bot.say("----");
            bot.say("topic: **" + topic + "**");
            res.redirect(redir.url);

        });

        app.get('/rooms', function(req, res) {
            // console.log("that", that);
            res.render('rooms', {
                user: req.user,
                who: AppConfig.who(req),
                token: req.session.token,
                rooms: Rooms.list()
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
                token: req.session.token,
                rooms: []
            });

        });

        // list rooms based on api key
        // Fetch user rooms using the Gitter API
        app.get('rooms/mine', function(req, res) {            
            gitter.fetchRooms(req.user, req.session.token, function(err, rooms) {
                if (err) return res.send(500);
                res.render('home', {
                    user: req.user,
                    token: req.session.token,
                    clientId: clientId,
                    rooms: rooms
                });
            });
        })


    }

}

module.exports = routes;