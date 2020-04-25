const express = require("express");
const app = express();
const server = require('http').createServer(app);
const session = require('express-session');
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');


// Config
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(session({secret: process.env.SESSION_SECRET,saveUninitialized: true,resave: true}))

app.use(passport.initialize());
app.use(passport.session());


// Router
const router = require('./routes/routes');
app.use('/', router);

server.listen(process.env.PORT, () => {
    console.log(`Listening to requests on ${process.env.BASE_URL}`);
});