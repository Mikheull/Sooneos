const axios = require('axios');

class Lyrics {

    async getIDLyrics(query){
        return axios({
            method: 'get',
            url: "https://api.genius.com/search?q="+query,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + process.env.GENIUS_ACCESS_TOKEN
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            return false;
        });
    }

    async getLyrics(id){
        return axios({
            method: 'get',
            url: "https://api.genius.com/songs/"+id,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + process.env.GENIUS_ACCESS_TOKEN
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            return false;
        });
    }
}

module.exports = Lyrics;
