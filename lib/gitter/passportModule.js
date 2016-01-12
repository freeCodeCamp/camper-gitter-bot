'use strict';

const passport = require('passport'),
      OAuth2Strategy = require('passport-oauth2'),
      gitterHost = process.env.HOST || 'https://gitter.im',
      clientId = process.env.GITTER_APP_KEY,
      clientSecret = process.env.GITTER_APP_SECRET,
      GitterHelper = require('./GitterHelper');

const opts = {
    authorizationURL: gitterHost + '/login/oauth/authorize',
    tokenURL: gitterHost + '/login/oauth/token',
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: '/login/callback',
    passReqToCallback: true
};

passport.use(new OAuth2Strategy(
  opts,
  (req, accessToken, refreshToken, profile, done) => {
    console.log('set access token', accessToken);
    req.session.token = accessToken;
    GitterHelper.fetchCurrentUser(accessToken, (err, user) => {
      return (err ? done(err) : done(null, user));
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, JSON.stringify(user));
});

passport.deserializeUser((user, done) => {
  done(null, JSON.parse(user));
});

module.exports = passport;
