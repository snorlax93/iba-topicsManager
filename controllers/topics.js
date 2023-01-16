const databaseController = require('./database');
const commonHelper = require('../helpers/common');


/**
 * method: createTopic
 * params: array: [topidData]
 * description: adds the topic data to the database
 * returns: { data: null, statusCode : string, statusMessage : string }
 */

const createTopic = async (topicData) => {
    let returnData = { data: null, statusCode: null, statusMessage: null };
    let validateInputs = validateTopic(topicData);

    if (validateInputs.statusCode == 'Success') {
        topicData.reqBody.completed = topicData.reqBody.completed ? 'TRUE' : 'FALSE';

        delete topicData.reqBody.submit;
        topicData.reqBody['createdAt'] = await commonHelper.getDateTime();
        topicData.reqBody['updatedAt'] = await commonHelper.getDateTime();

        let query = {
            'queryString': 'INSERT INTO topics (topicName, topicUrl, createdBy, plannedEpisode, completed, createdAt, updatedAt) value (?, ?, ?, ?, ?, ?, ?)',
            'options': {
                'tableName': 'topics',
                'queryData': commonHelper.setToArray(topicData.reqBody)
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
 * method: validateTopic
 * params: array: [topidData]
 * description: confirms if required fields are present and not null/empty strings
 * returns: { statusCode : string, statusMessage : string }
 */

const validateTopic = (topicData) => {
    let returnData = {
        statusCode: 'Success',
        statusMessage: null
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

    return returnData;
}

/**
 * method: getTopics
 * params: object: {completed: boolean, topicId: int}
 * description: get all topics based on flag (completed)
 * returns: { statusCode : string, statusMessage : string }
 */

const getTopics = async (flags) => {
    let queryString = 'SELECT * FROM topics WHERE completed = \'FALSE\'';;
    let returnData = { data: null, statusCode: null, statusMessage: null };

    if (flags) {
        if (flags.completed) {queryString = 'SELECT * FROM topics WHERE (completed = \'TRUE\' OR completed = \'FALSE\')';}
        if (flags.singleTopic) {queryString = 'SELECT * FROM topics WHERE (completed = \'TRUE\' OR completed = \'FALSE\')';}
        if (flags.topicId) {queryString += ' AND topicId = \''+flags.topicId+'\'';}
    }

    let query = {
        'queryString': queryString,
        'options': {
            'tableName': 'topics',
            'queryData': null
        }
    };

    returnData = await databaseController.queryDatabase(query);

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
    let validateInputs = validateTopic(topicData);

    if (validateInputs.statusCode == 'Success') {
        topicData.reqBody['topicId'] = topicData.topicId;
        let query = {
            'queryString': 'UPDATE topics SET topicName=?, topicUrl=?, createdBy=?, plannedEpisode=?, completed=? WHERE topicId=?',
            'options': {
                'tableName': 'topics',
                'queryData': commonHelper.setToArray(topicData.reqBody)
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
 * method: deleteTopic
 * params: object: {topicId: int}
 * description: deletes the topic based on topicId
 * returns: { data: obj, statusCode : string, statusMessage : string }
 */

const deleteTopic = async (topicData) => {
    let returnData = { data: null, statusCode: null, statusMessage: null };

    let query = {
        'queryString': 'DELETE FROM topics WHERE topicId=?',
        'options': {
            'tableName': 'topics',
            'queryData': [topicData.topicId]
        }
    };
    returnData = await databaseController.queryDatabase(query);

    return returnData;
}

module.exports = {
    createTopic,
    getTopics,
    updateTopic,
    deleteTopic
};