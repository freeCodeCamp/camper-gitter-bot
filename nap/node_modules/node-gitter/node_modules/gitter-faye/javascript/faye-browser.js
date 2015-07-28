'use strict';

var Faye = require('./faye');
Faye.Client = require('./protocol/client');

/* Register the transports. Order is important */
Faye.Transport = {
  WebSocket: require('./transport/web_socket'),
  EventSource: require('./transport/event_source'),
  XHR: require('./transport/xhr'),
  CORS: require('./transport/cors'),
  JSONP: require('./transport/jsonp')
};

module.exports = Faye;
