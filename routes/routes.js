const express = require('express');
const router = express.Router();


router.use('/', require('./index') );
router.use('/auth', require('./auth') );
router.use('/account', ensureAuthenticated, require('./account') );

router.use(function(req,res){
	res.send('404');
});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/auth/spotify');
}

module.exports = router;
