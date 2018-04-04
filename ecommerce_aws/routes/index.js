var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SmartVendas' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('./auth/login', { title: 'Login'});
});

/* POST login page. */
router.post('/login', function(req, res, next) {
  res.redirect('/');
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('./auth/register', { title: 'Cadastro' });
});

/* GET products page. */
router.get('/products', function(req, res, next) {
  res.render('./products/index', { title: 'Produtos'});
});

module.exports = router;
