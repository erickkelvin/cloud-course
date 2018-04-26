var express = require('express');
var router = express.Router();
var Log = require('../../helpers/log');

/* GET logs page. */
router.get('/', function(req, res, next) {
  Log.getAll(logs => {
    res.render('./admin/logs', { title: 'Logs', logs: logs, session: req.session });
  }, error => {
    console.log('error on retrieving logs');
  });
});

module.exports = router;