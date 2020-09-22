const router = require('express').Router();
const fs = require("fs");
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
	let rawdata = fs.readFileSync('data/featured_playlist.json');
    let featured_playlist = JSON.parse(rawdata);
    
    
    if (logged) {
		return res.render('index', {
			data: {
				authenticated: req.logged,
				user_data,
				featured_playlist
			},
			configuration: {
				render: 'app/sentence/home',
				current_page: 'sentence',
				base_url: process.env.BASE_URL,
				fs: await Utils.getPageConfig('app/sentence/home')
			}
		});
    } else {
		// Non connecté à Spotify
		res.redirect('auth');
	}
});


/* POST Search page. */
router.post('/', async function(req, res, next) {
	if(logged){
		let sentence = req.body.query;
		sentence = sentence.trim();
		sentence = sentence.split(' ').join('+');
		res.redirect('/sentence/c/'+ sentence)
	}else {
		res.redirect('auth');
	}
});


/* GET Sentence page. */
router.get('/c/:sentence', async function(req, res, next) {

	if(logged){
		let tmp_res, filtered_res, error_status, error_message = false;
		let result = Array();
		let double_result = Array();
		let final_result = Array();
		let sentence = req.params.sentence;
		sentence = sentence.split('+').join(' ');

		if(sentence.length <= 180){

			let decomposed_sentence = sentence.split(" ");

			// Simple
			for(i = 0; i < decomposed_sentence.length; i++){
				tmp_res = await Spotify.searchMusic(req, decomposed_sentence[i]);
				if(tmp_res.response.statusText && tmp_res.response.statusText == 'Unauthorized'){
					res.redirect('../../auth');
				}else{
					filtered_res = tmp_res.response.tracks.items.filter(d => d.name.toLowerCase() === decomposed_sentence[i].toLowerCase());

					if(filtered_res.length !== 0){
						result[i] = {success: true, response: filtered_res, first_response: filtered_res[0], initial_word: decomposed_sentence[i], start: i + 1, end: i + 1};
					}else{
						result[i] = {success: false, response: "no-result", initial_word: decomposed_sentence[i], start: i + 1, end: i + 1};
					}
					tmp_res, filtered_res = false;
				}
			}

			// Double
			let str = false;
			for(i = 0; i < decomposed_sentence.length; i++){

				str = decomposed_sentence[i]+" "+decomposed_sentence[i + 1];
				tmp_res = await Spotify.searchMusic(req, str);
				if(tmp_res.response.statusText && tmp_res.response.statusText == 'Unauthorized'){
					res.redirect('../../auth');
				}else{
					filtered_res = tmp_res.response.tracks.items.filter(d => d.name.toLowerCase() === str.toLowerCase());

					if(filtered_res.length !== 0){
						double_result[i] = {success: true, response: filtered_res, first_response: filtered_res[0], initial_word: str, start: i + 1, end: i + 2};
					}else{
						double_result[i] = {success: false, response: "no-result", initial_word: str, start: i + 1, end: i + 1};
					}
					tmp_res, filtered_res = false;
				}
				str = false;
			}

			// Tri
			let skip = false
			for(i = 0; i < decomposed_sentence.length; i++){
				if(!skip){
					if(double_result[i].success == true){
						final_result.push(double_result[i])
						skip = true;
					}else{
						final_result.push(result[i])
						skip = false
					}
				}else{
					skip = false
				}
			}

			// Log la phrase
			await Spotify.logSentenceToGallery(final_result, sentence);
		}else{
			error_status = true;
			error_message = `Too long (${sentence.length}/180)`;
		}

		return res.render('index', {
			data: {
				authenticated: req.logged,
				user_data,
				response: {
					error: error_status,
					message: error_message,
					final_result, 
					sentence
				},
			},
			configuration: {
				render: 'app/sentence/response',
				current_page: 'sentence',
				base_url: process.env.BASE_URL,
				fs: await Utils.getPageConfig('app/sentence/response')
			}
		});
	}else {
		res.redirect('../../auth');
	}
});

/* POST Sentence page. */
router.post('/c/:sentence', async function(req, res, next) {
	if(logged){
		let music = req.body.music;
		let sentence = req.body.sentence;

		let request = await Spotify.createPlaylist(req, sentence, user_data.id);

		if(request.status){
			await Spotify.addTracksToPlaylist(req, music.join(','), request.response.id);
			res.redirect('/sentence/p/'+ request.response.id)
		}else{
			res.redirect('');
		}
	}else {
		res.redirect('../../auth');
	}
});


/* GET Playlist page. */
router.get('/p/:token', async function(req, res, next) {
	let error_status, error_message = false;
	let token = req.params.token;

	if(logged){
		return res.render('index', {
			data: {
				authenticated: req.logged,
				user_data,
				response: {
					error: error_status,
					message: error_message,
				},
				token
			},
			configuration: {
				render: 'app/sentence/playlist',
				current_page: 'playlist',
				base_url: process.env.BASE_URL,
				fs: await Utils.getPageConfig('app/sentence/playlist')
			}
		});
	}else {
		res.redirect('../auth');
	}
});

module.exports = router;
