"use strict";

var AppConfig = require('../../config/AppConfig');

var RoomData = require('../../data/RoomData.js');

var GBot = {

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

    init: function(gitter) {
        RoomData.map(function(oneRoom) {
            var roomUrl = oneRoom.path;
            console.log("oneRoom", oneRoom);
            gitter.rooms.join(roomUrl, function(err, room) {
                if (err) {
                    console.log('Not possible to join the room: ', err, roomUrl);
                    return;
                }
                console.log('joined> ', room);
                GBot.listenToRoom(room);
            });

        })
    },

    listenToRoom: function(room) {
        // gitter.rooms.find(room.id).then(function(room) {

            var events = room.streaming().chatMessages();

            // The 'snapshot' event is emitted once, with the last messages in the room
            // events.on('snapshot', function(snapshot) {
            //     console.log(snapshot.length + ' messages in the snapshot');
            // });

            // The 'chatMessages' event is emitted on each new message
            events.on('chatMessages', function(message) {
                console.log("------");
                console.log('operation> ' + message.operation);
                console.log('model> ', message.model);
                console.log('message> ', message);
                console.log('room> ', room);
                console.log("------");
                // GBot.reply(message);
            });
        // });

    },


    getName: function() {
        return AppConfig.botname;
    },

    say: function(text) {
        GBot.room.send(text);
    },

    announce: function(opts) {
        console.log("Bot.announce", opts);
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
        console.log("GBot\n", GBot);

        if (msg.model.fromUser.username == AppConfig.botname) {
            console.warn("skip reply to bot");
            return;
        }
        var input = msg.model.text;

        console.log(" in| " + msg.model.fromUser.username + " > " + input);

        // var output = input.toUpperCase();
        var output = this.handleInput(input);
        console.log("out|: ", output);
        GBot.room.send(output);
        return (output);
    }
}

module.exports = GBot;