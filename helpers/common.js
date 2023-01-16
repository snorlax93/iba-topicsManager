const axios = require('axios');

/**
 * method: getDate
 * params: 
 * description: returns date time for database
 * returns: 2023-01-05 01:12:55.000
 */

const getDate = async () => {
    return new Date()
        .toISOString()
        .slice(0, 10)
        .replace('T', ' ');
};

/**
 * method: getDateTime
 * params: 
 * description: returns date time for database
 * returns: 2023-01-05 01:12:55.000
 */

const getDateTime = async () => {
    return new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
};

const setToArray = (object) => {
    let returnArray = [];
    for (let value of Object.values(object)) {
        returnArray.push(value);
    }
    return returnArray;
}

const getIPAddress = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data.ip
    } catch (error) {
        console.log('log err0r');
    }
}


module.exports = {
    getDate,
    getDateTime,
    setToArray,
    getIPAddress
};