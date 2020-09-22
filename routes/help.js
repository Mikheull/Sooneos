let router = require('express').Router();
let logged;

const Utils = new (require('../models/Utils'))()


router.use(async (req, res, next) => {
	logged = req.logged;
	user_data = req.user_data;
	next();
});

/* GET Search page. */
router.get('/', async function(req, res, next) {
	if(logged){
		res.render('index', {
			data: {
				authenticated: req.logged,
				user_data
			},
			configuration: {
				render: 'account/help',
				current_page: 'help',
				base_url: process.env.BASE_URL,
				fs: await Utils.getPageConfig('account/help')
			}
		});
	} else {
		res.redirect('auth');
	}
});
module.exports = router;
