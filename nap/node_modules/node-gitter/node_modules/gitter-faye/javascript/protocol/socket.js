'use strict';

var Faye = require('../faye');
var Faye_Class = require('../util/class');

var Faye_Server_Socket = Faye_Class({
  initialize: function(server, socket, request) {
    this._server  = server;
    this._socket  = socket;
    this._request = request;
  },

  send: function(message) {
    this._server.pipeThroughExtensions('outgoing', message, this._request, function(pipedMessage) {
      if (this._socket)
        this._socket.send(Faye.toJSON([pipedMessage]));
    }, this);
  },

  close: function() {
    if (this._socket) this._socket.close();
    delete this._socket;
  }
});


module.exports = Faye_Server_Socket;
