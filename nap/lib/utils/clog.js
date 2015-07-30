"use strict";

var clc = require("cli-color");

var logLevel = parseInt(process.env.LOG_LEVEL || 4);

var CliColors = {
    bright: clc.xterm(237).bgXterm(195),
    dimmed: clc.xterm(232).bgXterm(253),
    warning: clc.xterm(232).bgXterm(215),
    errorColors: clc.xterm(232).bgXterm(196)
};


var clog = function (where, msg, obj) {
    if (logLevel < 3) {
        return;
    }
    obj = obj || "";
    console.log(CliColors.bright(where), CliColors.dimmed(msg), obj);
    // winston.log(where, msg, obj);
};

module.exports = clog;

