var gitterHost = process.env.HOST || 'https://gitter.im';

var _ = require("underscore");
var request = require('request');

function handleCallback(err, res) {
    if (err) {
        console.error("ERROR \n");
        // console.error(res);
    }
}

// FIXME - this gets overwritten when the web app logs in
ApiConfig = {
    token: "c082087ee20ec81ae6b29e89cd0cafe523076e58",
    roomId: "55b1a9030fc9f982beaac901"
}


// Gitter API client helper
var gitter = {

    stashToken: function(token) {
        if (token) {
            ApiConfig.token = token;
        } else {
            console.error("tried to stash null token");
        }
        console.log("stashToken ApiConfig:", ApiConfig);
    },

    fetch: function(path, token, cb, opts) {
        var options = {
            url: gitterHost + path,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        opts = opts || {};
        _.extend(options, opts); // opts takes priority
        console.log('fetch.options\n', options)

        request(options, function(err, res, body) {
            if (err) return cb(err);

            if (res.statusCode === 200) {
                cb(null, body);
            } else {
                cb('err ' + res.statusCode);
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

    postMessage: function(text, roomId) {
        token = ApiConfig.token;
        roomId = roomId || ApiConfig.roomId;
        data = { "text": text }
        opts = {
            method: 'POST',
            // body: JSON.stringify(data),
            body: data,
            json: true
        }

        this.fetch(
            '/api/v1/rooms/' + roomId + '/chatMessages',
            token,
            handleCallback,
            opts
        )

    }

};


module.exports = gitter;