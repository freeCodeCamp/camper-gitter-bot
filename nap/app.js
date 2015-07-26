/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";


if ('function' !== typeof Map) throw new Error("ES6 is required; add --harmony");

var express = require('express');
var port = process.env.PORT || 7000;
var passport = require("./lib/gitter/passportModule");

// other requires
var Gitter = require('node-gitter'),
    AppConfig = require("./config/AppConfig"),
    GBot = require("./lib/bot/GBot"),
    Utils = require("./lib/utils/Utils"),
    routes = require("./lib/app/routes.js");

Utils.cls();    


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
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);



var gitter = new Gitter(AppConfig.token);



gitter.currentUser().then(function(user) {
    console.log('You are logged in as:', user.username);
});


GBot.init(gitter);
routes.init(app, GBot, gitter, passport);


// needs a room
// GBot.sendReply("menu");



app.listen(port);
console.log('Demo app running at http://localhost:' + port);
