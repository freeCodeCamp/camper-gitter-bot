"use strict";

var gitterHost = process.env.HOST || 'https://gitter.im';
var AppConfig = require("../../config/AppConfig");
var Utils = require("../../lib/utils/Utils");

var request = require('request');
var _ = require('lodash-node');

// Gitter API client helper
var GitterHelper = {

    roomDataCache: {},

    fetch: function(path, callback, options) {
        options = options || {};

        var defaultOptions = {
            uri: gitterHost + '/api/v1' + path,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + AppConfig.token
            }
        };

        _.extend(defaultOptions, options); // opts takes priority

        request(defaultOptions, function(err, res, body) {
            if (err) {
                Utils.error("GitterHelper.fetch", err);
                Utils.error("GitterHelper.fetch.options", defaultOptions);
                return callback(err);
            }

            if (callback == null) return;

            if (res.statusCode === 200) {
                var data;
                // FIXME - sometimes we get JSON back (from POST requests)
                // sometimes we just get a string
                if (typeof body == 'string') {
                    //Utils.tlog("got a string for req", defaultOptions.uri);
                    data = JSON.parse(body);
                } else {
                    // hope its json!
                    data = body;
                }
                return callback(null, data);
            } else {
                Utils.warn("GitterHelper", "non 200 response from", defaultOptions);
                //var body = JSON.parse(body);
                Utils.warn("GitterHelper", "body", body);
                return callback('err' + res.statusCode);
            }
        });
    },

    postMessage: function(text, roomId, callback, opts) {
        var data = { "text": text };
        opts = {
            method: 'POST',
            // body: JSON.stringify(data),
            body: data,
            json: true
        }

        //Utils.tlog("postMessage", text, roomId);

        this.fetch(
            '/rooms/' + roomId + '/chatMessages',
            callback,
            opts
        )

    },

    fetchCurrentUser: function(token, cb) {
        this.fetch('/user/', function(err, user) {
            cb(err, user[0]);
        });
    },

    //TODO - refactor not to take a token on each req
    fetchRooms: function(user, token, cb) {
        this.fetch('/user/' + user.id + '/rooms', function(err, rooms) {
            cb(err, rooms);
        });
    },

    getMessageHistory: function (room, cb) {
        // TODO
    },

    findRoomByName: function(roomUri, callback, cbParams) {
        cbParams = cbParams || {};
        var roomObj, cached;

        // avoid doing rest calls if we're posting to a known room
        cached = GitterHelper.roomDataCache[roomUri];
        if (cached != null) {
            //Utils.tlog("return from cached:", cbParams);
            cbParams.gitterRoom = cached;
            return callback(cbParams);
        } else {

            this.fetch('/rooms', function (err, rooms) {
                //Utils.tlog("found rooms", rooms);
                if (!rooms) {
                    Utils.error("can't find rooms with roomUri", roomUri);
                    return;
                }
                var roomList = rooms.filter(function (rm) {
                    return rm.uri == roomUri;
                })
                if (roomList.length > 0) {
                    var room = roomList[0];
                    GitterHelper.roomDataCache[roomUri] = room;
                    cbParams.gitterRoom = room;
                    return callback(cbParams);
                }
            })
        }
    },

    responseCallback: function(obj) {
        Utils.clog("GitterHelper.response callback");
    },

    sayToRoomObj: function(text, opts) {
        //Utils.tlog("sayToRoomObj>", text, opts);
        GitterHelper.postMessage(text, opts.id);
    },

    sayToRoomName: function(text, roomUri) {
        GitterHelper.findRoomByName(roomUri, function(opts) {
            //Utils.clog("GitterHelper saying", text);
            GitterHelper.sayToRoomObj(text, opts.gitterRoom);
        })
    }

};


module.exports = GitterHelper;