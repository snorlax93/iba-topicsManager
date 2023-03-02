const mariadb = require('../utils/db');
const logger = require('../controllers/logging');

/**
 * method: userSignIn
 * params: object userData: { userName : string, password : string }
 * description: to query the database for the application. will log each transaction before and after singular attempt is made
 * returns: { data : [ userName, roll, accessToken ], statusCode : code, statusMessage : message }
 */

const userSignIn = async (userData) => {
    // find user in db and pull username, password, and roll

    // decrypt password

    // verify password matches decrypted password

    // return 
    return databaseReturn;
};

/**
 * method: validateAccess
 * params: object accessData: { requiredRolls : [ a, b, c ], userRoll : string }
 * description: to verify that user has access according to rolls
 * returns: true/false
 */

const validateAccess = async (accessData) => {
    return databaseReturn;
};


module.exports = {
    userSignIn,
    validateAccess
};