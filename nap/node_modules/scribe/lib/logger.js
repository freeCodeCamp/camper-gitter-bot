/*!
 * Node-scribe (scribe in npmjs)
 * Scribe client for node.js
 * Copyright(c) 2011 Applifier Ltd
 * MIT Licensed
 */


/**
 * Module dependencies.
 */

var os = require('os');
var systemConsole = global.console;

// console object
var formatRegExp = /%[sdj]/g;
var format = exports.format = function(f) {
  var util = require('util');

  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(util.inspect(arguments[i]));
    }
    return objects.join(' ');
  }


  i = 1;
  var args = arguments;
  var str = String(f).replace(formatRegExp, function(x) {
    switch (x) {
      case '%s':
        return String(args[i++]);
      case '%d':
        return Number(args[i++]);
      case '%j':
        return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for (var len = args.length, x = args[i]; i < len; x = args[++i]) {
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + util.inspect(x);
    }
  }
  return str;
}

var levelNames = exports.levelNames = {
  0 : "EMERG",
  1 : "ALERT",
  2 : "CRITICAL",
  3 : "ERROR",
  4 : "WARN",
  5 : "NOTICE",
  6 : "INFO",
  7 : "DEBUG"
};

var Logger = exports.Logger = function (scribe, category) {

  if (scribe == undefined || category == undefined) {
    throw new Error("Scribe and category should be defined");
  }

  this.stackRegex = new RegExp("Error.+?\t.+?\t.+?\t +?at (.+?)\t");
  this.lastLoggedLeve = null;
  this.lastLoggedLine = null;

  this.scribe = scribe;
  this.scribeCategory = category;

  this.hostname = os.hostname();

  this.levelNames = exports.levelNames;

};

Logger.LOG_DEBUG = 7;
Logger.LOG_INFO = 6;
Logger.LOG_WARNING = 4;
Logger.LOG_ERROR = 3;
Logger.LOG_CRITICAL = 2;

Logger.prototype.releaseConsole = function() {
  // This worked in node 0.4.x
  if (process.version[3] == '4') {
    global.console = this;

  // This works on 0.6 and upwards
  } else {
    //global.__defineGetter__('console', systemConsole);

    // updated to work with node 0.8
    global.__defineGetter__('console', function () {
        return systemConsole; 
      });
  }
};

Logger.prototype.replaceConsole = function() {

  var self = this;

  // This worked in node 0.4.x
  if (process.version[3] == '4') {
    global.console = this;

  // This works on 0.6 and upwards
  } else {
    global.__defineGetter__('console', function() {
        return self; 
      });
  }

};

Logger.prototype.extractCalledFromStack = function () {
  var stack = new Error().stack;
  stack = stack.replace(/\n/g, "\t");
  var r = this.stackRegex.exec(stack);
  if(r == null) {
    return "";
  }
  return r[1];
};

exports.formatTimestamp = Logger.prototype.formatTimestamp = function(t) {

  var month = "" + (t.getUTCMonth() + 1);
  if (month.length == 1) {
    month = "0" + month;
  }

  var days = "" + t.getUTCDate();
  if (days.length == 1) {
    days = "0" + days;
  }

  var hours = "" + t.getUTCHours();
  if (hours.length == 1) {
    hours = "0" + hours;
  }

  var minutes = "" + t.getUTCMinutes();
  if (minutes.length == 1) {
    minutes = "0" + minutes;
  }

  var seconds = "" + t.getUTCSeconds();
  if (seconds.length == 1) {
    seconds = "0" + seconds;
  }

  return t.getFullYear() + "-" + month + "-" + days + " " + hours + ":" + minutes + ":" + seconds;
};

Logger.prototype.logMessage = function (level, msg) {
  var str = this.levelNames[level] + "\t" + this.hostname + "\t" + process.pid + "\t" + this.extractCalledFromStack() + "\t" + msg;

  this.lastLoggedLevel = level;
  this.lastLoggedLine = str;

  if (this.scribe) {
    this.scribe.send(this.scribeCategory, this.formatTimestamp(new Date()) + "\t" + str);
  } else {
    process.stdout.write(this.levelNames[level] + "\t" + process.pid + "\t" + this.extractCalledFromStack() + "\t" + msg + "\n");
  }

};

Logger.prototype.debug = Logger.prototype.log = function (msg) {
  this.logMessage(Logger.LOG_DEBUG, format.apply(this, arguments));
};

Logger.prototype.info = function (msg) {
  this.logMessage(Logger.LOG_INFO, format.apply(this, arguments));
};
Logger.prototype.warn = function (msg) {
  this.logMessage(Logger.LOG_WARNING, format.apply(this, arguments));
};
Logger.prototype.error = function (msg) {
  this.logMessage(Logger.LOG_ERROR, format.apply(this, arguments));
};
Logger.prototype.critical = function (msg) {
  this.logMessage(Logger.LOG_CRITICAL, format.apply(this, arguments));
};

Logger.prototype.dir = function(obj, level) {
  var util = require('util');
  if (!level) {
    level = 'DEBUG';
  }

  var levelNumber = this.levelNames[level];

  this.logMessage(levelNumber, util.inspect(obj));
};

Logger.prototype.trace = function(label) {
  // TODO probably can to do this better with V8's debug object once that is
  // exposed.
  var err = new Error;
  err.name = 'Trace';
  err.message = label || '';
  Error.captureStackTrace(err, arguments.callee);
  this.error(err.stack);
};


Logger.prototype.assert = function(expression) {
  if (!expression) {
    var arr = Array.prototype.slice.call(arguments, 1);
    require('assert').ok(false, format.apply(this, arr));
  }
};
