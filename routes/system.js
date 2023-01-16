var express = require('express');
var router = express.Router();

/**
 * main route: /system/
 */

/**
 * route: /complete/
 * method: GET
 * description: to kill server (used in pipeline should not exist in production)
 */

router.get('/complete/:status/:prNum', function (req, res, next) {
  const status = req.params.status;
  const prLink = req.params.prNum;

  // will have to implement fully
  logger.setLoggingInfo('systemRoute', 2, 'info', {'stats': status, 'prNum': prNum}, flags, {'userId': null, 'userIpAddress': await commonHelper.getIPAddress('https://api.ipify.org/?format=json'), 'reqHost': req.originalUrl})

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
