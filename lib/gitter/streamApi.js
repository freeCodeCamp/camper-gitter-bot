var https = require('https');

function listenToRoom(roomId, bot) {
    var token = process.env.GITTER_TOKEN;
    var heartbeat = " \n";

    console.log("listenToRoom", roomId)

    var options = {
        hostname: 'stream.gitter.im',
        port: 443,
        path: '/v1/rooms/' + roomId + '/chatMessages',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    var req = https.request(options, function(res) {
        res.on('data', function(chunk) {
            var msg = chunk.toString();
            if (msg !== heartbeat) {
                console.log('Message: ' + msg);
                blob = JSON.parse(msg);
                blob.roomId = roomId;
                bot.reply(blob);
            }
        });
    });

    req.on('error', function(e) {
        console.log('Something went wrong: ' + e.message);
    });

    req.end();

}



module.exports = {
    'listenToRoom': listenToRoom
};

// console.log("streamApi.exports", module.exports);