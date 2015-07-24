/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

var GitterBot = {
    roomId: '55b1a9030fc9f982beaac901', // botzy
    clientId: process.env.GITTER_KEY // dont like this in two places
}

var express = require('express');
var passport = require('passport');
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
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// Passport Configuration

app.get('/login',
    passport.authenticate('oauth2')
);

app.get('/login/callback',
    passport.authenticate('oauth2', {
        successRedirect: '/home',
        failureRedirect: '/'
    })
);

app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

app.get('/', function(req, res) {
    res.render('landing');
});


app.get('/home', function(req, res) {
    if (!req.user) return res.redirect('/');

    gitter.stashToken();

    // Fetch user rooms using the Gitter API
    gitter.fetchRooms(req.user, req.session.token, function(err, rooms) {
        if (err) return res.send(500);

        res.render('home', {
            user: req.user,
            token: req.session.token,
            clientId: GitterBot.clientId,
            rooms: rooms
        });
    });

});


app.get('/msg', function(req, res) {
    var msg = {
        text: req.query.input
    }
    var reply = bot.reply(msg);
    gitter.stashToken(req.session.token);

    gitter.postMessage(reply, GitterBot.roomId);
    // res.set('Content-Type', 'text/plain');
    res.type('text/plain');
    res.send(reply);
});

app.listen(port);
console.log('Demo app running at http://localhost:' + port);

var bot = require('./lib/bot/bot.js'),
    passportInit = require('./lib/gitter/passportLogin'),
    gitterStream = require('./lib/gitter/streamApi'),
    gitter = require('./lib/gitter/restApi')

bot.gitter = gitter;

passportInit(gitter);

// gitter.postMessage("test", GitterBot.roomId);

gitterStream.listenToRoom(GitterBot.roomId, bot);