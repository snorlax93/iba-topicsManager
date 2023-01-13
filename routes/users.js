var express = require('express');
var router = express.Router();
const controller = require("../controllers/users");

/**
 * main route: /api/usersmanager/users/
 */

/**
 * route: /view/all
 * method: GET
 * description: is to bring back all of the users in the database
 * data: [{user}, {user}]
 */

router.get('/view/all/', async function (req, res, next) {
  const controllerResponse = await controller.getUsers();
  res.render('users', {
      title: 'View All',
      data: controllerResponse,
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
  const controllerResponse = await controller.getUser(req.params.userId);
  res.render('users', {
      title: 'View userId',
      data: controllerResponse,
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
  const controllerResponse = await controller.getUser(req.params.userId);
  res.render('users', {
      title: 'View userId',
      data: controllerResponse,
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
  const formData = {
      'userName': req.body.userName,
      'emailAddress': req.body.emailAddress,
      'password': req.body.password,
      'refreshToken': req.body.refreshToken,
      'userLevel': req.body.userLevel
  };

  const controllerResponse = await controller.updateUser(req.params.userId, formData);
  res.render('users', {
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
    const controllerResponse = await controller.createUser(req.body);
    res.render('users', {
        title: 'Add',
        data: controllerResponse,
        showErrorMessages: controllerResponse.errorMsg ? controllerResponse.errorMsg : null,
        showAddTable: true
    });
});

module.exports = router;
