var RequestLog = require('../lib/requestlog');
var assert = require('assert');

test("constructor", function(done) {

  assert.ok(RequestLog);

  done();
});


test("creates request id", function(done) {

  var req = {};
  var res = {};

  var middleware = RequestLog.factory();

  assert.ok(middleware != null);

  done();
});


test("can log something", function(done) {

  var req = {};
  var res = {};
  var buf = "";

  RequestLog.factory(function (level, id, line, msg) {
      buf += msg;
    })(req, res);



  req.log.debug("test");

  assert.equal(buf, "test");

  done();
});

test("can figure out caller line", function(done) {

  var req = {};
  var res = {};
  var buf = "";
  var line = "";

  RequestLog.factory(function (level, id, _line, msg) {
      line = _line;
      buf += msg;
    })(req, res);


  req.log.debug("test");

  assert.equal(buf, "test");
  assert.equal(line, "Test.fn (/Users/juhomakinen/Development/node-scribe/test/requestlog.test.js:57:11)");

  done();
});

test("can pass level correctly", function(done) {

  var req = {};
  var res = {};
  var levels = [];


  RequestLog.factory(function (level, id, _line, msg) {
    levels.push(level);
    })(req, res);

  req.log.debug("test");
  req.log.info("test");
  req.log.warn("test");
  req.log.error("test");
  req.log.critical("test");


  assert.equal(levels[0], 7);
  assert.equal(levels[1], 6);
  assert.equal(levels[2], 4);
  assert.equal(levels[3], 3);
  assert.equal(levels[4], 2);

  done();
});
