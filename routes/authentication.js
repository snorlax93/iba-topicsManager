var express = require('express');
var router = express.Router();
const logger = require('../controllers/logging');
const commonHelper = require('../helpers/common');

/**
 * main route: /authentication/
 */

/**
 * route: /signin/
 * method: GET
 * description: to view the signin page
 */

router.get('/signin/', async function(req, res, next) {
    await logger.setLoggingInfo('authenticationRoute', 0, 'info', '3000', 'null', {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});
    res.render('index', { title: 'Express' });
  });

  /**
   * route: /signin/
   * method: POST
   * description: to attempt to login user
   */
  
  router.post('/signin/', async function(req, res, next) {
    await logger.setLoggingInfo('authenticationRoute', 0, 'info', '3000', 'null', {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});
    res.render('index', { title: 'Express' });
  });
  
module.exports = router;
