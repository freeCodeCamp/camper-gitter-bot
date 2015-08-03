/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

// var clc = require("cli-color");
//process.stdout.write(clc.erase.screen);

console.log("--------------- startup ------------------")

if (typeof Map !== "function" ) {
    throw new Error("ES6 is required; add --harmony");
}

var express = require("express");
var port = process.env.PORT || 7000;
var passport = require("./lib/gitter/passportModule");

// other requires
var GBot = require("./lib/bot/GBot"),
    routes = require("./lib/app/routes.js");

//should be loaded before Bonfires for wikihints
var KBase = require('./lib/bot/KBase');
var Bonfires = require('./lib/app/Bonfires');

// Utils.cls();

// Client OAuth configuration

var app = express();

// Middlewares
app.set("view engine", "jade");
app.set("views", __dirname + "/views");
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: "keyboard cat"
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);



GBot.init();
routes.init(app, GBot, passport);

// GBot.updateRooms();
// needs a room
// GBot.sendReply("menu");



app.listen(port);
console.log("Demo app running at http://localhost:" + port);
