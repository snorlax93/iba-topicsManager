const fs = require('fs');
const mariadb = require('./database');
const commonHelper = require('../helpers/common');

/**
 * method: logEvent
 * params: logString object : string
 * description: writes error to resource
 * returns: N/A
 */

const logEvent = async (logString) => {
    try {
        let date = await commonHelper.getDate();
        // await fs.writeFile(`./logs/${date}.log`, logString);
        let stream = fs.createWriteStream(`./logs/${date}.log`, {flags: 'a'});
        stream.write(`${logString}\n`);
        stream.end();
        
    /**
     * SQL Update for database v1.1 (future LA)
     * let query = {
            'options': {
                'queryType': 'INSERT INTO'
                'tableName': 'logs',
                'columns': 'eventDateTime, eventSeverity, eventCode, eventType, eventData, userId, userIpAddress, reqHost',
                'values': '?, ?, ?, ?, ?, ?, ?'
                'queryData': commonHelper.setToArray(topicData.reqBody)
            }
        };

        returnData = await databaseController.queryDatabase(query);
     */
    } catch (error) {
        console.log(error);
    }
};


/**
 * method: generateEvent
 * params: eventObj object : { eventName: string, eventType: string, eventSeverity: enum, eventCode: string, eventData: string, userDetails: { userId: int, userIpAddress: string, reqHost: string } }
 * description: generates the string for the log
 * returns: N/A
 */

const generateEvent = async (eventObj) => {
    const logString = `LOG: [${await commonHelper.getDateTime()}] - ${getSeverity[eventObj.eventSeverity]} | ${eventObj.eventCode} - ${getErrorMessage[eventObj.eventType]} occurred: ${getErrorMessage[eventObj.eventCode]} | controllerMessage: ${JSON.stringify(eventObj.eventData)}. userDetails { user: ${eventObj.userDetails.userId}, IP: ${eventObj.userDetails.userIpAddress}, host: ${eventObj.userDetails.reqHost} }`;
    await logEvent(logString);
}

/**
 * method: setLoggingInfo
 * params: multiple
 * description: fields that can be consumed from app to log data 
 * returns: N/A
 */

const setLoggingInfo = async (eventName, eventType, eventSeverity, eventCode, eventData, userDetails) => {
    const eventObj = {eventName, eventType, eventSeverity, eventCode, eventData, userDetails};
    await generateEvent(eventObj);
}

/**
 * method: getSeverity
 * enum: multiple
 * description: customize the severities the app supports
 * returns: N/A
 */

const getSeverity = {
    info: 'INFO',
    error: 'ERROR',
    trans: 'TRANSACTION',
    prrev: 'PR-REVIEW'
}

/**
 * method: getErrorMessage
 * enum: multiple
 * description: customize the error codes and messages the app can support
 * returns: N/A
 */

const getErrorMessage = {
    // 0 - 999 :General App
    0: 'Main Route Accessed',
    1: 'Move between routes',


    // 1000 - 1999 : topic logging
    1000: 'Add a topic',
    1001: 'View a topic',
    1002: 'Edit a topic',
    1003: 'Delete a topic',
    1004: 'View all non-completed topics',
    1005: 'View a completed topic',
    1006: 'View a topic',
    1007: 'Validate topic data',
    1008: 'Calling topic controller: getTopics',
    1009: 'Rendering topic view: getTopics',
    1010: 'Calling topic controller: updateTopic',
    1011: 'Rendering topic view: updateTopic',
    1012: 'Calling topic controller: createTopic',
    1013: 'Rendering topic view: createTopic',
    1014: 'Calling topic controller: deleteTopic',
    1015: 'Rendering topic view: deleteTopic',

    // 2000 - 2999 :

    // 3000 - 3999 :
}


module.exports = {
    setLoggingInfo
};