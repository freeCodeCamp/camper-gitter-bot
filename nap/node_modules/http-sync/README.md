# http-sync

http-sync is a compiled Node.js extension that provides syncronous http calls.

# Installing

You must have libcurl installed in order to compile this extension.

On Ubuntu, you can run: `sudo apt-get install libcurl4-openssl-dev`
On CentOS, you can run: `sudo yum install libcurl libcurl-devel`

# Using

```javascript
// example with default options
httpSync = require('http-sync');

var request = httpSync.request({
    method: 'GET',
    headers: {},
    body: '',

    protocol: 'http',
    host: '127.0.0.1',
    port: 80, //443 if protocol = https
    path: '/'
});

var timedout = false;
req.setTimeout(10, function() {
    console.log("Request Timedout!");
    timedout = true;
});
var response = request.end();

if (!timedout) {
    console.log(response);
    console.log(response.body.toString());
}
```

# SSL/TLS Options

If you require the use of a private CA or client certificate authentication, the following options are available:

* pfx - Path to certificate, private key and CA certificates to use
* ca - Path to an authority certificate
* cert - Path to the public x509 client certificate to use
* key - Path to the private key used for SSL
* passphrase - A string of passphrase for the private key or pfx, if required

```javascript
// example with a private CA and client cert authentication
httpSync = require('http-sync');

var request = httpSync.request({
    method: 'GET',
    headers: {},
    body: '',

    protocol: 'https',
    host: '127.0.0.1',
    port: 443, // protocol = https
    path: '/',
    ca: '/path/to/CA',
    cert: '/path/to/crt',
    key: '/path/to/key',
    rejectUnauthorized: true
});

var timedout = false;
req.setTimeout(10, function() {
    console.log("Request Timedout!");
    timedout = true;
});
var response = request.end();

if (!timedout) {
    console.log(response);
    console.log(response.body.toString());
}
```

# Contributing

## node >= v0.8.0

`node-gyp configure && node-gyp build`

## node < v0.8.0

You will need:

* node.js source code
* v8 source code
* libcurl development package

Building:

    node-waf configure && node-waf build

## testing

Run the test.js file:

    node test.js
