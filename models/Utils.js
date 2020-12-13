import fs from 'fs'
const dotenv = require('dotenv').config()

/**
 * Get la configuration json d'une page
 * @param {JSON} page
 * @return {Object}
 */
export async function getPageConfig(page) {
    let rawdata = fs.readFileSync(`web/views/pages/${page}/config.json`)
    return JSON.parse(rawdata);
}