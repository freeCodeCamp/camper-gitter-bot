"use strict";

var gitterHost = process.env.HOST || 'https://gitter.im';
var request = require('request');

// Gitter API client helper
var GitterHelper = {
    fetch: function(path, token, cb) {
        var options = {
            url: gitterHost + path,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        request(options, function(err, res, body) {
            if (err) {return cb(err); }

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
    },

    getMessageHistory: function (room, cb) {
        
    }

};




module.exports = GitterHelper;

