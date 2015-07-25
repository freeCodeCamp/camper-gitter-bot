/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

if ('function' !== typeof Map) throw new Error("ES6 is required; add --harmony");

var express = require('express');
var port = process.env.PORT || 7000;

// other requires
var Gitter = require('node-gitter');
var AppConfig = require("./config/AppConfig");
var GBot = require("./lib/bot/GBot.js");

var routes = require("./lib/app/routes.js");
var passport = require("./lib/gitter/passportModule");


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



GBot.handleInput("menu");



app.listen(port);
console.log('Demo app running at http://localhost:' + port);
