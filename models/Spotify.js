const axios = require('axios');

class Spotify {

    async spotifyLogged(req) {
        if(!req.cookies.spotify_accessToken) return false;
        return true
    }

    async getUserData(req) {
		const token = req.cookies.spotify_accessToken;
        return axios({
            method: 'get',
            url: "https://api.spotify.com/v1/me",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            return {status: true, response: response.data};
        })
        .catch(err => {
			return {status: false};
        });
    }

    async getCurrentMusic(req) {
		const token = req.cookies.spotify_accessToken;
        return axios({
            method: 'get',
            url: "https://api.spotify.com/v1/me/player/currently-playing",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            return {status: true, response: response.data};
        })
        .catch(err => {
			if((err.response.status && err.response.status == '401') && (err.response.statusText && err.response.statusText == 'Unauthorized')){
				return {status: false, code: 'spotify-disconnected'};
			}else{
				return {status: false, code: 'music-not-found'};
			}
        });
	}

}

module.exports = Spotify;
