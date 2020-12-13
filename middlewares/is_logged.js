const dotenv = require('dotenv').config()
import * as Spotify from '../models/Spotify'

module.exports = {
	is_logged: async function is_logged (req, res, next) {

		let isConnected = await Spotify.getUserData(req);
		if(!isConnected.status){
			res.redirect(`${process.env.BASE_URL}auth`)
		}
		next()
    },
}
