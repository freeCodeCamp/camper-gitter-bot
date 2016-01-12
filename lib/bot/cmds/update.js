'use strict';

const spawn = require('child_process').spawn,
      KBase = require('../../bot/KBase'),
      Bonfires = require('../../../lib/app/Bonfires');

const commands = {
  update: function(input, bot) {
    const cmdPath = 'bin/wiki-pull.sh';

    if (input.params && input.params !== 'wiki') {
      // has to be exact command
      return;
    }

    let cmd = spawn('sh', [ cmdPath ], {
      cwd: process.cwd()
    });

    // these throw errors if you're already on a branch
    cmd.stdout.on('data', data => {
      const piped = '\n```' + data + '```\n';
      bot.say(piped, input.message.room);
    });

    cmd.stderr.on('data', data => {
      console.log('stderr: ' + data);
    });

    cmd.on('close', code => {
      KBase.initSync();
      Bonfires.load();
      const output = '\n`done code: ' + code + '`' + '\n :computer: ';
      bot.say(output, input.message.room);
    });
    /* eslint-disable consistent-return */
    return 'updating wiki...';
    /* eslint-enable consistent-return */
  }
};

module.exports = commands;
