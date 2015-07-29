var assert = require('assert');
var Scribe = require('../lib/scribe').Scribe;
var scribeServer = require('../test_utils/scribeserver');
var Logger = require('../lib/logger').Logger;

module.exports = {
  'test construct': function() {
    var scribe = new Scribe("localhost", 8988);
    var logger = new Logger(scribe, "foo");
  },
  'test sending data' : function() {
    var server = scribeServer.createServer();
    server.on('log', function(entry) {
      assert.equal(entry.length, 1, "Should have received one entry");
      assert.equal(entry[0].category, "foo");
      assert.ok(entry[0].message.indexOf("\tfoobar") > -1);
      assert.ok(entry[0].message.indexOf("\tDEBUG") > -1);
      setTimeout(function() {
        scribe.close();
        server.close();
      }, 500);
    });
    server.listen(8992);
    var scribe = new Scribe("localhost", 8992);
    var logger = new Logger(scribe, "foo");
    scribe.open(function(err, client) {
      logger.log("foobar");
    });
  },
  'test replacing console' : function() {
    var server = scribeServer.createServer();
    server.on('log', function(entry) {
      assert.equal(entry.length, 1, "Should have received one entry");
      assert.equal(entry[0].category, "foo");
      assert.ok(entry[0].message.indexOf("\tfoobar") > -1);
      assert.ok(entry[0].message.indexOf("\tDEBUG") > -1);
      setTimeout(function() {
        scribe.close();
        server.close();
      }, 500);
    });
    server.listen(8993);
    var scribe = new Scribe("localhost", 8993);
    var logger = new Logger(scribe, "foo");
    logger.replaceConsole();
    scribe.open(function(err, client) {
      console.log("foobar");
      logger.releaseConsole();
    });
  }
};
