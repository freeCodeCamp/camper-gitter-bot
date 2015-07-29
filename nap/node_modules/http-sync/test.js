var http_sync = require('./http-sync')


// Test GET request
var req = http_sync.request({
    host: 'nodejs.org',
    path: '/'
});

// console.log(req);

var res = req.end();
console.log(res);
console.log("Reponse Body Length: ", res.body.toString().length);

// Test HTTPS POST request
req = http_sync.request({
    protocol: 'https',
    method: 'POST',
    host: 'talk.to',
    path: '/',
    body: '<body/>'
});

res = req.end();
console.log(res);
console.log("Reponse Body Length: ", res.body.toString().length);

// Test unauthorized HTTPS GET request
req = http_sync.request({
    protocol: 'https',
    method: 'GET',
    host: 'apache.org',
    path: '/',
    rejectUnauthorized: true
});

try {
    res = req.end();
    console.log(res);
    console.log("Reponse Body: ", res.body.toString());
} catch(ex) {
    console.log("Successully rejected unauthorized host: https://apache.org/");
}

// Test timeout
var req = http_sync.request({
    host: '198.51.100.1',
    port: 91,
    path: '/foobar'
});

var timedout = false;
req.setTimeout(10, function() {
    console.log("Request Timedout!");
    timedout = true;
});

res = req.end();
if (!timedout) {
    throw new Error('Timeout is broken');
}

// Test connect timeout
var req = http_sync.request({
    host: '198.51.100.1',
    port: 91,
    path: '/foobar'
});

timedout = false;
req.setTimeout(10, function() {
    console.log("Request Timedout!");
    timedout = true;
});
req.setConnectTimeout(10, function() {
    console.log("Request Timedout in Connect!");
    timedout = true;
});

res = req.end();
if (!timedout) {
    throw new Error("Timeout is broken");
}
