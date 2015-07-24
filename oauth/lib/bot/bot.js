"use strict";

var OWNERNAME = 'dcsan'

var bot = {
    reply: function(msg) {
        console.log("msg\n", msg);
        if (msg.fromUser.username == OWNERNAME) {
            console.warn("skip self reply");
            return;
        }

        console.log("bot.reply msg.text:", msg.text);
        console.log("bot.reply msg.username:", msg.fromUser.username);
        // console.log("bot.reply msg:", msg);

        var input = msg.text;
        var output = input.toUpperCase();
        var str = ("  input> " + input + "\n output> " + output);
        console.log("bot\n: ", str);
        this.gitter.postMessage(output, msg.roomId);
        return(output);
    }
}

module.exports = bot;