/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

var GitterBot = {
  roomId: '55b1a9030fc9f982beaac901',  // botzy
  clientId: process.env.GITTER_KEY  // dont like this in two places
}

var express         = require('express');
var passport        = require('passport');
var port          = process.env.PORT || 7000;



// Client OAuth configuration

var app = express();

// Middlewares
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static( __dirname + '/public'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: 'keyboard cat'}));
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

app.get('/logout', function(req,res) {
  req.session.destroy();
  res.redirect('/');
});

app.get('/', function(req, res) {
  res.render('landing');
});


app.get('/home', function(req, res) {
  if (!req.user) return res.redirect('/');

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

app.listen(port);
console.log('Demo app running at http://localhost:' + port);

// realtime stream
var gitterStream = require('./lib/gitter/streamApi');
var gitter = require('./lib/gitter/restApi')

gitterStream.listenToRoom(GitterBot.roomId);

