var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SmartVendas', session: req.session });
});

/* GET sale page. */
router.get('/sale', function(req, res, next) {
  res.render('sale', { title: 'Promoções', session: req.session });
});

/* GET products page. */
router.get('/products', function(req, res, next) {
  res.render('products', { title: 'Produtos', session: req.session });
});

module.exports = router;
