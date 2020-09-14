const router = require('express').Router();
const Lyrics = new (require('../models/Lyrics'))()
const Utils = new (require('../models/Utils'))()

let logged, user_data;
let Spotify;

router.use(async (req, res, next) => {
	logged = req.logged;
    user_data = req.user_data;
    Spotify = req.Spotify
	next();
});

router.get('/', async function(req, res) {
    if (logged) {
        const current_music = await Spotify.getCurrentMusic(req);
        let lyrics = null;

        if(current_music.status == true && current_music.response.currently_playing_type == 'track'){
			const query = encodeURI( current_music.response.item.name + ' ' + current_music.response.item.album.artists[0].name )
			const idLyrics = await Lyrics.getIDLyrics(query);

			if(idLyrics && idLyrics.response.hits[0]){
				lyrics = idLyrics.response.hits[0].result.id;
			}else{
				lyrics = null;
			}
		}else{
			if(current_music.code == 'spotify-disconnected'){
				res.redirect('auth');
			}else{
				lyrics = null;
			}
        }

		return res.render('index', {
			data: {
				authenticated: req.logged,
				user_data, current_music, lyrics
			},
			configuration: {
				render: 'app/lyrics/home',
				current_page: 'lyrics',
				base_url: process.env.BASE_URL,
				fs: await Utils.getPageConfig('app/lyrics/home')
			}
		});

    } else {
		// Non connecté à Spotify
		res.redirect('auth');
	}
});

module.exports = router;
