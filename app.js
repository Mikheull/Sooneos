const express = require("express");
const app = express();
const server = require('http').createServer(app);
const session = require('express-session');
const dotenv = require('dotenv').config()
const cors = require('cors');
const passport = require('passport');


// Config
app.use(cors());
app.use(session({secret: process.env.SESSION_SECRET,saveUninitialized: true,resave: true}))


server.listen(process.env.PORT, () => {
    console.log(`Listening to requests on ${process.env.BASE_URL}`);
});
