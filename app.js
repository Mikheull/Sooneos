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

    const user_data = (logged) ? await Spotify.getUserData(req) : {};
    req.user_data = user_data.response;
   
    next();
});

// Router
const router = require('./routes/routes');
app.use('/', router);

server.listen(process.env.PORT, () => {
    console.log(`Listening to requests on ${process.env.BASE_URL}`);
});