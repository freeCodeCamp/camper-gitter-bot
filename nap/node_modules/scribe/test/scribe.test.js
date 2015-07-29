var assert = require('assert');
var Scribe = require('../lib/scribe').Scribe;
var scribeServer = require('../test_utils/scribeserver');


module.exports = {
  'test construct': function() {
    var scribe = new Scribe("localhost", 8988);
  },
  'test connection opening' : function() {
    var server = scribeServer.createServer();
    server.listen(8988);
    var scribe = new Scribe("localhost", 8988);
    scribe.open(function(err, client) {
      scribe.close();
      setTimeout(function() {
        server.close();
      }, 500);
    });

  },
  'test sending data' : function() {
    var server = scribeServer.createServer();
    server.on('log', function(entry) {
      assert.equal(entry.length, 1, "Should have received one entry");
      assert.equal(entry[0].category, "foogroup");
      assert.equal(entry[0].message, "barmessage");
      setTimeout(function() {
        scribe.close();
        server.close();
      }, 500);
    });
    server.listen(8989);
    var scribe = new Scribe("localhost", 8989);
    scribe.open(function(err, client) {
      scribe.send("foogroup", "barmessage");

    });
  },
  'test queuing data' : function() {
    var server = scribeServer.createServer();
    server.on('log', function(entry) {
      assert.equal(entry.length, 6, "Should have received 6 entries");
      setTimeout(function() {
        scribe.close();
        server.close();
      }, 500);
    });
    server.listen(8990);
    var scribe = new Scribe("localhost", 8990);
    scribe.send("foogroup1", "barmessage");
    scribe.send("foogroup2", "barmessage");
    scribe.send("foogroup3", "barmessage");
    scribe.send("foogroup4", "barmessage");
    scribe.send("foogroup5", "barmessage");
    scribe.send("foogroup6", "barmessage");
    scribe.open(function(err, client) {


    });
  }
};
