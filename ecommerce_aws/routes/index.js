var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SmartVendas', session: req.session });
});

/* GET products page. */
router.get('/products', function(req, res, next) {
  res.render('./products/index', { title: 'Produtos', session: req.session });
});

module.exports = router;
