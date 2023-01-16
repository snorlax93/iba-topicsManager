var express = require('express');
var router = express.Router();
const logger = require('../controllers/logging');
const commonHelper = require('../helpers/common');

/* GET home page. */
router.get('/', async function(req, res, next) {
  await logger.setLoggingInfo('indexRoute', 0, 'info', '3000', 'null', {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl});
  res.render('index', { title: 'Express' });
});

module.exports = router;
