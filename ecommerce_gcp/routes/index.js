var express = require('express');
var router = express.Router();
var { ProductService }  = require('../services/products');

/* GET home page. */
router.get('/', function(req, res, next) {
  ProductService.getAll((result) => {
    res.render('index', { title: 'SmartVendas', products: result, session: req.session });
  }, (err) => {
    console.log('error on getAll');
    console.error(err);
  });
});

/* GET sale page. */
router.get('/sale', function(req, res, next) {
  ProductService.getAll((result) => {
    res.render('index', { title: 'Promoções', products: result, session: req.session });
  }, (err) => {
    console.log('error on getAll');
    console.error(err);
  });
});

/* GET products page. */
router.get('/products', function(req, res, next) {
  ProductService.getAll((result) => {
    res.render('index', { title: 'Produtos', products: result, session: req.session });
  }, (err) => {
    console.log('error on getAll');
    console.error(err);
  });
});

module.exports = router;
