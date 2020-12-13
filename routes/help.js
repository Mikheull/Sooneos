import { Router } from 'express';
import * as utils from '../models/Utils'

const router = Router();

router.get('/', async function(req, res, next) {
	res.render('index', {
		data: {
			authenticated: req.logged,
			user_data: (req.user_data) ? req.user_data : []
		},
		configuration: {
			render: 'account/help',
			current_page: 'help',
			base_url: process.env.BASE_URL,
			fs: await utils.getPageConfig('account/help')
		}
	});
});

export default router
