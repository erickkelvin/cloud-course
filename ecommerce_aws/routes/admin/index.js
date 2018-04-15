var express = require('express');
var router = express.Router();

/* GET admin page. */
router.get('/', function(req, res, next) {
  res.render('./admin/index', { title: 'Painel de administrador', session: req.session }); 
});

module.exports = router;