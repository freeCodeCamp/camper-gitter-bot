"use strict";

var BotObj = {
    OWNERNAME: 'dcsan'
};

var bot = {

    init: function(gitter, roomUrl) {
        // var that = this;
        // BotObj.gitter = gitter;
        gitter.rooms.join(roomUrl, function(err, room) {
          if (err) {
            console.log('Not possible to join the room: ', err);
            return;
          }
          // console.log('Joined room: ', room.name);
          // that.room = room;
          BotObj.room = room;
          console.log("BotObj init", BotObj)
          room.send("bot joined");
        });        
    },

    // init2: function(gitter, roomUrl) {
    //     gitter.rooms.join(roomUrl)
    //     .then(function(room) {
    //         console.log("joined room ", room);
    //         room.send('joined');
    //     });
    // },

    reply: function(msg) {
        if (msg.operation != "create") {
            console.log("skip msg reply", msg);
            return;
        }
        console.log("msg\n", msg);
        console.log("BotObj\n", BotObj);

        if (msg.model.fromUser.username == BotObj.OWNERNAME) {
            console.warn("skip self reply");
            return;
        }

        console.log("bot.reply msg.text:", msg.text);
        console.log("bot.reply msg.username:", msg.model.fromUser.username);
        // console.log("bot.reply msg:", msg);

        var input = msg.model.text;
        var output = input.toUpperCase();
        var str = ("  input> " + input + "\n output> " + output);
        console.log("bot\n: ", str);
        // this.room.send(output, msg.roomId);
        BotObj.room.send(output);
        return(output);
    }
}

module.exports = bot;