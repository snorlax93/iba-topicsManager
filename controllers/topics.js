const databaseController = require('./database');
const logger = require('../controllers/logging');
const commonHelper = require('../helpers/common');

/**
 * method: createTopic
 * params: array: [topidData]
 * description: adds the topic data to the database
 * returns: { data: null, statusCode : string, statusMessage : string }
 */

const createTopic = async (topicData) => {
    let returnData = { data: null, statusCode: null, statusMessage: null };
    let validateInputs = await validateTopic(topicData);

    if (validateInputs.statusCode == 'Success') {
        topicData.reqBody.completed = topicData.reqBody.completed ? 'TRUE' : 'FALSE';

        delete topicData.reqBody.submit;
        topicData.reqBody['createdAt'] = await commonHelper.getDateTime();
        topicData.reqBody['updatedAt'] = await commonHelper.getDateTime();

        let query = {
            'options': {
                'tableName': 'topics',
                'method': 'INSERT INTO',
                'value': 'value (?, ?, ?, ?, ?, ?, ?)',
                'columns': '(topicName, topicUrl, createdBy, plannedEpisode, completed, createdAt, updatedAt) ',
                'queryData': commonHelper.setToArray(topicData.reqBody),
                'buildPattern': ['method', 'tableName', 'value']
            }
        };

        await logger.setLoggingInfo('topicsController', 4, 'info', '1018', query, {'userId': null, 'userIpAddress': null, 'reqHost': null});
        returnData = await databaseController.queryDatabase(query);
    } else {
        returnData.data = null;
        returnData.statusCode = validateInputs.statusCode;
        returnData.statusMessage = validateInputs.statusMessage;
    }

    await logger.setLoggingInfo('topicsController', 4, 'info', '1019', returnData, {'userId': null, 'userIpAddress': null, 'reqHost': null});
    return returnData;
};

/**
 * method: validateTopic
 * params: array: [topidData]
 * description: confirms if required fields are present and not null/empty strings
 * returns: { statusCode : string, statusMessage : string }
 */

const validateTopic = async (topicData) => {
    let returnData = {
        statusCode: 'Success',
        statusMessage: 'Successful validation'
    };

    if (topicData) {
        if (topicData.reqBody.topicName == null || topicData.reqBody.topicName == '') {
            returnData = {
                data: null,
                statusCode: 'Error',
                statusMessage: 'Need to enter a Topic Name'
            };
        } else if (topicData.reqBody.topicUrl == null || topicData.reqBody.topicUrl == '') {
            returnData = {
                data: null,
                statusCode: 'Error',
                statusMessage: 'Need to enter a Topic Url'
            };
        } else if ((topicData.reqBody.topicName == null || topicData.reqBody.topicName == '') && (topicData.reqBody.topicUrl == null || topicData.reqBody.topicUrl == '')) {
            returnData = {
                statusCode: 'Error',
                statusMessage: 'Need to include TopicUrl and TopicName'
            };
        }
    }

    await logger.setLoggingInfo('topicsController', 4, 'info', '1020', returnData, {'userId': null, 'userIpAddress': null, 'reqHost': null});
    return returnData;
}

/**
 * method: getTopics
 * params: object: {completed: boolean, topicId: int}
 * description: get all topics based on flag (completed)
 * returns: { statusCode : string, statusMessage : string }
 */

const getTopics = async (flags) => {
    let queryString = 'WHERE completed = \'FALSE\'';;
    let returnData = { data: null, statusCode: null, statusMessage: null };

    if (flags) {
        if (flags.completed) {queryString = 'WHERE (completed = \'TRUE\' OR completed = \'FALSE\') ';}
        if (flags.singleTopic) {queryString = 'WHERE (completed = \'TRUE\' OR completed = \'FALSE\') ';}
        if (flags.topicId) {queryString += 'AND topicId = \''+flags.topicId+'\'';}
    }

    let query = {
        'options': {
            'tableName': 'topics',
            'method': 'SELECT * FROM',
            'value': queryString,
            'queryData': null,
            'buildPattern': ['method', 'tableName','value']
        }
    };

    await logger.setLoggingInfo('topicsController', 4, 'info', '1021', query, {'userId': null, 'userIpAddress': null, 'reqHost': null});

    returnData = await databaseController.queryDatabase(query);

    await logger.setLoggingInfo('topicsController', 4, 'info', '1022', returnData, {'userId': null, 'userIpAddress': null, 'reqHost': null});

    return returnData;
};

/**
 * method: updateTopic
 * params: object: {topicId: int, reqBody: obj}
 * description: updates the topic based on topicId
 * returns: { data: obj, statusCode : string, statusMessage : string }
 */

const updateTopic = async (topicData) => {
    let returnData = { data: null, statusCode: null, statusMessage: null };
    let validateInputs = await validateTopic(topicData);

    if (validateInputs.statusCode == 'Success') {
        topicData.reqBody['topicId'] = topicData.topicId;
        let query = {
            'options': {
                'tableName': 'topics',
                'method': "UPDATE",
                'value': 'SET topicName=?, topicUrl=?, createdBy=?, plannedEpisode=?, completed=? WHERE topicId=?',
                'queryData': commonHelper.setToArray(topicData.reqBody),
                'buildPattern': ['method', 'tableName','value']
            }
        };
        await logger.setLoggingInfo('topicsController', 4, 'info', '1023', returnData, {'userId': null, 'userIpAddress': null, 'reqHost': null});
        returnData = await databaseController.queryDatabase(query);
    } else {
        returnData.data = null;
        returnData.statusCode = validateInputs.statusCode;
        returnData.statusMessage = validateInputs.statusMessage;
    }    

    await logger.setLoggingInfo('topicsController', 4, 'info', '1024', JSON.stringify(returnData), {'userId': null, 'userIpAddress': null, 'reqHost': null});
    return returnData;
};

/**
 * method: deleteTopic
 * params: object: {topicId: int}
 * description: deletes the topic based on topicId
 * returns: { data: obj, statusCode : string, statusMessage : string }
 */

const deleteTopic = async (topicData) => {
    let returnData = { data: null, statusCode: null, statusMessage: null };

    let query = {
        'queryString': '',
        'options': {
            'tableName': 'topics ',
            'method': 'DELETE FROM ',
            'value': 'topics WHERE topicId=?',
            'queryData': topicData.topicId,
            'buildPattern': ['method', 'value']
        }
    };
    
    await logger.setLoggingInfo('topicsController', 4, 'info', '1025', JSON.stringify(returnData), {'userId': null, 'userIpAddress': null, 'reqHost': null});

    returnData = await databaseController.queryDatabase(query);

    await logger.setLoggingInfo('topicsController', 4, 'info', '1026', JSON.stringify(returnData), {'userId': null, 'userIpAddress': null, 'reqHost': null});

    return returnData;
}

module.exports = {
    createTopic,
    getTopics,
    updateTopic,
    deleteTopic
};