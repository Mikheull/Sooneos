const router = require('express').Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    res.send('ok account')
});

module.exports = router;