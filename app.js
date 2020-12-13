import express from 'express'
import session from 'express-session'
import cookie from 'cookie'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'
import passport from 'passport'
import path from 'path'
import { I18n } from 'i18n'

const app = express();
const server = require('http').createServer(app);
const dotenv = require('dotenv').config()
const io = require('socket.io')(server, { wsEngine: 'ws' });

const i18n = new I18n({
    locales: ['en', 'fr'],
    directory: path.join(__dirname, 'web/translations'),
    defaultLocale: 'en',
    cookie: 'sooneos_language',
    queryParameter: 'lang',
})

import * as Passport from './config/passport'

// Models
import * as Spotify from './models/Spotify'
import * as Lyrics from './models/Lyrics'


// Config
app.set('views', __dirname + '/web/views');
app.set('view engine', 'ejs');
app.use(express.static('web'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: "E€$=vD6€HxP6vg&U33h2LZ96!;3Q4tm>mRµ", saveUninitialized: true, resave: true }))
app.use(passport.initialize());
app.use(async (req, res, next) => {
    req.Spotify = Spotify;
    
    const logged = await Spotify.spotifyLogged(req);
    req.logged = (logged) ? true : false;
    let user_data;
    if(!req.cookies.userData) {
        const datas = await Spotify.getUserData(req);
        if(datas.status == true){
            res.cookie('userData', datas.response, {maxAge: Date.now() + (10 * 365 * 24 * 60 * 60)});
            user_data = (logged) ? datas.response : {};
        }else{
            user_data = {};
        }
    }else{
        user_data = req.cookies.userData;
    }
       
    req.user_data = user_data;
    next();
});
app.use(i18n.init)




/**
* Sockets de l'application
*/
io.on('connection', async function(socket){
    const socketId = socket.id;
    const cookies = cookie.parse(socket.request.headers.cookie || '');
    
    /**
    * Récupérer des paroles
    */
    socket.on('request_lyrics', async function()  {
        const current_music = await Spotify.getCustCurrentMusic(cookies);

        if(current_music.status == true && current_music.response.currently_playing_type == 'track'){
            const query = encodeURI( current_music.response.item.name + ' ' + current_music.response.item.album.artists[0].name )
			const idLyrics = await Lyrics.getIDLyrics(query);

			if(idLyrics && idLyrics.response.hits[0]){
                io.to(socketId).emit('response_lyrics', idLyrics.response.hits[0].result.id, current_music); 
			}else{
				io.to(socketId).emit('response_lyrics_error', 'lyrics-not-found'); 
			}
            
		}else{
			if(current_music.code == 'spotify-disconnected'){
                io.to(socketId).emit('response_lyrics_error', 'spotify-disconnected'); 
            }else{
                io.to(socketId).emit('response_lyrics_error', 'music-not-found'); 
            }
            
        }
       
    });

    /**
     * Check si la musique a changée
     */
    socket.on('check_music_changes', async function(music) {
        const current_music = await Spotify.getCustCurrentMusic(cookies);

        if(current_music.status == true && current_music.response.currently_playing_type == 'track'){
            if(current_music.response.item.id !== music){
                io.to(socketId).emit('music_changed'); 
            }
		}else{
            return false;
        }
    })


});


import router from './routes/routes'
app.use('/', router);

server.listen(process.env.PORT, () => {
    console.log(`Listening to requests on ${process.env.BASE_URL}`);
});
