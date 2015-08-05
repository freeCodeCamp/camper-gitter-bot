"use strict";

var spawn = require('child_process').spawn;

// var exec = require('child_process').exec;

// var _ = require('underscore'); // for some utility goodness
// var GBot = require("../../../lib/bot/GBot.js"),
var    KBase = require("../../bot/KBase");
var    Bonfires = require("../../../lib/app/Bonfires");
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

        // these throw errors if you're already on a branch
        cmd.stdout.on('data', function (data) {
            var piped = "\n```" + data + "```\n";
            //var piped = data;
            bot.say(piped, input.message.room);
            // console.log('stdout: ' + data);
        });

        cmd.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
            // bot.say("error: " + data, input.message.room);
        });

        cmd.on('close', function (code) {
            KBase.initSync();
            Bonfires.load();
            var output = "\n`done code: " + code + "`";
            output += "\n :computer: ";
            bot.say(output, input.message.room);
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

