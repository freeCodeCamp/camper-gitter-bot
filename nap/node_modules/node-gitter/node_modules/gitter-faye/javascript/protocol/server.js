'use strict';

var Faye = require('../faye');
var Faye_Class = require('../util/class');
var Faye_Server_Socket = require('./socket');
var Faye_Logging = require('../mixins/logging');
var Faye_Extensible = require('./extensible');
var Faye_Channel = require('./channel');
var Faye_Error = require('../error');
var Faye_Engine = require('../engines/engine');
var Faye_Grammar = require('./grammar');

var Faye_Server = Faye_Class({
  META_METHODS: ['handshake', 'connect', 'disconnect', 'subscribe', 'unsubscribe'],

  initialize: function(options) {
    this._options  = options || {};
    var engineOpts = this._options.engine || {};
    engineOpts.timeout = this._options.timeout;
    this._engine   = Faye_Engine.get(engineOpts);

    this.info('Created new server: ?', this._options);
  },

  close: function() {
    return this._engine.close();
  },

  openSocket: function(clientId, socket, request) {
    if (!clientId || !socket) return;
    this._engine.openSocket(clientId, new Faye_Server_Socket(this, socket, request));
  },

  closeSocket: function(clientId, close) {
    this._engine.flushConnection(clientId, close);
  },

  process: function(messages, request, callback, context) {
    var local = (request === null);

    messages = [].concat(messages);
    this.info('Processing messages: ? (local: ?)', messages, local);

    if (messages.length === 0) return callback.call(context, []);
    var processed = 0, responses = [], self = this;

    var gatherReplies = function(replies) {
      responses = responses.concat(replies);
      processed += 1;
      if (processed < messages.length) return;

      var n = responses.length;
      while (n--) {
        if (!responses[n]) responses.splice(n,1);
      }
      self.info('Returning replies: ?', responses);
      callback.call(context, responses);
    };

    var handleReply = function(replies) {
      var extended = 0, expected = replies.length;
      if (expected === 0) gatherReplies(replies);

      for (var i = 0, n = replies.length; i < n; i++) {
        this.debug('Processing reply: ?', replies[i]);
        (function(index) {
          self.pipeThroughExtensions('outgoing', replies[index], request, function(message) {
            replies[index] = message;
            extended += 1;
            if (extended === expected) gatherReplies(replies);
          });
        })(i);
      }
    };

    for (var i = 0, n = messages.length; i < n; i++) {
      this.pipeThroughExtensions('incoming', messages[i], request, function(pipedMessage) {
        this._handle(pipedMessage, local, handleReply, this);
      }, this);
    }
  },

  _makeResponse: function(message) {
    var response = {};

    if (message.id)       response.id       = message.id;
    if (message.clientId) response.clientId = message.clientId;
    if (message.channel)  response.channel  = message.channel;
    if (message.error)    response.error    = message.error;

    response.successful = !response.error;
    return response;
  },

  _handle: function(message, local, callback, context) {
    if (!message) return callback.call(context, []);
    this.info('Handling message: ? (local: ?)', message, local);

    var channelName = message.channel,
        error       = message.error,
        response;

    if (Faye_Channel.isMeta(channelName))
      return this._handleMeta(message, local, callback, context);

    if (!Faye_Grammar.CHANNEL_NAME.test(channelName))
      error = Faye_Error.channelInvalid(channelName);

    if (!error) this._engine.publish(message);

    response = this._makeResponse(message);
    if (error) response.error = error;
    response.successful = !response.error;
    callback.call(context, [response]);
  },

  _handleMeta: function(message, local, callback, context) {
    var method = Faye_Channel.parse(message.channel)[1],
        response;

    if (Faye.indexOf(this.META_METHODS, method) < 0) {
      response = this._makeResponse(message);
      response.error = Faye_Error.channelForbidden(message.channel);
      response.successful = false;
      return callback.call(context, [response]);
    }

    this[method](message, local, function(responses) {
      responses = [].concat(responses);
      for (var i = 0, n = responses.length; i < n; i++) this._advize(responses[i], message.connectionType);
      callback.call(context, responses);
    }, this);
  },

  _advize: function(response, connectionType) {
    if (Faye.indexOf([Faye_Channel.HANDSHAKE, Faye_Channel.CONNECT], response.channel) < 0)
      return;

    var interval, timeout;
    if (connectionType === 'eventsource') {
      interval = Math.floor(this._engine.timeout * 1000);
      timeout  = 0;
    } else {
      interval = Math.floor(this._engine.interval * 1000);
      timeout  = Math.floor(this._engine.timeout * 1000);
    }

    response.advice = response.advice || {};
    if (response.error) {
      Faye.extend(response.advice, {reconnect:  'handshake'}, false);
    } else {
      Faye.extend(response.advice, {
        reconnect:  'retry',
        interval:   interval,
        timeout:    timeout
      }, false);
    }
  },

  // MUST contain  * version
  //               * supportedConnectionTypes
  // MAY contain   * minimumVersion
  //               * ext
  //               * id
  handshake: function(message, local, callback, context) {
    var response = this._makeResponse(message);
    response.version = Faye.BAYEUX_VERSION;

    if (!message.version)
      response.error = Faye_Error.parameterMissing('version');

    var clientConns = message.supportedConnectionTypes,
        commonConns;

    response.supportedConnectionTypes = Faye.CONNECTION_TYPES;

    if (clientConns) {
      commonConns = Faye.filter(clientConns, function(conn) {
        return Faye.indexOf(Faye.CONNECTION_TYPES, conn) >= 0;
      });
      if (commonConns.length === 0)
        response.error = Faye_Error.conntypeMismatch(clientConns);
    } else {
      response.error = Faye_Error.parameterMissing('supportedConnectionTypes');
    }

    response.successful = !response.error;
    if (!response.successful) return callback.call(context, response);

    this._engine.createClient(function(clientId) {
      response.clientId = clientId;
      callback.call(context, response);
    }, this);
  },

  // MUST contain  * clientId
  //               * connectionType
  // MAY contain   * ext
  //               * id
  connect: function(message, local, callback, context) {
    var response       = this._makeResponse(message),
        clientId       = message.clientId,
        connectionType = message.connectionType;

    this._engine.clientExists(clientId, function(exists) {
      if (!exists)         response.error = Faye_Error.clientUnknown(clientId);
      if (!clientId)       response.error = Faye_Error.parameterMissing('clientId');

      if (Faye.indexOf(Faye.CONNECTION_TYPES, connectionType) < 0)
        response.error = Faye_Error.conntypeMismatch(connectionType);

      if (!connectionType) response.error = Faye_Error.parameterMissing('connectionType');

      response.successful = !response.error;

      if (!response.successful) {
        delete response.clientId;
        return callback.call(context, response);
      }

      if (message.connectionType === 'eventsource') {
        message.advice = message.advice || {};
        message.advice.timeout = 0;
      }
      this._engine.connect(response.clientId, message.advice, function(events) {
        callback.call(context, [response].concat(events));
      });
    }, this);
  },

  // MUST contain  * clientId
  // MAY contain   * ext
  //               * id
  disconnect: function(message, local, callback, context) {
    var response = this._makeResponse(message),
        clientId = message.clientId;

    this._engine.clientExists(clientId, function(exists) {
      if (!exists)   response.error = Faye_Error.clientUnknown(clientId);
      if (!clientId) response.error = Faye_Error.parameterMissing('clientId');

      response.successful = !response.error;
      if (!response.successful) delete response.clientId;

      if (response.successful) this._engine.destroyClient(clientId);
      callback.call(context, response);
    }, this);
  },

  // MUST contain  * clientId
  //               * subscription
  // MAY contain   * ext
  //               * id
  subscribe: function(message, local, callback, context) {
    var response     = this._makeResponse(message),
        clientId     = message.clientId,
        subscription = message.subscription,
        channel;

    subscription = subscription ? [].concat(subscription) : [];

    this._engine.clientExists(clientId, function(exists) {
      if (!exists)               response.error = Faye_Error.clientUnknown(clientId);
      if (!clientId)             response.error = Faye_Error.parameterMissing('clientId');
      if (!message.subscription) response.error = Faye_Error.parameterMissing('subscription');

      response.subscription = message.subscription || [];

      for (var i = 0, n = subscription.length; i < n; i++) {
        channel = subscription[i];

        if (response.error) break;
        if (!local && !Faye_Channel.isSubscribable(channel)) response.error = Faye_Error.channelForbidden(channel);
        if (!Faye_Channel.isValid(channel))                  response.error = Faye_Error.channelInvalid(channel);

        if (response.error) break;
        this._engine.subscribe(clientId, channel);
      }

      response.successful = !response.error;
      callback.call(context, response);
    }, this);
  },

  // MUST contain  * clientId
  //               * subscription
  // MAY contain   * ext
  //               * id
  unsubscribe: function(message, local, callback, context) {
    var response     = this._makeResponse(message),
        clientId     = message.clientId,
        subscription = message.subscription,
        channel;

    subscription = subscription ? [].concat(subscription) : [];

    this._engine.clientExists(clientId, function(exists) {
      if (!exists)               response.error = Faye_Error.clientUnknown(clientId);
      if (!clientId)             response.error = Faye_Error.parameterMissing('clientId');
      if (!message.subscription) response.error = Faye_Error.parameterMissing('subscription');

      response.subscription = message.subscription || [];

      for (var i = 0, n = subscription.length; i < n; i++) {
        channel = subscription[i];

        if (response.error) break;
        if (!local && !Faye_Channel.isSubscribable(channel)) response.error = Faye_Error.channelForbidden(channel);
        if (!Faye_Channel.isValid(channel))                  response.error = Faye_Error.channelInvalid(channel);

        if (response.error) break;
        this._engine.unsubscribe(clientId, channel);
      }

      response.successful = !response.error;
      callback.call(context, response);
    }, this);
  }
});

Faye.extend(Faye_Server.prototype, Faye_Logging);
Faye.extend(Faye_Server.prototype, Faye_Extensible);

module.exports = Faye_Server;
