var express = require('express');
var router = express.Router();
const controller = require('../controllers/topics');
const logger = require('../controllers/logging');
const commonHelper = require('../helpers/common');


/**
 * main route: /api/topicsmanager/topics/
 */


/**
 * route: /view/all
 * method: GET
 * description: is to bring back all of the topics in the database
 */

router.get('/view/all/', async function (req, res, next) {
    
    let flags = {
        'completed': req.query.view == 'all' ? true : false,
        'topicId': null,
        'singleTopic': false
    }

    await logger.setLoggingInfo('topicsController', 1, 'info', '1008', JSON.stringify(flags), {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});

    const controllerResponse = await controller.getTopics(flags);
    
    await logger.setLoggingInfo('topicsController', 1, 'info', '1009', JSON.stringify(flags), {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});
    
    res.render('topics', {
        title: 'View All',
        data: controllerResponse.data,
        statusCode: controllerResponse.statusCode,
        statusMessage: controllerResponse.statusMessage,
        showErrorMessages: controllerResponse.statusCode != 'Success' ? true : false,
        showViewTable: true
    });
});

/**
 * route: /view/123/
 * method: GET
 * description: is to bring back the topic details per topicId.
 */

router.get('/view/:topicId/', async function (req, res, next) {
    
    let flags = {
        'completed': req.query.view == 'all' ? true : false,
        'topicId': req.params.topicId,
        'singleTopic': true
    }

    await logger.setLoggingInfo('topicsController', 1, 'info', '1008', JSON.stringify(flags), {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});
    
    const controllerResponse = await controller.getTopics(flags);
    
    await logger.setLoggingInfo('topicsController', 1, 'info', '1009_A', JSON.stringify(flags), {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});
    
    res.render('topics', {
        title: 'View topicId',
        data: controllerResponse.data,
        statusCode: controllerResponse.statusCode,
        statusMessage: controllerResponse.statusMessage,
        showErrorMessages: controllerResponse.statusCode != 'Success' ? true : false,
        edit: false,
        showViewSingle: true
    });
});

/**
 * opt route: /view/123/edit/ 
 * method: GET
 * description: is to bring back the topic details per topicId
 */

router.get('/view/:topicId/edit/', async function (req, res, next) {
    
    let flags = {
        'completed': req.query.view == 'all' ? true : false,
        'topicId': req.params.topicId,
        'singleTopic': true
    }
    
    await logger.setLoggingInfo('topicsController', 1, 'info', '1008', flags, {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});

    const controllerResponse = await controller.getTopics(flags);
    
    await logger.setLoggingInfo('topicsController', 1, 'info', '1009_B', flags, {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});
    
    res.render('topics', {
        title: 'View topicId',
        data: controllerResponse.data,
        statusCode: controllerResponse.statusCode,
        statusMessage: controllerResponse.statusMessage,
        showErrorMessages: controllerResponse.statusCode != 'Success' ? true : false,
        edit: true
    });
});

/**
 * route: /view/123/edit/
 * method: POST
 * description: is to post topic data to database per topicId
 */

router.post('/view/:topicId/edit/', async function (req, res, next) {
    
    let topicData = {
        'topicId': req.params.topicId,
        'reqBody': {
            'topicName': req.body.topicName || '',
            'topicUrl': req.body.topicUrl || '',
            'createdBy': req.body.createdBy || '',
            'plannedEpisode': req.body.plannedEpisode,
            'completed': req.body.completed ? 'TRUE' : 'FALSE'
        }
    }
    
    await logger.setLoggingInfo('topicsController', 1, 'info', '1010', topicData, {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});

    const controllerResponse = await controller.updateTopic(topicData);
    
    await logger.setLoggingInfo('topicsController', 1, 'info', '1011', JSON.stringify(topicData), {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});

    res.render('topics', {
        title: 'View Single',
        data: controllerResponse.data ? controllerResponse.data : topicData.reqBody,
        statusCode: controllerResponse.statusCode,
        statusMessage: controllerResponse.statusMessage,
        showErrorMessages: controllerResponse.statusCode != 'Success' ? true : false,
        editPost: true
    });
});


/**
 * route: /add/
 * method: GET
 * description: is to show form to add single topic
 */

router.get('/add/', async function (req, res, next) {
    await logger.setLoggingInfo('topicsController', 1, 'info', '1016', 'null', {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});
    res.render('topics', {
        title: 'Add',
        showAddTable: true
    });
});

/**
 * route: /add/
 * method: POST
 * description: is to add single topic to the database
 */

router.post('/add/', async function (req, res, next) {
    
    let topicData = {
        'topicId': null,
        'reqBody': req.body
    }
    
    await logger.setLoggingInfo('topicsController', 1, 'info', '1012', JSON.stringify(topicData), {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});

    const controllerResponse = await controller.createTopic(topicData);
    
    await logger.setLoggingInfo('topicsController', 1, 'info', '1013', JSON.stringify(topicData), {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});
    
    res.render('topics', {
        title: 'Add',
        data: controllerResponse.data,
        statusCode: controllerResponse.statusCode,
        statusMessage: controllerResponse.statusMessage,
        showErrorMessages: controllerResponse.statusCode != 'Success' ? true : false,
        showAddTable: true
    });
});


/**
 * route: /delete/123/
 * method: GET
 * description: is to delete topic data to database per topicId from req
 */

router.get('/delete/:topicId/', async function (req, res, next) {
    let topicData = {
        'topicId': req.params.topicId
    }
    const controllerResponse = await controller.deleteTopic(topicData);
    if (controllerResponse.statusCode == 'Success') {
        await logger.setLoggingInfo('topicsController', 1, 'info', '1017', JSON.stringify(topicData), {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});
        res.redirect('/api/topicsmanager/topics/view/all/');
    } else {
        await logger.setLoggingInfo('topicsController', 1, 'info', '1015', JSON.stringify(topicData), {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});
        res.render('topics', {
            title: 'View topicId',
            data: controllerResponse.data,
            statusCode: controllerResponse.statusCode,
            statusMessage: controllerResponse.statusMessage,
            showErrorMessages: controllerResponse.statusCode != 'Success' ? true : false,
            edit: false,
            showViewSingle: true
        });
    }
});

module.exports = router;