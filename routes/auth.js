import { Router } from 'express';
import request from 'request'
import querystring from 'querystring'
import passport from 'passport'

const router = Router();
const SpotifyStrategy = require('passport-spotify').Strategy;

import * as utils from '../models/Utils'


const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_CALLBACK;
const stateKey = 'spotify_auth_state';



/* GET home page. */
router.get('/', async function(req, res, next) {
    return res.render('index', {
        data: {
            authenticated: req.logged,
        },
        configuration: {
            render: 'auth/login',
            current_page: 'login',
            base_url: process.env.BASE_URL,
            fs: await utils.getPageConfig('auth/login')
        }
    });
});

router.get('/spotify', passport.authenticate("spotify", {scope: ["user-read-email", "user-read-private", "user-read-currently-playing", "playlist-modify-public", "user-library-read"], showDialog: true}));
// router.get('/spotify/callback', passport.authenticate("spotify"), (req, res, next) => {
//     res.send(req.user)
// });

router.get('/spotify/callback', function(req, res) {

    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;


    res.clearCookie(stateKey);
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
            headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {

        if (!error && response.statusCode === 200) {

            let access_token = body.access_token,
                refresh_token = body.refresh_token;

            let options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

            // use the access token to access the Spotify Web API
            request.get(options, function(error, response, body) {
            });

            // we can also pass the token to the browser to make requests from there
            res.cookie('spotify_accessToken', access_token, {maxAge: Date.now() + (10 * 365 * 24 * 60 * 60)});
            res.redirect('/');

        } else {
            res.redirect('/#' +
                querystring.stringify({
                    error: 'invalid_token'
            }));
        }
    });
});



router.get('/spotify/token', function(req, res) {

    // requesting access token from refresh token
    let token = req.query.token;

    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            let access_token = body.access_token;
        }else{
            res.send({
                'access_token': null
            });
        }
    });
});

export default router
