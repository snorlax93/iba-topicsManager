var express = require('express');
var router = express.Router();
const controller = require("../controllers/topics");


/**
 * main route: /api/topicsmanager/topics/
 */


/**
 * route: /view/all
 * method: GET
 * description: is to bring back all of the topics in the database
 * data: [{topic}, {topic}]
 */

router.get('/view/all/', async function (req, res, next) {
    const controllerResponse = await controller.getTopics();
    res.render('topics', {
        title: 'View All',
        data: controllerResponse,
        showViewTable: true
    });
});

/**
 * route: /view/123/
 * method: GET
 * description: is to bring back the topic details per topicId.
 * data: [{topic}]
 */

router.get('/view/:topicId/', async function (req, res, next) {
    const controllerResponse = await controller.getTopic(req.params.topicId);
    res.render('topics', {
        title: 'View topicId',
        data: controllerResponse,
        edit: false,
        showViewSingle: true
    });
});

/**
 * opt route: /view/123/edit/ 
 * method: GET
 * description: is to bring back the topic details per topicId. (edit param is for flag in template)
 * data: [{topic}]
 */

router.get('/view/:topicId/edit/', async function (req, res, next) {
    const controllerResponse = await controller.getTopic(req.params.topicId);
    res.render('topics', {
        title: 'View topicId',
        data: controllerResponse,
        edit: true,
        showViewSingle: true
    });
});

/**
 * route: /view/123/edit/
 * method: POST
 * description: is to post topic data to database per topicId from req (edit param is for flag in template)
 * data: [{formData}]
 * TODO: Handle negative cases: handle controllerResponse errors
 */

router.post('/view/:topicId/edit/', async function (req, res, next) {
    const formData = {
        'topicName': req.body.topicName,
        'topicUrl': req.body.topicUrl,
        'createdBy': req.body.createdBy,
        'plannedEpisode': req.body.plannedEpisode,
        'completed': req.body.completed ? "TRUE" : "FALSE"
    };
    const controllerResponse = await controller.updateTopic(req.params.topicId, formData);
    res.render('topics', {
        title: 'View Single',
        data: [formData, {
            "statusMsg": controllerResponse ? "Successfully Edited" : "There was an issue editing"
        }],
        editPost: true
    });
});


/**
 * route: /add/
 * method: GET
 * description: is to show form to add single topic
 * data: N/A
 */

router.get('/add/', function (req, res, next) {
    res.render('topics', {
        title: 'Add',
        showAddTable: true
    });
});

/**
 * route: /add/
 * method: POST
 * description: is to add single topic to the database
 * data [topicData] or {errorMsg:msg}
 * data: N/A
 */

router.post('/add/', async function (req, res, next) {
    const controllerResponse = await controller.createTopic(req.body);
    res.render('topics', {
        title: 'Add',
        data: controllerResponse,
        showErrorMessages: controllerResponse.errorMsg ? controllerResponse.errorMsg : null,
        showAddTable: true
    });
});


/**
 * route: /delete/123/
 * method: GET
 * description: is to delete topic data to database per topicId from req (edit param is for flag in template)
 * data: [{formData}]
 */

router.get('/delete/:topicId/', async function (req, res, next) {
    const controllerResponse = await controller.deleteTopic(parseInt(req.params.topicId));
    if (controllerResponse) {
        res.redirect('/api/topicsmanager/topics/view/all/');
    } else {
        res.render('topics', {
            title: 'View topicId',
            data: await controller.getTopic(parseInt(req.params.topicId)),
            showErrorMessages: 'Failed to remove topic. See logs!',
            edit: false,
            showViewSingle: true
        });
    }
});

module.exports = router;