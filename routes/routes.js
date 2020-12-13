import { Router } from 'express';
import * as utils from '../models/Utils'
import {is_logged} from '../middlewares/is_logged'

const router = Router();

import home from './index';
import auth from './auth';
import help from './help';
import lyrics from './app/lyrics';
import sentence from './app/sentence';

router.use('/', home );
router.use('/auth', auth );
router.use('/help', help );
router.use('/lyrics', is_logged, lyrics );
router.use('/sentence', is_logged, sentence );


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
            user_data: req.user_data
        },
        configuration: {
            render: 'errors/404',
            current_page: '404',
            base_url: process.env.BASE_URL,
            fs: await utils.getPageConfig('errors/404')
        }
    });
});
  
export default router