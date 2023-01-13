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

router.get('/complete/', function (req, res, next) {
  process.exit(0);
});

module.exports = router;
