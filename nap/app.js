/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

var GitterBot = {
    roomId: '55b1a9030fc9f982beaac901', // botzy
    clientId: process.env.GITTER_KEY,
    token: process.env.GITTER_TOKEN
}

var express = require('express');
var port = process.env.PORT || 7000;

// Client OAuth configuration

var app = express();

// Middlewares
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: 'keyboard cat'
}));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(app.router);

app.get('/test', function(req, res) {
    res.send("test")
})


var Gitter = require('node-gitter');

var gitter = new Gitter(GitterBot.token);

gitter.currentUser()
    .then(function(user) {
        console.log('You are logged in as:', user.username);
    });


app.listen(port);
console.log('Demo app running at http://localhost:' + port);


var oneBot = require("./lib/bot/bot.js");
oneBot.init(gitter, "dcsan/botzy");

gitter.rooms.find(GitterBot.roomId).then(function(room) {

    var events = room.streaming().chatMessages();

    // The 'snapshot' event is emitted once, with the last messages in the room
    events.on('snapshot', function(snapshot) {
        console.log(snapshot.length + ' messages in the snapshot');
    });

    // The 'chatMessages' event is emitted on each new message
    events.on('chatMessages', function(message) {
        console.log('A message was ' + message.operation);
        console.log('Text: ', message);
        oneBot.reply(message);
    });
});


