require('dotenv').load();

"use strict";

var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2');

var gitterHost = process.env.HOST || 'https://gitter.im';
var clientId = process.env.GITTER_APP_KEY;
var clientSecret = process.env.GITTER_APP_SECRET;

var request = require('request');
var express = require('express');

var GitterHelper = require('./GitterHelper');

var opts = {
    authorizationURL: gitterHost + '/login/oauth/authorize',
    tokenURL: gitterHost + '/login/oauth/token',
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: '/login/callback',
    passReqToCallback: true
}

// console.log("oauth opts", opts);

passport.use(new OAuth2Strategy( 
    opts,
    function(req, accessToken, refreshToken, profile, done) {
        console.log("set access token", accessToken);
        req.session.token = accessToken;
        GitterHelper.fetchCurrentUser(accessToken, function(err, user) {
            return (err ? done(err) : done(null, user));
        });
    }
));

passport.serializeUser(function(user, done) {
    // console.log("serializeUser", user);
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, done) {
    // console.log("deserializeUser", user);
    done(null, JSON.parse(user));
});


// list rooms based on api key
// Fetch user rooms using the Gitter helper
// passport.fetchRooms = function() {
//     GitterHelper.fetchRooms(req.user, req.session.token, function(err, rooms) {
//         if (err) return res.send(500);
//         res.render('home', {
//             user: req.user,
//             sessionToken: req.session.token,
//             clientId: clientId,
//             rooms: rooms
//         });
//     });
// })



module.exports = passport;
