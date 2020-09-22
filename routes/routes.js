const express = require('express');
const router = express.Router();
const Utils = new (require('../models/Utils'))()

let logged, user_data;

router.use(async (req, res, next) => {
	logged = req.logged;
    user_data = req.user_data;
	next();
});

router.use('/', require('./index') );
router.use('/auth', require('./auth') );
router.use('/help', require('./help') );
router.use('/lyrics', require('./lyrics') );
router.use('/sentence', require('./sentence') );
// router.use('/blindtest', require('./blindtest') );


router.get('/logout', function (req, res) {
    for (let prop in req.cookies) {
        if (!req.cookies.hasOwnProperty(prop)) {
            continue;
        }
        res.cookie(prop, '', {expires: new Date(0)});
    }
	res.redirect('/');
})

router.use(async function(req,res){
    return res.render('index', {
        data: {
            authenticated: req.logged,
            user_data
        },
        configuration: {
            render: 'errors/404',
            current_page: '404',
            base_url: process.env.BASE_URL,
            fs: await Utils.getPageConfig('errors/404')
        }
    });
});



module.exports = router;
