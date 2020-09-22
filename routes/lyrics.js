const router = require('express').Router();
const Utils = new (require('../models/Utils'))()

let logged, user_data;

router.use(async (req, res, next) => {
	logged = req.logged;
    user_data = req.user_data;
	next();
});

router.get('/', async function(req, res) {
    if (logged) {
		return res.render('index', {
			data: {
				authenticated: req.logged,
				user_data
			},
			configuration: {
				render: 'app/lyrics/home',
				current_page: 'lyrics',
				base_url: process.env.BASE_URL,
				fs: await Utils.getPageConfig('app/lyrics/home')
			}
		});

    } else {
		// Non connecté à Spotify
		res.redirect('auth');
	}
});

module.exports = router;
