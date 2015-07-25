var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2');

var gitterHost = process.env.HOST || 'https://gitter.im';
var clientId = process.env.GITTER_KEY;
var clientSecret = process.env.GITTER_SECRET;

var request = require('request');
var express = require('express');


// Gitter API client helper
var gitterHelper = {
    fetch: function(path, token, cb) {
        var options = {
            url: gitterHost + path,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        request(options, function(err, res, body) {
            if (err) return cb(err);

            if (res.statusCode === 200) {
                cb(null, JSON.parse(body));
            } else {
                cb('err' + res.statusCode);
            }
        });
    },

    fetchCurrentUser: function(token, cb) {
        this.fetch('/api/v1/user/', token, function(err, user) {
            cb(err, user[0]);
        });
    },

    fetchRooms: function(user, token, cb) {
        this.fetch('/api/v1/user/' + user.id + '/rooms', token, function(err, rooms) {
            cb(err, rooms);
        });
    }
};


passport.use(new OAuth2Strategy({
        authorizationURL: gitterHost + '/login/oauth/authorize',
        tokenURL: gitterHost + '/login/oauth/token',
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: '/login/callback',
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
        console.log("set access token", accessToken);
        req.session.token = accessToken;
        gitterHelper.fetchCurrentUser(accessToken, function(err, user) {
            return (err ? done(err) : done(null, user));
        });
    }
));

passport.serializeUser(function(user, done) {
    console.log("serializeUser", user);
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, done) {
    console.log("deserializeUser", user);
    done(null, JSON.parse(user));
});


module.exports = passport;