const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

module.exports = () => {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
  
  passport.use(
    new SpotifyStrategy(
      {
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        callbackURL: 'http://localhost:3030/auth/spotify/callback'
      },
      
      function(accessToken, refreshToken, expires_in, profile, done) {
        return done(null, profile);
        // User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
        //   return done(err, user);
        // });
      }
    )
  );
}

