'use strict';

require('dotenv').config({ path: 'dot.env' });

console.log('--------------- startup ------------------');

if (typeof Map !== 'function' ) {
  throw new Error('ES6 is required; add --harmony');
}

const express = require('express'),
      port = process.env.PORT || 7891,
      passport = require('./lib/gitter/passportModule'),
      GBot = require('./lib/bot/GBot'),
      routes = require('./lib/app/routes.js'),
      path = require('path');

const app = express();

// Middlewares
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/views'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

GBot.init();
routes.init(app, GBot, passport);

app.listen(port);
console.log('Demo app running at http://localhost:' + port);
