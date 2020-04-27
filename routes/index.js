const router = require('express').Router();
let _logged, _user_data;

router.use(async (req, res, next) => {
	logged = req.logged;
	user_data = req.user_data;
	next();
});

router.get('/', async function(req, res) {
    res.render('home', {
        logged: true, 
        BASE_URL: process.env.BASE_URL,
        user_data
    });
});

module.exports = router;
