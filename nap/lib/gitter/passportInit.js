var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2');

var gitterHost = process.env.HOST || 'https://gitter.im';
var clientId = process.env.GITTER_KEY;
var clientSecret = process.env.GITTER_SECRET;

passportInit = function(gitter) {    

    passport.use(new OAuth2Strategy({
            authorizationURL: gitterHost + '/login/oauth/authorize',
            tokenURL: gitterHost + '/login/oauth/token',
            clientID: clientId,
            clientSecret: clientSecret,
            callbackURL: '/login/callback',
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            console.log("set access token", accessToken);
            req.session.token = accessToken;
            gitter.fetchCurrentUser(accessToken, function(err, user) {
                return (err ? done(err) : done(null, user));
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        console.log("serializeUser", user);
        done(null, JSON.stringify(user));
    });

    passport.deserializeUser(function(user, done) {
        console.log("deserializeUser", user);
        done(null, JSON.parse(user));
    });

}

module.exports = passportInit;