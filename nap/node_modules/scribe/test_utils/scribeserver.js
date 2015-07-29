var thrift = require('thrift'),
    scribe = require('../lib/gen-nodejs/scribe'),
    ttypes = require('../lib/gen-nodejs/scribe_types');


var createServer = exports.createServer = function() {
var server = thrift.createServer(scribe, {
  Log: function(entry, callback) {
    console.log("Server  received ", entry);
    server.emit('log', entry);
    callback(0);
  }
});
return server;
};


if(!module.parent) {
  var server = createServer();
  server.listen(1463);
  console.log("Started in port 1463");
}