var express = require('express');
var router = express.Router();
const controller = require("../controllers/users");
const logger = require('../controllers/logging');
const commonHelper = require('../helpers/common');

/**
 * main route: /api/usersmanager/users/
 */

/**
 * route: /view/all
 * method: GET
 * description: is to bring back all of the users in the database
 */

router.get('/view/all/', async function (req, res, next) {
    let flags = {
        'userId': null
    }

    // will have to implement fully
    // logger.setLoggingInfo('usersController', 1, 'info', '2007', flags, {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl})

    const controllerResponse = await controller.getUsers(flags);
    res.render('users', {
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
* description: is to bring back the user details per userId.
* data: [{user}]
*/

router.get('/view/:userId/', async function (req, res, next) {
    let flags = {
        'userId': req.params.userId
    }
    const controllerResponse = await controller.getUsers(flags);
    res.render('users', {
        title: 'View userId',
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
* description: is to bring back the user details per userId. (edit param is for flag in template)
* data: [{user}]
*/

router.get('/view/:userId/edit/', async function (req, res, next) {
    let flags = {
        'userId': req.params.userId
    }
    const controllerResponse = await controller.getUsers(flags);
    res.render('users', {
        title: 'View userId',
        data: controllerResponse.data,
        statusCode: controllerResponse.statusCode,
        statusMessage: controllerResponse.statusMessage,
        edit: true,
        showViewSingle: true
    });
});

/**
* route: /view/123/edit/
* method: POST
* description: is to post user data to database per userId from req (edit param is for flag in template)
* data: [{formData}]
* TODO: Handle negative cases: handle controllerResponse errors
*/

router.post('/view/:userId/edit/', async function (req, res, next) {
    let userData = {
        'userId': req.params.userId,
        'reqBody': {
            'userName': req.body.userName,
            'emailAddress': req.body.emailAddress,
            'password': req.body.password,
            'refreshToken': req.body.refreshToken,
            'userLevel': req.body.userLevel
        }
    }

    const controllerResponse = await controller.updateUser(userData);
    res.render('users', {
        title: 'View Single',
        data: controllerResponse.data ? controllerResponse.data : userData.reqBody,
        statusCode: controllerResponse.statusCode,
        statusMessage: controllerResponse.statusMessage,
        showErrorMessages: controllerResponse.statusCode != 'Success' ? true : false,
        editPost: true
    });
});

/**
 * route: /add/
 * method: GET
 * description: is to show form to add single user
 * data: N/A
 */

router.get('/add/', function (req, res, next) {
    res.render('users', {
        title: 'Add',
        showAddTable: true
    });
});

/**
 * route: /add/
 * method: POST
 * description: is to add single user to the database
 * data [userData] or {errorMsg:msg}
 * data: N/A
 */

router.post('/add/', async function (req, res, next) {
    let userData = {
        'userId': null,
        'reqBody': req.body
    }
    const controllerResponse = await controller.createUser(userData);
    res.render('users', {
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
 * description: is to delete user data to database per topicId from req
 */

router.get('/delete/:topicId/', async function (req, res, next) {
    let userData = {
        'userId': req.params.topicId
    }
    const controllerResponse = await controller.deleteUser(userData);
    if (controllerResponse.statusCode == 'Success') {
        res.redirect('/api/topicsmanager/users/view/all/');
    } else {
        res.render('users', {
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
