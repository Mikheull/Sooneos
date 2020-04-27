const express = require("express");
const app = express();
const server = require('http').createServer(app);
const session = require('express-session');
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

// Models
const Spotify = new (require('./models/Spotify'))()

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

// Router
const router = require('./routes/routes');
app.use('/', router);

server.listen(process.env.PORT, () => {
    console.log(`Listening to requests on ${process.env.BASE_URL}`);
});