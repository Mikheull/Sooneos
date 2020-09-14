const fs = require('fs')


class Utils {

    /**
     * Get la configuration json d'une page
     * @param {JSON} page 
     * @return {Object}
     */
    async getPageConfig(page) {

        let rawdata = fs.readFileSync(`views/pages/${page}/config.json`)
        return JSON.parse(rawdata);
    }

}

module.exports = Utils;