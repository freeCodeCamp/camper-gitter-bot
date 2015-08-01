"use strict";

var spawn = require('child_process').spawn;

// var exec = require('child_process').exec;

// var _ = require('underscore'); // for some utility goodness
// var GBot = require("../../../lib/bot/GBot.js"),
var    KBase = require("../../bot/KBase");
//     Utils = require("../../../lib/utils/Utils"),
//     AppConfig = require("../../../config/AppConfig"),
//     HttpWrap = require("../../../lib/utils/HttpWrap");


var commands = {
    update: function (input, bot) {
        var cmdPath = 'bin/wiki-pull.sh';

        if(input.params && input.params !== 'wiki') {
            // has to be exact command
            return;
        }

        var cmd = spawn('sh', [ cmdPath ], {
            cwd: process.cwd()
            // cwd: process.env.HOME
            // env:_.extend(process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
        });

        cmd.stdout.on('data', function (data) {
            bot.say("data:" + data, input.message.room);
            console.log('stdout: ' + data);
        });

        cmd.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
            bot.say("error: " + data, input.message.room);
        });

        cmd.on('close', function (code) {
            KBase.initAsync();
            bot.say("done " + code, input.message.room);
            // console.log('child process exited with code ' + code);
        });

        // exec(path, function (error, stdout, stderr) {
        //     console.log('wiki-pull');
        //     console.log('stdout: ' + stdout);
        //     console.log('stderr: ' + stderr);
        //     if (error !== null) {
        //         console.log('exec error: ' + error);
        //     } else {
        //         bot.say("done update", input.message.room);
        //     }
        // });
        return "updating wiki...";
    }
};

module.exports = commands;

