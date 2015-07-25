"use strict";

var BotObj = {
    OWNERNAME: 'dcsan'
};


var bot = {

    staticReplies: {
        menu: "I know lots about **javascript**! Pick one of:\n - `functions` \n - `objects`",
        help: "Type `menu` for some starting points or check the [guide](http://www.freecodecamp.com/field-guide/all-articles)",
        link: "try this [guide](http://www.freecodecamp.com/field-guide/all-articles).",
        objects: "good question! well, shall we talk about **classical** or **prototypical** ?",
        hint: "depending on the topic, I'm going to show you a context sensitive `hint` here.",
        image1: "![This is a cat](http://40.media.tumblr.com/tumblr_m2nmt6CouC1rtpv45o1_500.jpg)",
        image2: "http://40.media.tumblr.com/tumblr_m2nmt6CouC1rtpv45o1_500.jpg",
        quote: "> this is a quote",
        functions: "this is a function: \n ```javascript \nfunction foo() {\n" + "  alert('hi');\n" + "}; ```",
        heading: "# This is a heading",
        code: "this is inline code `foo();` yay.",
        tasks: "- [x] learn to code\n- [ ] ?????\n- [ ] profit?",
        graph: "http://myserver.com/graphs?period=today.gif",
        star: "> some stuff here quoted \n\n[vote](http://www.freecodecamp.com/field-guide/all-articles)\n" + "> another one here \n[vote](http://www.freecodecamp.com/field-guide/all-articles)"
    },

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
          // console.log("BotObj init", BotObj)
          room.send("bot joined");
        });
    },

    say: function(text) {
        BotObj.room.send(text);
    },

    // init2: function(gitter, roomUrl) {
    //     gitter.rooms.join(roomUrl)
    //     .then(function(room) {
    //         console.log("joined room ", room);
    //         room.send('joined');
    //     });
    // },

    handleInput: function(text) {
        var rep1 = this.staticReplies[text];
        if (rep1)
            return rep1
        else
            return "you said: " + text;
    },

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
        var input = msg.model.text;

        console.log(" in| " + msg.model.fromUser.username + " > " + input);

        // var output = input.toUpperCase();
        var output = this.handleInput(input);
        console.log("out|: ", output);
        BotObj.room.send(output);
        return(output);
    }
}

module.exports = bot;

