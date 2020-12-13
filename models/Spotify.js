import axios from 'axios'
import fs from 'fs'
const dotenv = require('dotenv').config()


export async function spotifyLogged(req) {
    if(!req.cookies.spotify_accessToken) return false;
    return true
}

export async function getUserData(req) {
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

export async function getCurrentMusic(req) {
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

export async function getCustCurrentMusic(cookies) {
    const token = cookies.spotify_accessToken;
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

export async function searchMusic(req, query) {
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

export async function createPlaylist(req, sentence, user_id) {
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

export async function addTracksToPlaylist(req, music, playlist_id) {
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
        return {status: true, response: response.data};
    })
    .catch(err => {
        return {status: false, response: err.response};
    });
}

export async function logSentenceToGallery(final_result, sentence) {
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