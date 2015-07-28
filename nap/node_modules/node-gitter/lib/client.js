/* jshint node:true, unused:true */

var https = require('https');
var http  = require('http');
var qs    = require('qs');
var Q     = require('q');
var url   = require('url');
var debug = require('debug')('node-gitter');

var Client = function(token, opts) {
  opts = opts || {};
  this.token = token;

  // Will be set once authenticated
  this.currentUser = null;

  if(opts.apiEndpoint) {
    var parsed = url.parse(opts.apiEndpoint);

    this.host        = parsed.hostname;
    this.port        = parsed.port;
    this.protocol    = parsed.protocol.replace(/:\/?\/?$/,'');

    var pathname     = parsed.pathname;
    if(pathname[pathname.length - 1] === '/') {
      pathname = pathname.substring(0, pathname.length - 1);
    }

    this.pathPrefix  = pathname;
  } else {
    this.host        = opts.host    || 'api.gitter.im';
    this.port        = opts.port    || 443;
    this.protocol    = this.port === 443 ? 'https' : 'http';
    this.pathPrefix  = (opts.prefix ? '/api/' : '/') + (opts.version || 'v1');
  }
};

['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach(function(method) {
  Client.prototype[method.toLowerCase()] = function(path, opts) {
    return this.request(method, path, opts);
  };
});

Client.prototype.request = function(method, path, opts) {
  opts = opts || {};
  var self = this;
  var defer = Q.defer();

  var headers = {
    'Authorization': 'Bearer ' + this.token,
    'Accept':        'application/json'
  };

  if(opts.body) {
    headers['Content-Type'] = 'application/json';
  }

  var req_opts = {
    hostname: this.host,
    port:     this.port,
    method:   method,
    path:     this.pathPrefix + (opts.query ? path + '?' + qs.stringify(opts.query) : path),
    headers:  headers
  };

  var scheme = { http: http, https: https}[this.protocol];

  debug('%s %s', req_opts.method, req_opts.path);

  var req = scheme.request(req_opts, function(res) {
    res.setEncoding('utf-8');

    self.rateLimit = res.headers['x-ratelimit-limit'];
    self.remaining = res.headers['x-ratelimit-remaining'];

    var data = '';
    res.on('data' , function(chunk) {
      data += chunk;
    });

    res.on('end', function() {
      var body;
      try {
        body = JSON.parse(data);
      } catch(err) {
        defer.reject(new Error(res.statusCode + ' ' + data));
      }

      if (res.statusCode !== 200) {
        defer.reject(new Error(res.statusCode + ' ' + data));
      } else {
        defer.resolve(body);
      }
    });
  });

  req.on('error', function(err) {
    defer.reject(err);
  });

  if (opts.body) {
    req.write(JSON.stringify(opts.body));
  }

  req.end();

  return defer.promise;
};

Client.prototype.stream = function(path, cb) {
  var headers = {
    'Authorization': 'Bearer ' + this.token,
    'Accept':        'application/json',
    'Content-Type':  'application/json'
  };

  var opts = {
    host:     'stream.gitter.im',
    port:     443,
    method:   'GET',
    path:     this.pathPrefix + path,
    headers:  headers
  };

  debug('%s %s', opts.method, opts.path);

  var heartbeat = " \n";

  var req = https.request(opts, function(res) {
    var msg = '';

    res.setEncoding('utf-8');

    res.on('data' , function(chunk) {
      var m = chunk.toString();
      if (m === heartbeat) {
        msg = '';
        return;
      }

      msg += m;
      try {
        var evt = JSON.parse(msg);
        msg = '';
        cb(evt);
      } catch (err) {
        // Partial message. Ignore it.
      }
    });
  });

  req.on('error', function(err) {
    console.error('[stream]', err);
  });

  req.end();
};

module.exports = Client;
