const router = require('express').Router();
let logged, user_data;

router.use(async (req, res, next) => {
	logged = req.logged;
	user_data = req.user_data;
	next();
});

router.get('/', async function(req, res) {
    if (logged) {
        res.render('sentence', {
            logged: logged, 
            BASE_URL: process.env.BASE_URL,
            user_data
        });
    } else {
		// Non connecté à Spotify
		res.redirect('auth');
	}
});

module.exports = router;
