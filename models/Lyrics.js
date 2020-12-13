import axios from 'axios'
const dotenv = require('dotenv').config()


/**
 * Récupérer l'id de la chanson sur Genius
 * @return {Boolean - Response}
 */
export async function getIDLyrics(query) {
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


/**
 * Récupérer la chanson sur Genius
 * @return {Boolean - Response}
 */
export async function getLyrics(id){
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
