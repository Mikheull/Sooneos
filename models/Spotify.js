const axios = require('axios');
const fs = require("fs");

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
            if(response.status == '201' || response.status == '200'){
                return {status: true, response: response.data};
            }
            return {status: false, code: 'music-not-found'};
        })
        .catch(err => {
			if((err.response.status && err.response.status == '401') && (err.response.statusText && err.response.statusText == 'Unauthorized')){
				return {status: false, code: 'spotify-disconnected'};
			}else{
				return {status: false, code: 'music-not-found'};
			}
        });
    }
    
    async searchMusic(req, query) {
		const token = req.cookies.spotify_accessToken;
		return axios({
            method: 'get',
            url: "https://api.spotify.com/v1/search?q=\""+encodeURI(query)+"\"&type=track",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            return {status: true, response: response.data};
        })
        .catch(err => {
			return {status: false, response: err.response};
        });
    }
    
    async createPlaylist(req, sentence, user_id) {
		const token = req.cookies.spotify_accessToken;
		return axios({
            method: 'post',
			url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
			data: {
				"name": `${sentence}`,
				"description": "New generated playlist",
				"public": true
			},
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            return {status: true, response: response.data};
        })
        .catch(err => {
			return {status: false, response: err.response};
        });
	}

	async addTracksToPlaylist(req, music, playlist_id) {
		const token = req.cookies.spotify_accessToken;
		return axios({
            method: 'post',
			url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=${music}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
			console.log(reponse);
            return {status: true, response: response.data};
        })
        .catch(err => {
			console.log(err);
			return {status: false, response: err.response};
        });
	}

	async logSentenceToGallery(final_result, sentence) {
		let confirm = true;
		final_result.forEach( music => {
			if(!music.success){confirm = false}
		})

		if(confirm){
			let rawdata = fs.readFileSync('./data/generated_playlist.json');
			let generated_playlist = JSON.parse(rawdata);

			let exist = false;
			generated_playlist['generated'].forEach( playlist => {
				if(playlist.sentence.toLowerCase() == sentence.toLowerCase()){exist = true}
			})

			if(!exist){
				let data = ({
					"sentence": sentence,
					"url": sentence.split(' ').join('+'),
					"date": Date.now()
				});

				generated_playlist['generated'].push(data);
				generated_playlist = JSON.stringify(generated_playlist);

				fs.writeFileSync('./data/generated_playlist.json', generated_playlist);
			}
		}

	}

}

module.exports = Spotify;
