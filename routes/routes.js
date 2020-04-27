const express = require('express');
const router = express.Router();

router.use('/', require('./index') );
router.use('/auth', require('./auth') );
router.use('/account', require('./account') );
router.use('/lyrics', require('./lyrics') );


router.get('/logout', function (req, res) {
    for (let prop in req.cookies) {
        if (!req.cookies.hasOwnProperty(prop)) {
            continue;
        }
        res.cookie(prop, '', {expires: new Date(0)});
    }
	res.redirect('/');
})

router.use(function(req,res){
	res.render('404', {baseUri: process.env.BASE_URI});
});



module.exports = router;
