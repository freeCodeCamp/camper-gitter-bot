'use strict';

var Faye = require('../faye');
var Faye_Class = require('../util/class');
var Faye_Transport = require('./transport');
var Faye_Event = require('../util/browser/event');
var Faye_URI = require('../util/uri');
var Faye_Promise = require('../util/promise');
var Faye_Deferrable = require('../mixins/deferrable');
var Faye_Set = require('../util/set');
var Faye_Logging = require('../mixins/logging');
var Faye_FSM = require('../util/fsm');

/* @const */
var WS_CONNECTING  = 0;

/* @const */
var WS_OPEN = 1;

/* @const */
var WS_CLOSING = 2;

/* @const */
var WS_CLOSED  = 3;

var FSM = {
  initial: "NEVER_CONNECTED",
  transitions: {
    NEVER_CONNECTED: {
      connect: "CONNECTING_INITIAL"
    },
    CONNECTING_INITIAL: {
      socketClosed: "CLOSED",
      socketConnected: "CONNECTED",
      close: "CLOSED"
    },
    CONNECTING: {
      socketClosed: "AWAITING_RETRY",
      socketConnected: "CONNECTED",
      close: "CLOSED"
    },
    CONNECTED: {
      socketClosed: "AWAITING_RETRY",
      pingTimeout: "RECONNECTING",
      close: "CLOSED"
    },
    AWAITING_RETRY: {
      close: "CLOSED",
      connect: "RECONNECTING"
    },
    RECONNECTING: {
      socketClosed: "AWAITING_RETRY",
      socketConnected: "CONNECTED",
      close: "CLOSED"
    },
    CLOSED: {
      connect: "CONNECTING"
    },
  }
};


var navigatorConnection = Faye.ENV.navigator && (Faye.ENV.navigator.connection || Faye.ENV.navigator.mozConnection || Faye.ENV.navigator.webkitConnection);

var Socket_Promise = Faye_Class({

  initialize: function(socket, transport) {
    var self = this;
    this._socket = socket;
    this._transport = transport;

    this._socketPromise = new Faye_Promise(function(resolve, reject) {
      switch (socket.readyState) {
        case WS_OPEN:
          resolve(self);
          break;

        case WS_CONNECTING:
          // Timeout if the connection doesn't become established
          var connectTimeout = setTimeout(function() {
            reject(new Error('Timeout on connection'));
          }, transport._dispatcher.timeout * 1000 / 4);

          socket.onopen = function() {
            clearTimeout(connectTimeout);
            resolve(self);
          };
          break;

        case WS_CLOSING:
        case WS_CLOSED:
          reject(new Error('Socket connection failed'));
          return;
      }

      socket.onmessage = function(e) {
        self._transport._onmessage(self, e);
      };

      socket.onclose = socket.onerror = function() {
        self.info('Closing WebSocket');
        socket.onclose = socket.onerror = socket.onmessage = null;

        reject(new Error("Connection failed"));
        self.failed();
      };

    }).then(function() {
      self._setup = true;
    }, function(err) {
      self.failed();
      throw err;
    });
  },

  failed: function() {
    this.warn('Marking underlying websocket as failed');

    if(!this._socket) return;
    var socket = this._socket;
    this._socket = null;

    this._socketPromise = new Faye_Promise.rejected(new Error('Connection closed'));
    if(this._setup) {
      this._transport._socketClosed(this);
    }

    var state = socket.readyState;
    socket.onerror = socket.onclose = socket.onmessage = null;

    if(state === WS_OPEN || state === WS_CONNECTING) {
      socket.close();
    }

  },

  connected: function() {
    return this._socketPromise;
  },

  send: function(messages) {
    var self = this;
    return this._socketPromise
      .then(function() {
        var socket = self._socket;

        // Todo: deal with a timeout situation...
        if(socket.readyState !== WS_OPEN) {
          throw new Error('Socket is not open');
        }

        socket.send(Faye.toJSON(messages));
      });
  },

  close: function() {
    this.info('Underlying WebSocket close');

    this.failed();
  }

});
Faye.extend(Socket_Promise.prototype, Faye_Logging);

var Faye_Transport_WebSocket = Faye.extend(Faye_Class(Faye_Transport, {
  batching:     false,
  initialize: function(dispatcher, endpoint) {
    Faye_Transport.prototype.initialize.call(this, dispatcher, endpoint);

    this._state = new Faye_FSM(FSM);
    this._state.on('enter:CONNECTING', this._onEnterConnecting.bind(this));
    this._state.on('enter:RECONNECTING', this._onEnterConnecting.bind(this));
    this._state.on('enter:CONNECTING_INITIAL', this._onEnterConnecting.bind(this));
    this._state.on('enter:AWAITING_RETRY', this._onEnterAwaitingRetry.bind(this));
    this._state.on('enter:CONNECTED', this._onEnterConnected.bind(this));
    this._state.on('leave:CONNECTED', this._onLeaveConnected.bind(this));
  },

  isUsable: function(callback, context) {
    return this.connect()
      .then(function() {
        callback.call(context, true);
      }, function() {
        callback.call(context, false);
      });
  },

  request: function(messages) {
    var self = this;
    var aborted = false;

    // Add all messages to the pending queue
    if (!this._pending) this._pending = new Faye_Set();
    for (var i = 0, n = messages.length; i < n; i++) this._pending.add(messages[i]);

    this.connect()
      .then(function() {
        if (aborted) {
          throw new Error("Send aborted");
        }

        return self._socket.send(messages);
      });

    return {
      abort: function() {
        /* If the message has not already been sent, abort the send */
        aborted = true;
      }
    };
  },

  connect: function() {
    if(this._state.stateIs('CLOSED', 'NEVER_CONNECTED')) {
      this._state.transition('connect');
    }

    return this._state.waitFor({
      fulfilled: 'CONNECTED',
      rejected: 'CLOSED',
      timeout: this._dispatcher.timeout * 1000 / 2
    });
  },

  _onEnterConnecting: function() {
    var self = this;

    if (Faye_Transport_WebSocket._unloaded) {
      self._state.transition('socketClosed', new Error('Sockets unloading'));
      return;
    }

    self.info('Entered connecting state, creating new WebSocket connection');

    var url     = Faye_Transport_WebSocket.getSocketUrl(self.endpoint),
        headers = Faye.copyObject(self._dispatcher.headers),
        options = { headers: headers, ca: self._dispatcher.ca },
        socket;

    options.headers.Cookie = self._getCookies();

    if (Faye.WebSocket) {
      socket = new Faye.WebSocket.Client(url, [], options);
    } else if (Faye.ENV.MozWebSocket) {
      socket = new Faye.ENV.MozWebSocket(url);
    } else if (Faye.ENV.WebSocket) {
      socket = new Faye.ENV.WebSocket(url);
    }

    if (!socket) {
      self._state.transition('socketClosed', new Error('Sockets not supported'));
      return;
    }

    self._socket = new Socket_Promise(socket, self);
    self._socket.connected()
      .then(function(socket) {
        self._state.transition('socketConnected');
      }, function(err) {
        self._state.transition('socketClosed', err);
      });
  },

  _onEnterAwaitingRetry: function() {
    var self = this;
    setTimeout(function() {
      if(self._state.stateIs('AWAITING_RETRY')) {
        self._state.transition('connect');
      }
    }, this._dispatcher.retry * 1000 || 1000);
  },

  _onEnterConnected: function(lastState) {
    this.debug('WebSocket entering connected state');

    var self = this;

    this.addTimeout('ping', this._dispatcher.timeout / 2, this._ping, this);
    if(!this._onNetworkEventBound) {
      this._onNetworkEventBound = this._onNetworkEvent.bind(this);
    }

    if (navigatorConnection) {
      navigatorConnection.addEventListener('typechange', this._onNetworkEventBound, false);
    }

    if (Faye.ENV.addEventListener) {
      Faye.ENV.addEventListener('online', this._onNetworkEventBound, false);
      Faye.ENV.addEventListener('offline', this._onNetworkEventBound, false);
    }

    this._sleepDetectionLast = Date.now();
    this._sleepDetectionTimer = setInterval(function() {
      var now = Date.now();
      if(self._sleepDetectionLast - now > 60000) {
        self._onNetworkEvent();
      }
      self._sleepDetectionLast = now;
    }, 30000);

    if(lastState === 'RECONNECTING') {
      setTimeout(function() {
        self._dispatcher._client.connect(function() {}, self);

      }, 0);
    }
  },

  _onLeaveConnected: function() {
    this.debug('WebSocket leaving connected state');

    var socket = this._socket;
    if(socket) {
      this._socket = null;
      socket.close();
    }
    this.removeTimeout('ping');
    this.removeTimeout('pingTimeout');

    if(navigatorConnection) {
      navigatorConnection.removeEventListener('typechange', this._onNetworkEventBound, false);
    }

    if (Faye.ENV.removeEventListener) {
      Faye.ENV.removeEventListener('online', this._onNetworkEventBound, false);
      Faye.ENV.removeEventListener('offline', this._onNetworkEventBound, false);
    }

    clearTimeout(this._sleepDetectionTimer);

    this._rejectPending();
  },

  close: function() {
    this.debug('WebSocket close requested');
    this._state.transitionIfPossible('close');
  },

  _rejectPending: function() {
    var pending = this._pending ? this._pending.toArray() : [];
    delete this._pending;

    this._handleError(pending);
  },

  _onNetworkEvent: function() {
    if(this._state.stateIs('CONNECTED')) {
      this._ping();
    } else if(this._state.stateIs('AWAITING_RETRY')) {
      this._state.transition('connect');
    }
  },

  _onmessage: function(socket, e) {
    // Don't ignore messages from orphans
    var replies = JSON.parse(e.data);
    if (!replies) return;

    replies = [].concat(replies);

    if(this._socket === socket) {
      this.removeTimeout('pingTimeout');
      this.removeTimeout('ping');
      this.addTimeout('ping', this._dispatcher.timeout / 2, this._ping, this);
    } else {
      this.error('message received from incorrect socket');
    }

    if(this._pending) {
      for (var i = 0, n = replies.length; i < n; i++) {
        if (replies[i].successful !== undefined) {
          this._pending.remove(replies[i]);
        }
      }
    }

    this._receive(replies);
  },

  _socketClosed: function(socket) {
    if(this._socket === socket) {
      this._state.transitionIfPossible('socketClosed');
    }

  },

  _ping: function() {
    this.removeTimeout('ping');
    this.addTimeout('pingTimeout', this._dispatcher.timeout / 4, this._pingTimeout, this);
    this._socket.send([]);
  },

  _pingTimeout: function() {
    this._state.transitionIfPossible('pingTimeout');
  }

}), {

  PROTOCOLS: {
    'http:':  'ws:',
    'https:': 'wss:'
  },

  create: function(dispatcher, endpoint) {
    var sockets = dispatcher.transports.websocket;
    if(!sockets) {
      sockets = {};
      dispatcher.transports.websocket = sockets;
    }

    if(sockets[endpoint.href]) {
      return sockets[endpoint.href];
    }

    var socket =  new Faye_Transport_WebSocket(dispatcher, endpoint);
    sockets[endpoint.href] = socket;
    return socket;
  },

  getSocketUrl: function(endpoint) {
    endpoint = Faye.copyObject(endpoint);
    endpoint.protocol = this.PROTOCOLS[endpoint.protocol];
    return Faye_URI.stringify(endpoint);
  },

  isUsable: function(dispatcher, endpoint, callback, context) {
    this.create(dispatcher, endpoint).isUsable(callback, context);
  }

});

Faye.extend(Faye_Transport_WebSocket.prototype, Faye_Deferrable);
Faye.extend(Socket_Promise.prototype, Faye_Logging);

Faye_Transport.register('websocket', Faye_Transport_WebSocket);

if (Faye_Event && Faye.ENV.onbeforeunload !== undefined)
  Faye_Event.on(Faye.ENV, 'beforeunload', function() {
    Faye_Transport_WebSocket._unloaded = true;
  });

module.exports = Faye_Transport;
