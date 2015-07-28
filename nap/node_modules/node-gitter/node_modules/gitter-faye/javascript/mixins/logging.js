'use strict';

var Faye = require('../faye');

var Faye_Logging = {
  LOG_LEVELS: {
    fatal:  4,
    error:  3,
    warn:   2,
    info:   1,
    debug:  0
  },

  writeLog: function(messageArgs, level) {
    // Only log on the given level if it's enabled
    if (!Faye.logger || (typeof Faye.logger[level] !== 'function' && typeof Faye.logger !== 'function')) return;

    var args   = Array.prototype.slice.apply(messageArgs),
        banner = '[Faye',
        klass  = this.className,

        message = args.shift().replace(/\?/g, function() {
          try {
            return Faye.toJSON(args.shift());
          } catch (e) {
            return '[Object]';
          }
        });

    for (var key in Faye) {
      if (klass) continue;
      if (typeof Faye[key] !== 'function') continue;
      if (this instanceof Faye[key]) klass = key;
    }
    if (klass) banner += '.' + klass;
    banner += '] ';

    if (typeof Faye.logger[level] === 'function')
      Faye.logger[level](banner + message);
    else if (typeof Faye.logger === 'function')
      Faye.logger(banner + message);
  }
};

(function() {
  for (var key in Faye_Logging.LOG_LEVELS)
    (function(level) {
      Faye_Logging[level] = function() {
        this.writeLog(arguments, level);
      };
    })(key);
})();

module.exports = Faye_Logging;
