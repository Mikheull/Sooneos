const express = require("express");
const app = express();
const server = require('http').createServer(app);
const session = require('express-session');
const dotenv = require('dotenv').config()
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const io = require('socket.io')(server);

// Models
const Spotify = new (require('./models/Spotify'))()
const Lyrics = new (require('./models/Lyrics'))()
const Blindtest = new (require('./models/Blind'))()

// Config
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(session({secret: process.env.SESSION_SECRET,saveUninitialized: true,resave: true}))

app.use(async (req, res, next) => {
    req.Spotify = Spotify;

    const logged = await Spotify.spotifyLogged(req);
    req.logged = logged;

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
        // const current_music = await Spotify.getCustCurrentMusic(cookies);
        // console.log(current_music);

        // if(current_music.status == true && current_music.response.currently_playing_type == 'track'){
        //     const lyrics = await Lyrics.searchLyrics(current_music.response.item.album.artists[0].name, current_music.response.item.name);

        //     console.log(lyrics);
        //     if(lyrics){
        //         io.to(socketId).emit('response_lyrics', lyrics, current_music); 
        //     }else{
        //         io.to(socketId).emit('response_lyrics_error', 'lyrics-not-found');
        //     }
		// }else{
		// 	if(current_music.code == 'spotify-disconnected'){
        //         io.to(socketId).emit('response_lyrics_error', 'spotify-disconnected'); 
        //     }else{
        //         io.to(socketId).emit('response_lyrics_error', 'music-not-found'); 
        //     }
            
        // }
       
    });

    /**
     * Blindtest -> Edit Usermane
     */
    socket.on('bl_edit_username', async function (username) { 
        console.log(username);
        console.log(cookies);

        // cookies('blt_username', username, {maxAge: Date.now() + (1 * 3600 * 1000)});
        // console.log(cookies);
    })

});


// Router
const router = require('./routes/routes');
app.use('/', router);

server.listen(process.env.PORT, () => {
    console.log(`Listening to requests on ${process.env.BASE_URL}`);
});