"use strict";

// var assert = require("chai").assert;

// FIXME - this seems a bit hacky?
// should be a passed in object?
// but needed for tests too so want this class self contained

var AppConfig = require('../../config/AppConfig'),
    Rooms = require('../../lib/app/Rooms.js'),
    Utils = require('../../lib/utils/Utils'),
    Bonfires = require('./Bonfires'),
    RoomData = require('../../data/RoomData');

var GitterHelper = require('../../lib/gitter/GitterHelper');

function clog(msg, obj) {
    Utils.clog("Routes>", msg, obj);
}


var Router = {

    // query can include a room or a topic
    findRedirect: function(query) {
        Utils.isObject(query);
        query.org = AppConfig.getOrg();

        if(query.dm === 'y') {
            query.room = query.room || AppConfig.getBotName();
        }

        if (query.room) {
            // need to make a roomObj for other handling
            query.roomObj = {
                title: query.room,
                name: query.room
            };
        } else if (query.topic) {
            query.roomObj = Rooms.findByTopic(query.topic);
        }
        Utils.isObject(query.roomObj, "could not find room object");
        query.url = "https://gitter.im/" + query.roomObj.name;
        clog('findRedirect:', query);
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
                room = req.query.room,
                who = AppConfig.who(req),
                redir = that.findRedirect(req.query);

            gbot.announce(redir);
            res.redirect(redir.url);

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
        app.get('/home2', function(req, res) {
            if (!req.user) return res.redirect('/');

            res.render('home', {
                user: req.user,
                sessionToken: req.session.token,
                rooms: []
            });

        });


        app.get('/rooms', function(req, res) {
            console.log("req.user", req.user);

            var rooms = RoomData.rooms('camperbot').filter( function(rm) {
                return rm.isBonfire;
            });
            console.log(rooms);

            res.render('rooms', {
                user: req.user,
                who: AppConfig.who(req),
                token: req.session.token,
                rooms: rooms,
                bonfires: Bonfires.data.challenges,
                topicDmUri: AppConfig.topicDmUri()
            });
        });

        app.get('/rooms/update', function(req, res) {
            Router.gbot.scanRooms(req.user, req.session.token);
            res.redirect('/home');
        });


        app.get('/home', function(req, res) {
            if (!req.user) return res.redirect('/');

            GitterHelper.fetchRooms(req.user, req.session.token, function(err, rooms) {
                if (err) return res.send(500);
                // clog("rooms", rooms);
                var blob = {
                    user: req.user,
                    token: req.session.token,
                    rooms: rooms,
                    topicDmUri: AppConfig.topicDmUri()
                };
                clog("rooms.blob", blob);
                res.render('home', blob);
            });
        });


    }
};

module.exports = Router;


