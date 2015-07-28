/* jshint node:true, unused:true */

var Faye = require('gitter-faye');
var EventEmitter = require('eventemitter3');

// Authentication extension for Faye
var ClientAuthExt = function(opts) {
  this.token = opts.token;
  this.clientType = opts.clientType;
};

ClientAuthExt.prototype.outgoing = function(message, callback) {
  if (message.channel == '/meta/handshake') {
    if (!message.ext) message.ext = {};
    if (this.clientType) message.ext.client = this.clientType;
    message.ext.token = this.token;
  }

  callback(message);
};

// Snapshot extension for Faye
var SnapshotExt = function(opts) {
  this.subscriptions = opts.subscriptions;
};

SnapshotExt.prototype.incoming = function(message, callback) {
  if(message.channel == '/meta/subscribe' && message.ext && message.ext.snapshot) {
    var sub = this.subscriptions[message.subscription];
    if (sub) sub.emitter.emit('snapshot', message.ext.snapshot);
  }

  callback(message);
};

// Client wrapper

var FayeClient = function(token, opts) {
  opts = opts || {};
  var host = opts.host || 'https://ws.gitter.im/faye';

  this.subscriptions = {};

  this.client = new Faye.Client(host, {timeout: 60, retry: 5, interval: 1});
  this.client.addExtension(new ClientAuthExt({token: token, clientType: opts.clientType}));
  this.client.addExtension(new SnapshotExt({subscriptions: this.subscriptions}));
};

FayeClient.prototype.subscribeTo = function(resource, eventName) {
  if (this.subscriptions[resource]) return this.subscriptions[resource].emitter;

  var emitter = new EventEmitter();
  var subscription = this.client.subscribe(resource, function(msg) {
    emitter.emit(eventName, msg);
  });

  this.subscriptions[resource] = {
    eventName:      eventName,
    emitter:        emitter,
    subscription:   subscription
  };

  return emitter;
};

FayeClient.prototype.disconnect = function() {
  var self = this;

  Object.keys(this.subscriptions).forEach(function(sub) {
    self.subscriptions[sub].subscription.cancel();
    self.subscriptions[sub].emitter.removeAllListeners();
  });
};

module.exports = FayeClient;
