var express = require('express');
var router = express.Router();

/**
 * main route: /system/
 */

/**
 * route: /reboot/
 * method: GET
 * description: to kill server (used in pipeline should not exist in production)
 */

router.get('/reboot/', function (req, res, next) {
  process.exit(1);
});

module.exports = router;
