/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

if ('function' !== typeof Map) throw new Error("ES6 is required; add --harmony");

var express = require('express');
var port = process.env.PORT || 7000;

// other requires
var Gitter = require('node-gitter');
var AppConfig = require("./config/AppConfig");
var routes = require("./lib/app/routes.js");
var oneBot = require("./lib/bot/bot.js");





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

var gitter = new Gitter(AppConfig.token);

gitter.currentUser().then(function(user) {
    console.log('You are logged in as:', user.username);
});






app.listen(port);
console.log('Demo app running at http://localhost:' + port);



oneBot.init(gitter, "dcsan/botzy");
routes.init(app, oneBot, AppConfig);

gitter.rooms.find(AppConfig.roomId).then(function(room) {

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


oneBot.handleInput("menu");

