'use strict';

const gitterHost = process.env.HOST || 'https://gitter.im',
      _ = require('underscore'),
      request = require('request'),
      AppConfig = require('../../../config/AppConfig');

function handleCallback(err) {
  if (err) {
    console.error('ERROR \n');
  }
}

// Gitter API client helper
const gitter = {
  stashToken: function(token) {
    if (token) {
      AppConfig.token = token;
    } else {
      console.error('tried to stash null token:', token);
    }
    console.log('stashToken AppConfig:', AppConfig);
    token = token || AppConfig.token;
    return token;
  },

  checkUser: function(user) {
    if (user === '[') {
      console.error('WTF user is [');
      user = AppConfig.user;
    }
    return user;
  },

  fetch: function(path, token, cb, opts) {
    token = token || AppConfig.token;
    const options = {
      url: gitterHost + path,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };

    opts = opts || {};
    // opts takes priority
    _.extend(options, opts);

    request(options, (err, res, body) => {
      if (err) { return cb(err); }

      if (res.statusCode === 200) {
        cb(null, body);
      } else {
        cb('err ' + res.statusCode);
      }
    });
  },

  fetchCurrentUser: function(token, cb) {
    this.fetch('/api/v1/user/', token, (err, user) => {
      cb(err, user[0]);
    });
  },

  fetchRooms: function(user, token, cb) {
    // TODO - FIXME
    user = this.checkUser(user);
    token = this.stashToken(token);
    this.fetch('/api/v1/user/' + user.id + '/rooms', token, (err, rooms) => {
      cb(err, rooms);
    });
  },

  postMessage: function(text, roomId) {
    const token = this.stashToken();
    roomId = roomId || AppConfig.roomId;
    const data = { 'text': text };
    const opts = {
      method: 'POST',
      // body: JSON.stringify(data),
      body: data,
      json: true
    };

    this.fetch(
      '/api/v1/rooms/' + roomId + '/chatMessages',
      token,
      handleCallback,
      opts
    );
  }
};


gitter.currentUser().then(user => {
  console.log('---- You are logged in as:', user.username);
});


module.exports = gitter;
