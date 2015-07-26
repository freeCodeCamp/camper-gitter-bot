
clc = require('cli-color');

var Utils = {

    bright: clc.xterm(237).bgXterm(195),
    dimmed: clc.xterm(232).bgXterm(253),
    warning: clc.xterm(232).bgXterm(215),
    errorColors: clc.xterm(232).bgXterm(196),

    // this can't run strict
    cls: function() {
        process.stdout.write('\033c');  // cls
    },

    clog: function(where, msg, obj) {
        obj = obj || "" ;
        console.log(this.bright(where), this.dimmed(msg), "\n", obj );
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