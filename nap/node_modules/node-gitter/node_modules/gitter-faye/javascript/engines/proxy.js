'use strict';

var Faye_Class = require('../util/class');
var Faye = require('../faye');
var Faye_Promise = require('../util/promise');
var Faye_Engine_Memory = require('./memory');
var Faye_Engine_Connection = require('./connection');
var Faye_Channel = require('../protocol/channel');
var Faye_Publisher = require('../mixins/publisher');
var Faye_Logging = require('../mixins/logging');
var Faye_random = require('../util/random');

var Faye_Engine_Proxy = Faye_Class({
  MAX_DELAY:  0,
  INTERVAL:   0,
  TIMEOUT:    60,

  className: 'Engine',

  initialize: function(options) {
    this._options     = options || {};
    this._connections = {};
    this.interval     = this._options.interval || this.INTERVAL;
    this.timeout      = this._options.timeout  || this.TIMEOUT;

    var engineClass = this._options.type || Faye_Engine_Memory;
    this._engine    = engineClass.create(this, this._options);

    this.bind('close', function(clientId) {
      var self = this;
      Faye_Promise.defer(function() { self.flushConnection(clientId); });
    }, this);

    this.debug('Created new engine: ?', this._options);
  },

  connect: function(clientId, options, callback, context) {
    this.debug('Accepting connection from ?', clientId);
    this._engine.ping(clientId);
    var conn = this.connection(clientId, true);
    conn.connect(options, callback, context);
    this._engine.emptyQueue(clientId);
  },

  hasConnection: function(clientId) {
    return this._connections.hasOwnProperty(clientId);
  },

  connection: function(clientId, create) {
    var conn = this._connections[clientId];
    if (conn || !create) return conn;
    this._connections[clientId] = new Faye_Engine_Connection(this, clientId);
    this.trigger('connection:open', clientId);
    return this._connections[clientId];
  },

  closeConnection: function(clientId) {
    this.debug('Closing connection for ?', clientId);
    var conn = this._connections[clientId];
    if (!conn) return;
    if (conn.socket) conn.socket.close();
    this.trigger('connection:close', clientId);
    delete this._connections[clientId];
  },

  openSocket: function(clientId, socket) {
    var conn = this.connection(clientId, true);
    conn.socket = socket;
  },

  deliver: function(clientId, messages) {
    if (!messages || messages.length === 0) return false;

    var conn = this.connection(clientId, false);
    if (!conn) return false;

    for (var i = 0, n = messages.length; i < n; i++) {
      conn.deliver(messages[i]);
    }
    return true;
  },

  generateId: function() {
    return Faye_random();
  },

  flushConnection: function(clientId, close) {
    if (!clientId) return;
    this.debug('Flushing connection for ?', clientId);
    var conn = this.connection(clientId, false);
    if (!conn) return;
    if (close === false) conn.socket = null;
    conn.flush();
    this.closeConnection(clientId);
  },

  close: function() {
    for (var clientId in this._connections) this.flushConnection(clientId);
    this._engine.disconnect();
  },

  disconnect: function() {
    if (this._engine.disconnect) return this._engine.disconnect();
  },

  publish: function(message) {
    var channels = Faye_Channel.expand(message.channel);
    return this._engine.publish(message, channels);
  }
});


Faye.extend(Faye_Engine_Proxy.prototype, Faye_Publisher);
Faye.extend(Faye_Engine_Proxy.prototype, Faye_Logging);

module.exports = Faye_Engine_Proxy;
