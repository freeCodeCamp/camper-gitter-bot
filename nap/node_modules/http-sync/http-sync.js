var caseless = require('caseless');

var _cl = null;
try {
  _cl = require('./build/Release/curllib.node');
} catch (error) {
  _cl = require('./build/default/curllib.node');
}

var curllib = new _cl.CurlLib();

function CurlRequest(options) {
    this._options = options;
    this._headers = { };
    this._caseless = caseless(this._headers);

    var k;
    for (k in this._options.headers) {
        this.setHeader(k, this._options.headers[k]);
    }
}

CurlRequest.prototype = {
    getHeader: function(name) {
        return this._caseless.get(name);
    },
    removeHeader: function(name) {
        delete this._caseless.del(name);
    },
    setHeader: function(name, value) {
        this._caseless.set(name, value);
    },
    write: function(data) {
        data = data || '';
        this._options.body += data;
    },
    setTimeout: function(msec, callback) {
	msec = msec || 0;
        this._options["_timeout"] = {
	    "msec": msec,
	    "callback": callback
	};
    },
    setConnectTimeout: function(msec, callback) {
	msec = msec || 0;
	this._options["_connect_timeout"] = {
	    "msec": msec,
	    "callback": callback
	};
    },
    end: function(data) {
        this.write(data);
        var _ep = this._options.url || this._options.protocol + '://' + this._options.host +
            ':' + this._options.port + this._options.path;
        var _h = [ ];
        var k;
        for (k in this._headers) {
            _h.push(k + ': ' + this._headers[k]);
        }

	var _1_hr_in_ms = 1 * 60 * 60 * 1000;
	var _timeout_ms = this._options._timeout ?
            this._options._timeout.msec : _1_hr_in_ms;
	var _connect_timeout_ms = this._options._connect_timeout ?
	    this._options._connect_timeout.msec : _1_hr_in_ms;
        var ret = curllib.run({
	    method: this._options.method,
	    url: _ep,
	    headers: _h,
	    body: this._options.body,
	    connect_timeout_ms: _connect_timeout_ms,
	    timeout_ms: _timeout_ms,
	    rejectUnauthorized: this._options.rejectUnauthorized,
	    cert : this._options.cert,
	    pfx : this._options.pfx,
	    passphrase : this._options.passphrase,
	    key : this._options.key,
	    ca : this._options.ca
	});

	if (ret.timedout) {
	    // If both connect and (other) timeout are set, only
	    // invoke the connect timeout since we have no way of
	    // knowing which one fired.
	    if (this._options._connect_timeout) {
		this._options._connect_timeout.callback();
	    } else {
		this._options._timeout.callback();
	    }
	    return;
	} else if (ret.error) {
            throw new Error(ret.error);
	}

        ret.body = '';
        if (ret.body_length) {
            var _b = new Buffer(ret.body_length);
            ret.body = curllib.body(_b);
        }

        function _parse_headers(headers) {
            var _sre = /HTTP\/[0-9].[0-9] ([0-9]{3})/;
            var _hre = /([^:]+):([\s]*)([^\r\n]*)/;
            var statusCode = 200;
            var _h = { };
            headers.forEach(function(line) {
                var _m = line.match(_sre);
                if (_m) {
                    statusCode = _m[1];
                }
                else {
                    _m = line.match(_hre);
                    if (_m) {
                        var header = _m[1];
                        var entry = _h[header];
                        var value = _m[3];
                        if (entry) {
                            if (typeof entry === 'string') {
                                _h[header] = [entry]
                            }
                            _h[header].push(value);
                        } else { 
                            _h[header] = value;
                        }
                    }
                }
            });
            return {
                statusCode: parseInt(statusCode, 10),
                headers: _h
            };
        }

        var _ph = _parse_headers(ret.headers);
        ret.statusCode = _ph.statusCode;
        ret.headers    = _ph.headers;

        return ret;
    }
};


exports.request = function(options) {
    options.method = options.method ? options.method.toUpperCase() : 'GET';

    options.protocol = (options.protocol || 'http').replace(/:$/, '');
    options.port = options.port || (options.protocol === 'https' ? 443 : 80);
    options.path = options.path || '/';
    options.headers = options.headers || { };
    options.host = options.host || '127.0.0.1';
    options.body = options.body || '';
    if (options.auth && !options.headers['Authorization']) {
        //basic auth
        options.headers['Authorization'] = 'Basic ' + new Buffer(options.auth).toString('base64');
    }
    options.rejectUnauthorized = options.rejectUnauthorized === false ?
	false : true;

    return new CurlRequest(options);
};

