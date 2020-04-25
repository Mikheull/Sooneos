const router = require('express').Router();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;


passport.use(
	new SpotifyStrategy({
		clientID: process.env.SPOTIFY_CLIENT_ID,
		clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
		callbackURL: process.env.SPOTIFY_CALLBACK
		},
		function(accessToken, refreshToken, expires_in, profile, done) {
			return done(null, profile);
		}
	)
);


router.get('/spotify', passport.authenticate('spotify', { scope: ['user-read-currently-playing', 'playlist-modify-public'] }));


router.get('/spotify/callback',
	passport.authenticate('spotify', { failureRedirect: '/login' }),
	function(req, res) {
		res.cookie('spotify_accessToken', req.query.code, {maxAge: Date.now() + (10 * 365 * 24 * 60 * 60)});
		res.redirect( '/' );
	}
);


router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});


passport.serializeUser(function(user, done) {
	done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

module.exports = router;
