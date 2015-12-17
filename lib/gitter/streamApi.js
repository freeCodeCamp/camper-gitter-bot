'use strict';

const https = require('https');

function listenToRoom(roomId, bot) {
  const token = process.env.GITTER_USER_TOKEN,
        heartbeat = ' \n';

  console.log('listenToRoom', roomId);

  const options = {
    hostname: 'stream.gitter.im',
    port: 443,
    path: '/v1/rooms/' + roomId + '/chatMessages',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  };

  const req = https.request(options, res => {
    res.on('data', chunk => {
      const msg = chunk.toString();
      if (msg !== heartbeat) {
        const blob = JSON.parse(msg);
        blob.roomId = roomId;
        bot.reply(blob);
      }
    });
  });

  req.on('error', e => {
    console.log('Something went wrong: ' + e.message);
  });

  req.end();
}

module.exports = {
  'listenToRoom': listenToRoom
};
