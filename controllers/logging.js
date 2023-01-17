const fs = require('fs');
const commonHelper = require('../helpers/common');

/**
 * method: logEvent
 * params: logString object : string
 * description: writes error to resource
 * returns: N/A
 */

const logEvent = async (logString) => {
    try {
        let date = await commonHelper.getDate(),
            data = `${logString}\n`,
            path = `./logs/${date}.log`;

        return new Promise(async (resolve, reject) => {
            fs.writeFile(path, data, {flag: "a+"}, (err) => {
                if (err) {
                    return console.error(err);
                }
                return resolve();
            })

        });
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
    let dateTime = await commonHelper.getDateTime();
    const logString = `LOG: [${dateTime}] - ${getSeverity[eventObj.eventSeverity]} | ${eventObj.eventName} - ${getEventType[eventObj.eventType]} occurred: ${getEventCode[eventObj.eventCode]} | controllerMessage: ${eventObj.eventData}. userDetails { user: ${eventObj.userDetails.userId}, IP: ${eventObj.userDetails.userIpAddress}, host: ${eventObj.userDetails.reqHost} }`;
    await logEvent(logString);
}

/**
 * method: setLoggingInfo
 * params: multiple
 * description: fields that can be consumed from app to log data 
 * returns: N/A
 */

const setLoggingInfo = async (eventName, eventType, eventSeverity, eventCode, eventData, userDetails) => {
    const eventObj = { eventName, eventType, eventSeverity, eventCode, eventData, userDetails };
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
    error: 'ERROR'
}

/**
 * method: getEventType
 * enum: multiple
 * description: customize the error codes and messages the app can support
 * returns: N/A
 */

const getEventType = {
    // 0 - 999 :General App
    0: 'Main Route Accessed',
    1: 'Move between routes',
    2: 'Accessing system route',
    3: 'Database Transaction',
    4: 'Controller Function',
}

const getEventCode = {

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
    1009: 'Rendering topic view: getTopics (view all)',
    '1009_A': 'Rendering topic view: getTopics (view topicId)',
    '1009_B': 'Rendering topic view: getTopics (view topicId edit)',
    1010: 'Calling topic controller: updateTopic',
    1011: 'Rendering topic view: updateTopic',
    1012: 'Calling topic controller: createTopic',
    1013: 'Rendering topic view: createTopic',
    1014: 'Calling topic controller: deleteTopic',
    1015: 'Rendering topic view: deleteTopic',
    1016: 'Rendering topic view: noControllerMethod (showAddTable: true)',
    1017: 'Rerouting topic view: /topics/view/all/',
    1018: 'Preparing createTopic query',
    1019: 'Returning createTopic',
    1020: 'Validating topicData',
    1021: 'Preparing getTopics query',
    1022: 'Returning getTopics',
    1023: 'Preparing updateTopic query',
    1024: 'Returning updateTopic',
    1023: 'Preparing deleteTopic query',
    1024: 'Returning deleteTopic',

    // 2000 - 2999 : user logging
    2000: 'Add a user',
    2001: 'View a user',
    2002: 'Edit a user',
    2003: 'Delete a user',
    2004: 'View all users',
    2005: 'View a user',
    2006: 'Validate user data',
    2007: 'Calling user controller: getUsers',
    2008: 'Rendering user view: getUsers (view all)',
    '2008_A': 'Rendering user view: getUser (view userId)',
    '2008_B': 'Rendering user view: getUsers (view userId edit)',
    2009: 'Calling user controller: updateUser',
    2010: 'Rendering user view: updateUser',
    2011: 'Calling user controller: createUser',
    2012: 'Rendering user view: createUser',
    2013: 'Calling user controller: deleteUser',
    2014: 'Rendering user view: deleteUser',
    2015: 'Rendering user view: noControllerMethod (showAddTable: true)',
    2016: 'Rerouting user view: /user/view/all/',
    2017: 'Preparing createTopic query',
    2018: 'Returning createTopic',
    2019: 'Validating userData',
    2020: 'Preparing getUsers query',
    2021: 'Returning getUsers',
    2022: 'Preparing updateUser query',
    2023: 'Returning updateUser',
    2024: 'Preparing deleteUser query',
    2025: 'Returning deleteUser',

    // 3000 - 3999 : index
    3000: 'Rendering index',

    // 4000 - 4999 : database
    4000: 'State before transaction',
    4001: 'State after transaction',
    4002: 'State after transaction (return)',
    4003: 'State after transaction (database connection closed)'
}


module.exports = {
    setLoggingInfo
};