import { Router } from 'express';
import * as utils from '../models/Utils'

const router = Router();

router.get('/', async function(req, res) {
    return res.render('index', {
        data: {
            authenticated: req.logged,
            user_data: req.user_data
        },
        configuration: {
            render: 'home',
            current_page: 'home',
            base_url: process.env.BASE_URL,
            fs: await utils.getPageConfig('home')
        }
    });
});

export default router
