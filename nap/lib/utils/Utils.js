// this can't run strict
// process.stdout.write('\033c');  // cls

clc = require('cli-color');

var Utils = {

    bright: clc.xterm(237).bgXterm(195),
    dimmed: clc.xterm(232).bgXterm(253),
    warning: clc.xterm(232).bgXterm(215),
    errorColors: clc.xterm(232).bgXterm(196),

    clog: function(where, msg, obj) {
        obj = obj || "" ;
        console.log(this.bright(where), msg, obj);
    },

    error: function(where, msg, obj) {
        obj = obj || "" ;
        console.log(this.warning(where), this.dimmed(msg), obj);
    },

    warn: function(where, msg, obj) {
        obj = obj || "" ;
        console.log(this.warning(where), this.warning(msg), obj);
    },

}

module.exports = Utils;