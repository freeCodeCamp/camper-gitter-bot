# http-response-object

A simple object to represent an http response

[![Build Status](https://img.shields.io/travis/ForbesLindesay/http-response-object/master.svg)](https://travis-ci.org/ForbesLindesay/http-response-object)
[![Dependency Status](https://img.shields.io/gemnasium/ForbesLindesay/http-response-object.svg)](https://gemnasium.com/ForbesLindesay/http-response-object)
[![NPM version](https://img.shields.io/npm/v/http-response-object.svg)](https://www.npmjs.org/package/http-response-object)


## Installation

    npm install http-response-object

## Usage

```js
var Response = require('http-response-object');
var res = new Response(200, {}, new Buffer('A ok'));
//res.statusCode === 200
//res.headers === {}
//res.body === new Buffer('A ok')
res.getBody();
// => new Buffer('A ok')

var res = new Response(404, {'Header': 'value'}, new Buffer('Wheres this page'));
//res.statusCode === 404
//res.headers === {header: 'value'}
//res.body === new Buffer('Wheres this page')
res.getBody();
// => throws error with `statusCode`, `headers` and `body` properties.
```

## License

  MIT
