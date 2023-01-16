const databaseController = require('./database');
const commonHelper = require('../helpers/common');

/**
 * method: createUser
 * params: array: [userData]
 * description: adds the user data to the database
 * returns: { data: null, statusCode : string, statusMessage : string }
 */

const createUser = async (userData) => {
    let returnData = { data: null, statusCode: null, statusMessage: null };
    let validateInputs = validateUser(userData);

    if (validateInputs.statusCode == 'Success') {

        delete userData.reqBody.submit;
        userData.reqBody['refreshToken'] = userData.reqBody.refreshToken ? userData.reqBody.refreshToken : 'fake-token';
        userData.reqBody['userLevel'] = userData.reqBody.userLevel ? userData.reqBody.userLevel : '0';
        userData.reqBody['createdAt'] = await commonHelper.getDateTime();
        userData.reqBody['updatedAt'] = await commonHelper.getDateTime();

        let query = {
            'queryString': 'INSERT INTO users (userName, emailAddress, password, refreshToken, userLevel, createdAt, updatedAt) value (?, ?, ?, ?, ?, ?, ?)',
            'options': {
                'tableName': 'users',
                'queryData': commonHelper.setToArray(userData.reqBody)
            }
        };

        returnData = await databaseController.queryDatabase(query);
    } else {
        returnData.data = null;
        returnData.statusCode = validateInputs.statusCode;
        returnData.statusMessage = validateInputs.statusMessage;
    }

    return returnData;
}

/**
 * method: validateUser
 * params: array: [userData]
 * description: confirms if required fields are present and not null/empty strings
 * returns: { statusCode : string, statusMessage : string }
 */

const validateUser = (userData) => {
    let returnData = {
        statusCode: 'Success',
        statusMessage: null
    };

    if (userData) {
        if (userData.reqBody.userName == null || userData.reqBody.userName == '') {
            returnData = {
                data: null,
                statusCode: 'Error',
                statusMessage: 'Need to enter a User Name'
            };
        } else if (userData.reqBody.password == null || userData.reqBody.password == '') {
            returnData = {
                data: null,
                statusCode: 'Error',
                statusMessage: 'Need to enter a Password'
            };
        } else if ((userData.reqBody.userName == null || userData.reqBody.userName == '') && (userData.reqBody.password == null || userData.reqBody.password == '')) {
            returnData = {
                statusCode: 'Error',
                statusMessage: 'Need to include User Name and Password'
            };
        }
    }

    return returnData;
}

/**
 * method: getUsers
 * params: object: {completed: boolean, userId: int}
 * description: get all users based on flag (completed)
 * returns: { statusCode : string, statusMessage : string }
 */

const getUsers = async (flags) => {
    let queryString = 'SELECT * FROM users';
    let returnData = { data: null, statusCode: null, statusMessage: null };

    if (flags) {
        if (flags.userId) {queryString += ' WHERE userId = \''+flags.userId+'\'';}
    }

    let query = {
        'queryString': queryString,
        'options': {
            'tableName': 'users',
            'queryData': null
        }
    };

    returnData = await databaseController.queryDatabase(query);

    return returnData;
};

/**
 * method: updateUser
 * params: object: {userId: int, reqBody: obj}
 * description: updates the user based on userId
 * returns: { data: obj, statusCode : string, statusMessage : string }
 */

const updateUser = async (userData) => {
    let returnData = { data: null, statusCode: null, statusMessage: null };
    let validateInputs = validateUser(userData);

    if (validateInputs.statusCode == 'Success') {
        userData.reqBody['updatedAt'] = await commonHelper.getDateTime();
        userData.reqBody['userId'] = userData.userId;
        let query = {
            'queryString': 'UPDATE users SET userName=?, emailAddress=?, password=?, refreshToken=?, userLevel=?, updatedAt=? WHERE userId=?',
            'options': {
                'tableName': 'users',
                'queryData': commonHelper.setToArray(userData.reqBody)
            }
        };
        returnData = await databaseController.queryDatabase(query);
    } else {
        returnData.data = null;
        returnData.statusCode = validateInputs.statusCode;
        returnData.statusMessage = validateInputs.statusMessage;
    }    

    return returnData;
};

/**
 * method: deleteUser
 * params: object: {userId: int}
 * description: deletes the user based on userId
 * returns: { data: obj, statusCode : string, statusMessage : string }
 */

const deleteUser = async (userData) => {
    let returnData = { data: null, statusCode: null, statusMessage: null };

    let query = {
        'queryString': 'DELETE FROM users WHERE userId=?',
        'options': {
            'tableName': 'users',
            'queryData': [userData.userId]
        }
    };
    returnData = await databaseController.queryDatabase(query);

    return returnData;
}

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser
};