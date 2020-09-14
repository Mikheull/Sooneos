const router = require('express').Router();
let logged, user_data;
const Utils = new (require('../models/Utils'))()

router.use(async (req, res, next) => {
	logged = req.logged;
	user_data = req.user_data;
	next();
});

router.get('/', async function(req, res) {
    if (logged) {
        const animals = ['Bat', 'Bear', 'Beaver', 'Bee', 'Butterfly', 'Cat', 'Chicken', 'Crab', 'Crocodile', 'Dinosaur', 'Dog', 'Dolphin', 'Duck', 'Elephant', 'Fish', 'Fox', 'Frog', 'Giraffe', 'Goat', 'Gorilla', 'Hippopotamus', 'Horse', 'Kangaroo', 'Koala', 'Lion', 'Llama', 'Monkey', 'Mouse', 'Octopus', 'Owl', 'Parrot', 'Pelican', 'Penguin', 'Pig', 'Pigeon', 'Rabbit', 'Raccoon', 'Rat', 'Rhinoceros', 'Sardine', 'Scorpion', 'Shark', 'Sheep', 'Snake', 'Squid', 'Squirrel', 'Tiger', 'Turkey', 'Turtle', 'Viper', 'Walrus', 'Wasp', 'Whale', 'Wildcat', 'Wolf', 'Worm', 'Yak', 'Zebra']
        const colors = ['Azure', 'Beige', 'Black', 'Blue', 'Bronze', 'Brown', 'Cerise', 'Coral', 'Cyan', 'Emerald', 'Gold', 'Gray', 'Green', 'Indigo', 'Lime', 'Magenta', 'Mauve', 'Orange', 'Pink', 'Purple', 'Red', 'Silver', 'Turquoise', 'Violet', 'White', 'Yellow']
        const colors_hex = ['007FFF', 'F5F5DC', '000000', '0000FF', 'CD7F32', '964B00', 'DE3163', 'FF7F50', '00FFFF', '50C878', 'FFD700', '808080', '008000', '4B0082', 'BFFF00', 'FF00FF', 'E0B0FF', 'FF6600', 'FD6C9E', '800080', 'FF0000', 'C0C0C0', '40E0D0', '7F00FF', 'FFFFFF', 'FFFF00']

        let username = `${animals[Math.floor(Math.random() * animals.length)]} ${colors[Math.floor(Math.random() * colors.length)]}`;

        res.render('blindtest', {
            logged: logged, 
            BASE_URL: process.env.BASE_URL,
            user_data,
            game: {
                username
            }
        });
    } else {
		// Non connecté à Spotify
		res.redirect('auth');
	}
});

module.exports = router;
