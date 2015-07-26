
clc = require('cli-color');



var Utils = {

    bright: clc.xterm(237).bgXterm(195),
    dimmed: clc.xterm(232).bgXterm(253),
    warning: clc.xterm(232).bgXterm(215),
    errorColors: clc.xterm(232).bgXterm(196),
    logLevel: 10,  // default

    // this can't run strict
    cls: function() {
        process.stdout.write('\033c');  // cls
    },

    clog: function(where, msg, obj) {
        if (this.logLevel < 3) return;
        obj = obj || "" ;
        console.log(this.bright(where), this.dimmed(msg), obj );
    },

    warn: function(where, msg, obj) {
        if (this.logLevel < 2) return;
        obj = obj || "" ;
        console.log(this.warning(where), this.warning(msg), obj);
    },

    error: function(where, msg, obj) {
        if (this.logLevel < 1) return;
        obj = obj || "" ;
        console.log(this.warning(where), this.dimmed(msg), obj);
    },

}

Utils.logLevel = parseInt(process.env.LOG_LEVEL || 4);


// check if we're in test mode
console.log("Utils", "argv", process.argv);

module.exports = Utils;