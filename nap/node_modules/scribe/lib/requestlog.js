var Logger = require('./logger');



exports.formatTimestamp = Logger.formatTimestamp;
exports.levelNames = Logger.levelNames;

function randomString() {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = 16;
  var randomstring = '';
  for (var i = 0; i < string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
}

var stackRegex = new RegExp("Error.+?\t.+?\t.+?\t +?at (.+?)\t.+");

var extractCalledFromStack = function () {
  var stack = new Error().stack;
  stack = stack.replace(/\n/g, "\t");

  var r = stackRegex.exec(stack);

  if (r == null) {
    return "";
  }
  return r[1];
};


var logMessage = function (level, req, msg) {

  var line = extractCalledFromStack();

  req.log.writer(level, req.log.id, line, msg);
};

/**
 *
 * Creates a middleware which will inject every req object with a log object.
 * The log object contains an pseudo-unique id for each request in the req.log.id variable.
 *
 * In addition the req.log object contains console.log compatible logging functions:
 * log, info, warn, error, critical.
 *
 * Each log message logged using those methods is passed into the custom writer() function,
 * which the user must pass in the factory constructor.
 *
 * The writer takes the following arguments:
 * function writer(level, request_id, line, message), where:
 *  - level is the numeric log level as defined in Logger:
 *      Logger.LOG_DEBUG = 7;
 *      Logger.LOG_INFO = 6;
 *      Logger.LOG_WARNING = 4;
 *      Logger.LOG_ERROR = 3;
 *      Logger.LOG_CRITICAL = 2;
 *  - request_id is the pseudo-randomly generated unique id for the request
 *  - line is a stacktrace line where the log message was generated, in form of "/path/to/file.js:line:character", eg "/path:tio:file.js:282:24"
 *  - message is a concatenated string of all the arguments passed to the log function
 *
 *  Here's an example how we have used the writer to feed log lines to scribe:
 *
 *   var hostname = require('os').hostname();
 *   app.use(RequestLog.factory(function (level, id, line, msg) {
 *      var str = RequestLog.formatTimestamp(new Date()) + "\t" + RequestLog.levelNames[level] + "\t" + hostname + "\t" + process.pid + "\t" + line + "\t" + id + "\t" + msg;
 *      scribe.send("comet", str);
 *   }));
 *
 */
exports.factory = function (writer) {
  return function (req, res, next) {

    var id = randomString();

    req.log = {
      log:function () {
        logMessage(Logger.Logger.LOG_DEBUG, req, Logger.format.apply(this, arguments));
      },
      info:function () {
        logMessage(Logger.Logger.LOG_INFO, req, Logger.format.apply(this, arguments));
      },
      warn:function () {
        logMessage(Logger.Logger.LOG_WARNING, req, Logger.format.apply(this, arguments));
      },
      error:function () {
        logMessage(Logger.Logger.LOG_ERROR, req, Logger.format.apply(this, arguments));
      },
      critical:function () {
        logMessage(Logger.Logger.LOG_CRITICAL, req, Logger.format.apply(this, arguments));
      },
      id:id,
      writer:writer
    };

    next();
  };

};


