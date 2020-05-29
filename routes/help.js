let router = require('express').Router();
let logged;

router.use(async (req, res, next) => {
	logged = req.logged;
	user_data = req.user_data;
	next();
});

/* GET Search page. */
router.get('/', async function(req, res, next) {
	if(logged){
		res.render('help', {
            logged: logged, 
            BASE_URL: process.env.BASE_URL,
            user_data
		});
	} else {
		res.redirect('auth');
	}
});
module.exports = router;
