'use strict';

var Faye_Engine_Proxy = require('./proxy');

var Faye_Engine = {
  get: function(options) {
    return new Faye_Engine_Proxy(options);
  },

  METHODS: ['createClient', 'clientExists', 'destroyClient', 'ping', 'subscribe', 'unsubscribe']
};

// TODO: put this in a better place
Faye_Engine.METHODS.forEach(function(method) {
  Faye_Engine_Proxy.prototype[method] = function() {
    return this._engine[method].apply(this._engine, arguments);
  };
});


module.exports = Faye_Engine;
