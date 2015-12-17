'use strict';

const gitterHost = process.env.HOST || 'https://gitter.im',
      AppConfig = require('../../config/AppConfig'),
      Utils = require('../../lib/utils/Utils'),
      request = require('request'),
      _ = require('lodash');

// Gitter API client helper
const GitterHelper = {

  roomDataCache: {},

  fetch: function(path, callback, options) {
    options = options || {};

    const defaultOptions = {
      uri: gitterHost + '/api/v1' + path,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + AppConfig.token
      }
    };
    // opts takes priority
    _.extend(defaultOptions, options);

    request(defaultOptions, (err, res, body) => {
      if (err) {
        Utils.error('GitterHelper.fetch', err);
        Utils.error('GitterHelper.fetch.options', defaultOptions);
        return callback(err);
      }
      /* eslint-disable consistent-return */
      if (!callback) { return; }
      /* eslint-enable consistent-return */

      if (res.statusCode === 200) {
        let data;
        // TODO - FIXME sometimes we get JSON back (from POST requests)
        // sometimes we just get a string
        if (typeof body === 'string') {
          data = JSON.parse(body);
        } else {
          // hope its json!
          data = body;
        }
        return callback(null, data);
      } else {
        Utils.warn('GitterHelper', 'non 200 response from', defaultOptions);
        Utils.warn('GitterHelper', 'body', body);
        return callback('err' + res.statusCode);
      }
    });
  },

  postMessage: function(text, roomId, callback, opts) {
    const data = { 'text': text };
    opts = {
      method: 'POST',
      body: data,
      json: true
    };

    this.fetch(
      '/rooms/' + roomId + '/chatMessages',
      callback,
      opts
    );
  },

  fetchCurrentUser: function(token, cb) {
    this.fetch('/user/', (err, user) => {
      cb(err, user[0]);
    });
  },

  // TODO - refactor not to take a token on each req
  fetchRooms: function(user, token, cb) {
    this.fetch('/user/' + user.id + '/rooms', (err, rooms) => {
      cb(err, rooms);
    });
  },

  findRoomByName: function(roomUri, callback, cbParams) {
    cbParams = cbParams || {};

    // avoid doing rest calls if we're posting to a known room
    const cached = GitterHelper.roomDataCache[roomUri];
    if (cached) {
      cbParams.gitterRoom = cached;
      return callback(cbParams);
    } else {
      this.fetch('/rooms', (err, rooms) => {
        if (err) {
          return callback(err);
        }
        if (!rooms) {
          Utils.error('can\'t find rooms with roomUri', roomUri);
          /* eslint-disable consistent-return */
          return;
          /* eslint-enable consistent-return */
        }
        const roomList = rooms.filter(rm => {
          return rm.uri === roomUri;
        });
        if (roomList.length > 0) {
          const room = roomList[0];
          GitterHelper.roomDataCache[roomUri] = room;
          cbParams.gitterRoom = room;
          return callback(cbParams);
        }
      });
    }
  },

  responseCallback: function() {
    Utils.clog('GitterHelper.response callback');
  },

  sayToRoomObj: function(text, opts) {
    GitterHelper.postMessage(text, opts.id);
  },

  sayToRoomName: function(text, roomUri) {
    GitterHelper.findRoomByName(roomUri, opts => {
      GitterHelper.sayToRoomObj(text, opts.gitterRoom);
    });
  }
};


module.exports = GitterHelper;
