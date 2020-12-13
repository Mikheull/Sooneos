import passport from 'passport'
const SpotifyStrategy = require('passport-spotify').Strategy;
const dotenv = require('dotenv').config()

passport.use(
	new SpotifyStrategy(
		{
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_CALLBACK
    },
    
    function(accessToken, refreshToken, expires_in, profile, done) {
      return done(null, profile);
      // User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
      //   return done(err, user);
      // });
    }
  )
);


passport.serializeUser(function (user, done) {
  done(null, user);
});


passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

