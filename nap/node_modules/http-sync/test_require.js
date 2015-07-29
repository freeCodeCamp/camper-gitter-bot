
function remote_require(_url) {
    var http_sync = require('./http-sync')
    var url       = require('url');
    var fs        = require('fs');

    var _u = url.parse(_url);

    var req = http_sync.request({
        host: _u.hostname,
        port: _u.port,
        path: _u.pathname
    });

    var res = req.end();
    var _fname = '/tmp/some_random_name_that_changes_every_time.js';
    fs.writeFileSync(_fname, res.body.toString());
    return require(_fname);
}

// Fetch underscore.js
var _ = remote_require('http://documentcloud.github.io/underscore/underscore-min.js');

// Do something with _
console.log(_([1,2,3,4]).map(function(x) { return x*x; }));

