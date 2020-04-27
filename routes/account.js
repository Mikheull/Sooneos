const router = require('express').Router();

const spotify_obj = new (require('../models/Spotify'))()

// Middlewares
const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    }
    res.redirect('/auth/spotify')
}


/* GET home page. */
router.get('/', isAuth, async function(req, res, next) {
    const datas = await spotify_obj.getUserData(req);
    console.log(datas);
    

    res.send('ok account')
});

module.exports = router;
