# node-scribe
Scribe client for node.js. Project also includes a drop-in replacement (Logger) for the default console object.
## Installation
    $ npm install scribe
## Basic example
Example of sending log entries to scribe server.

    var Scribe = require('scribe').Scribe;

    var scribe = new Scribe("localhost", 1234, {autoReconnect:true});

    scribe.open(function(err){

      if(err) {
        return console.log(err);
      }

      scribe.send("foocategory", "foomessage");

      scribe.close();

    });

## autoReconnect = true
If autoReconnect is set to true and connection fails, client will store log entries to queue and flush when connection has been re-established.

## Logger
Logger is an drop-in replacement for the default console object. Each log entry contains the level, hostname, pid, caller (file and position) and the log message given as parameter. Values are separated by tabulators.

### Log levels
Levels are defined by the function used or by hand when using the logMessage function.<br />
    0 : EMERG <br />
    1 : ALERT <br />
    2 : CRITICAL (critical)<br />
    3 : ERROR (error)<br />
    4 : WARN (warn)<br />
    5 : NOTICE<br />
    6 : INFO (info)<br />
    7 : DEBUG (debug, log)<br />

### Example
Example of using logger to replace node:s console object.

    var Scribe = require('scribe').Scribe;
    var Logger = require('scribe').Logger;

    var scribe = new Scribe("localhost", 1234, {autoReconnect:true});
    var logger = new Logger(scribe, "foobar");
    scribe.open(function(err){

      if(err) {
        return console.log(err);
      }

      logger.log("foomessage");

      logger.replaceConsole(); // replaces console with logger

      console.log("foobar");

      logger.releaseConsole(); // reverts changes made by replaceConsole();

      scribe.close();

    });

# RequestLog

Creates a middleware which will inject every req object with a log object.
The log object contains an pseudo-unique id for each request in the req.log.id variable.

In addition the req.log object contains console.log compatible logging functions:
log, info, warn, error, critical.

Each log message logged using those methods is passed into the custom writer() function,
which the user must pass in the factory constructor.

The writer takes the following arguments:
function writer(level, request_id, line, message), where:
 - level is the numeric log level as defined in Logger:
     Logger.LOG_DEBUG = 7;
     Logger.LOG_INFO = 6;
     Logger.LOG_WARNING = 4;
     Logger.LOG_ERROR = 3;
     Logger.LOG_CRITICAL = 2;
 - request_id is the pseudo-randomly generated unique id for the request
 - line is a stacktrace line where the log message was generated, in form of "/path/to/file.js:line:character", eg "/path:tio:file.js:282:24"
 - message is a concatenated string of all the arguments passed to the log function

Here's an example how we have used the writer to feed log lines to scribe:

    var hostname = require('os').hostname();
    app.use(RequestLog.factory(function (level, id, line, msg) {
       var str = RequestLog.formatTimestamp(new Date()) + "\t" + RequestLog.levelNames[level] + "\t" + hostname + "\t" + process.pid + "\t" + line + "\t" + id + "\t" + msg;
       scribe.send("comet", str);
    }));
    
Note that the req.log object is mostly compatible with the standard console object.
This means that you can implement functions which accept an ubique 'logger' argument and you can log messages
within these functions by calling for example logger.error("Something bad!"); Then you can pass the req.log
object as the logger object, or simply pass 'console' from within your tests where you don't have access
to a request related req object.

Example:


    // Your function somewhere in your code, not directly related to any express request processing
    function someFunction(value, logger) {
      if (value == null) {
        logger.error("Value was null");
      }
    }
    
    // Function which is directly related to express, for example a middleware
    function processRequest(req, res, next) {
      var value = req.query.value;
      someFunction(value, req.log);
      next();
    }
    
    // You can test the someFunction in your TDD environment by passing console instead of req.log:
    test("my test", function() {
      someFunction("value", console);
    }

## License
(The MIT License)

Copyright(c) 2011 Applifier Ltd.<br />

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.