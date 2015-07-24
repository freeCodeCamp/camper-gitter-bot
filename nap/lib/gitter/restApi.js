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
AppConfig = {
    token: "c082087ee20ec81ae6b29e89cd0cafe523076e58",
    roomId: "55b1a9030fc9f982beaac901",
    user: {
        id: '535b4f90fe5536b46433d746'
    }
}


// Gitter API client helper
var gitter = {

    stashToken: function(token) {
        if (token) {
            AppConfig.token = token;
        } else {
            console.error("tried to stash null token:", token);
        }
        console.log("stashToken AppConfig:", AppConfig);
        token = token || AppConfig.token;
        return (token);
    },

    checkUser: function(user) {
        if (user == '[') {
            console.error("WTF user is [")
            user = AppConfig.user;
        }
        return(user);
    },

    fetch: function(path, token, cb, opts) {
        token = token || AppConfig.token;
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
        // FIXME
        user = this.checkUser(user);
        token = this.stashToken(token);
        this.fetch('/api/v1/user/' + user.id + '/rooms', token, function(err, rooms) {
            console.log("rooms", rooms);
            cb(err, rooms);
        });
    },

    postMessage: function(text, roomId) {
        token = this.stashToken();
        roomId = roomId || AppConfig.roomId;
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