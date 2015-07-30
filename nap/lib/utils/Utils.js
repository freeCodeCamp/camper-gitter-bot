"use strict";

var assert = require("chai").assert;

var clc = require("cli-color");
var _ = require('lodash-node');
var AppConfig = require("../../config/AppConfig");
// var winston = require("winston");

// var Logger = require("./Logger.js");


// console.log("AppConfig required", AppConfig);

// check if we're in test mode
// console.log("Utils", "argv", process.argv);

var Utils = {

    bright: clc.xterm(237).bgXterm(195),
    dimmed: clc.xterm(232).bgXterm(253),
    warning: clc.xterm(232).bgXterm(215),
    errorColors: clc.xterm(232).bgXterm(196),
    logLevel: 10,  // default

    // this can't run strict
    // cls: function () {
    //     process.stdout.write('\033c');  // cls
    // },

    clog: function (where, msg, obj) {
        if (this.logLevel < 3) {
            return;
        }
        obj = obj || "";
        console.log(this.bright(where), this.dimmed(msg), obj);
        // winston.log(where, msg, obj);
    },

    // log during test
    tlog: function () {
        // p1 = p1 || "";
        // p2 = p2 || "";
        // p3 = p3 || "";
        var args = Array.prototype.slice.call(arguments);

        // Array.prototype.push.apply( args, arguments );
        var p1 = args.shift();
        var p2 = args.shift();
        console.log('------');
        console.log(this.bright(p1), this.dimmed(p2));
        args.forEach(function(p) {
            if (p) {console.log(p); }
        });
    },

    warn: function (where, msg, obj) {
        if (this.logLevel < 2) {
            // console.log("skipping warn this.logLevel", this.logLevel);
            return;
        }
        obj = obj || "";
        console.log(this.warning(where), this.warning(msg), obj);
    },

    error: function (where, msg, obj) {
        if (this.logLevel < 1) {
            return;
        }
        obj = obj || "";
        console.log(this.warning(where), this.dimmed(msg), obj);
    },

    // used for tests
    // and also strings to commands
    // https://developer.gitter.im/docs/messages-resource
    makeMessageFromString: function (text) {
        var message = {};
        var model = {
            text: text
        };
        message.model = model;
        return message;
    },

    sanitize: function (str, opts) {
        if (opts && opts.spaces) {
            str = str.replace(/\s/g, "-");
        }
        str = str.toLowerCase();
        str = str.replace(".md", "");
        // \?   leave Q marks
        str = str.replace(/([^a-z0-9áéíóúñü_@\-\s]|[\t\n\f\r\v\0])/gim, "");
        return str;
    },

    // display filenames replace the - with a space
    namify: function (str, opts) {
        str = str.replace(/-/g, " ");
        return str;
    },

    asFileName: function (str) {
        str = str.replace(/ /g, "-");
        return str;
    },

    linkify: function (str, where) {
        var host, link, uri, name;

        str = str.replace("?", "%3F");  // not URL encoded

        switch (where) {
            case 'gitter':
                host = AppConfig.gitterHost + AppConfig.mainbot;
                break;
            case 'wiki':
                host = AppConfig.wikiHost;
                break;
            default:
                host = AppConfig.wikiHost + AppConfig.mainbot;
        }

        uri = host + str;
        name = Utils.namify(str);
        link = `[${name}](${uri})`;
        Utils.clog("link", link);
        return link;
    },

    messageMock: function (text) {
        var message = this.makeMessageFromString(text);

        message.model.fromUser = {
            username: "testuser"
        };
        return message;
    },

    splitParams: function (text) {
        assert.isString(text);
        var keyword, parts, params;

        parts = text.split(" ");
        keyword = parts.shift();
        if (parts.length > 0) {
            params = parts.join(" ");
        }
        var res = {
            keyword: keyword,
            params: params
        };
        return res;
    },

    checkNotNull: function (item, msg) {
        if (item) {
            return true; // means OK
        } else {
            this.error(msg);
            return false;
        }
    },

    makeUrlList: function(items, where) {
        var out = "";
        if (!items) {
            Utils.error("tried to makeUrlList for no items");
            return;
        }
        out += items.map(function(one) {
            var uri = "http://" + AppConfig[where] + one;
            return `\n[${one}](${uri})`;
        });
        return out;
    },

    timeStamp: function(when, baseDate) {
        var d1, timestamp, month;
        baseDate = baseDate || new Date();
        d1 = new Date();

        switch(when) {
            case 'yesterday':
            default:
                d1.setDate(baseDate.getDate() - 1);
        }

        month = (d1.getMonth() + 1);
        month = _.padLeft(month, 2, '0');

        timestamp = d1.getFullYear() + '/' + month + '/' + d1.getDate();
        return timestamp;

    }


};

Utils.logLevel = parseInt(process.env.LOG_LEVEL || 4);

// var logFile = __dirname + '/../../log/winston.log';
// var logFile = "winston.log";
// winston.add(winston.transports.File, { filename: logFile });

// console.log("winston logs:", logFile);
// var logger = new winston.Logger();
// logger.log('info', 'Hello distributed log files!');
// winston.log("hello", "winston startup");


module.exports = Utils;
