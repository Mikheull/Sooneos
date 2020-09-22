const router = require('express').Router();
let logged, user_data;
const Utils = new (require('../models/Utils'))()

router.use(async (req, res, next) => {
	logged = req.logged;
	user_data = req.user_data;
	next();
});

router.get('/', async function(req, res) {
    return res.render('index', {
        data: {
            authenticated: req.logged,
            user_data
        },
        configuration: {
            render: 'home',
            current_page: 'home',
            base_url: process.env.BASE_URL,
            fs: await Utils.getPageConfig('home')
        }
    });
});

module.exports = router;
