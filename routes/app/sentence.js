import { Router } from 'express';
import fs from 'fs'
import * as utils from '../../models/Utils'

const router = Router();


router.get('/', async function(req, res) {
	let rawdata = fs.readFileSync('data/featured_playlist.json');
    let featured_playlist = JSON.parse(rawdata);
    
	return res.render('index', {
		data: {
			authenticated: req.logged,
			user_data: req.user_data,
			featured_playlist
		},
		configuration: {
			render: 'app/sentence/home',
			current_page: 'sentence',
			base_url: process.env.BASE_URL,
			fs: await utils.getPageConfig('app/sentence/home')
		}
	});
});


router.post('/', async function(req, res, next) {
	let sentence = req.body.query;
	sentence = sentence.trim();
	sentence = sentence.split(' ').join('+');
	res.redirect('/sentence/c/'+ sentence)
});


router.get('/c/:sentence', async function(req, res, next) {

	let tmp_res, filtered_res, error_status, error_message = false;
	let result = Array();
	let double_result = Array();
	let final_result = Array();
	let sentence = req.params.sentence;
	sentence = sentence.split('+').join(' ');

	if(sentence.length <= 180){

		let decomposed_sentence = sentence.split(" ");

		// Simple
		for(let i = 0; i < decomposed_sentence.length; i++){
			tmp_res = await req.Spotify.searchMusic(req, decomposed_sentence[i]);
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
		for(let i = 0; i < decomposed_sentence.length; i++){

			str = decomposed_sentence[i]+" "+decomposed_sentence[i + 1];
			tmp_res = await req.Spotify.searchMusic(req, str);
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
		for(let i = 0; i < decomposed_sentence.length; i++){
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
		await req.Spotify.logSentenceToGallery(final_result, sentence);
	}else{
		error_status = true;
		error_message = `Too long (${sentence.length}/180)`;
	}

	return res.render('index', {
		data: {
			authenticated: req.logged,
			user_data: req.user_data,
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
			fs: await utils.getPageConfig('app/sentence/response')
		}
	});
});


router.post('/c/:sentence', async function(req, res, next) {
	let music = req.body.music;
	let sentence = req.body.sentence;

	let request = await req.Spotify.createPlaylist(req, sentence, user_data.id);

	if(request.status){
		await req.Spotify.addTracksToPlaylist(req, music.join(','), request.response.id);
		res.redirect('/sentence/p/'+ request.response.id)
	}else{
		res.redirect('');
	}
});


router.get('/p/:token', async function(req, res, next) {
	let error_status, error_message = false;
	let token = req.params.token;

	return res.render('index', {
		data: {
			authenticated: req.logged,
			user_data: req.user_data,
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
			fs: await utils.getPageConfig('app/sentence/playlist')
		}
	});
});


export default router
