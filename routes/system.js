var express = require('express');
var router = express.Router();
const logger = require('../controllers/logging');
const commonHelper = require('../helpers/common');

/**
 * main route: /system/
 */

/**
 * route: /complete/
 * method: GET
 * description: to kill server (used in pipeline should not exist in production)
 */

router.get('/complete/:status/:prNum/', async function (req, res, next) {
  const status = req.params.status;
  const prNum = `https://github.com/snorlax93/iba-topicsManager/pull/${req.params.prNum}/;`
  
  await logger.setLoggingInfo('systemRoute', 2, 'info', 'prrev', { 'stats': status, 'prNum': prNum }, { 'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl });

  switch (status) {
    case 'pass':
      process.exit(0);
      break;
    case 'fail':
      process.exit(1);
      break;
    default:
      process.exit(1);
  }
});

module.exports = router;
