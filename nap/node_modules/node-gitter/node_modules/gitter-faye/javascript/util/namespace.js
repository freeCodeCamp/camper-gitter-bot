'use strict';

var Faye_Class = require('./class');
var Faye_random = require('./random');

var Faye_Namespace = Faye_Class({
  initialize: function() {
    this._used = {};
  },

  exists: function(id) {
    return this._used.hasOwnProperty(id);
  },

  generate: function() {
    var name = Faye_random();
    while (this._used.hasOwnProperty(name))
      name = Faye_random();
    return this._used[name] = name;
  },

  release: function(id) {
    delete this._used[id];
  }
});

module.exports = Faye_Namespace;
