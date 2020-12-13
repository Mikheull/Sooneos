import { Router } from 'express';
import * as utils from '../../models/Utils'

const router = Router();

router.get('/', async function(req, res) {
	return res.render('index', {
		data: {
			authenticated: req.logged,
			user_data: req.user_data,
		},
		configuration: {
			render: 'app/lyrics/home',
			current_page: 'lyrics',
			base_url: process.env.BASE_URL,
			fs: await utils.getPageConfig('app/lyrics/home')
		}
	});
});

export default router
