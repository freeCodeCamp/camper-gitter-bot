'use strict';

var Faye = require('../faye');
var Faye_Class = require('../util/class');
var Faye_Transport = require('./transport');
var Faye_Server = require('../protocol/server');

var Faye_Transport_NodeLocal = Faye.extend(Faye_Class(Faye_Transport, {
  batching: false,

  request: function(messages) {
    messages = Faye.copyObject(messages);
    this.endpoint.process(messages, null, function(replies) {
      this._receive(Faye.copyObject(replies));
    }, this);
  }
}), {
  isUsable: function(client, endpoint, callback, context) {
    callback.call(context, endpoint instanceof Faye_Server);
  }
});

Faye_Transport.register('in-process', Faye_Transport_NodeLocal);

module.exports = Faye_Transport_NodeLocal;
