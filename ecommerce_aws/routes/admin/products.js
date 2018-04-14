var express = require('express');
var router = express.Router();
var { ProductService }  = require('../../services/products');
var { uploadPhoto }  = require('../../helpers/utils');
var Log = require('../../helpers/log');

/* GET products listing. */
router.get('/', function(req, res, next) {
  if (req.query.search) {
    ProductService.search(req.query.search, (result) => {
      console.log(result);
      Log.save(req.session.user.login, 'SEARCH', 'PRODUCT', req.query.search);
      res.render('./admin/products/index', { title:'Produtos', products: result, query: req.query.search, session: req.session });
    }, (err) => {
      console.log('error on search');
      console.error(err);
    });
  }
  else {
    ProductService.getAll((result) => {
      Log.save(req.session.user.login, 'LIST', 'PRODUCT', null);
      res.render('./admin/products/index', { title:'Produtos', products: result, query: null, session: req.session });
    }, (err) => {
      console.log('error on getAll');
      console.error(err);
    });
  }
});

/* GET new product page. */
router.get('/new', function(req, res, next) {
  res.render('./admin/products/form', { title:'Adicionar novo produto', action: 'create', product: {}, session: req.session });
});

/* POST create product */
router.post('/create', uploadPhoto.single('photo'), function(req, res, next) {
  const file = req.file ? req.file.location : '';
  ProductService.create(req.body, file, (result) => {
    Log.save(req.session.user.login, 'INSERT', 'PRODUCT', req.body.name);
    res.redirect('/admin/products');
  }, (err) => {
    console.log('error on create');
    console.error(err);
  });
});

/* GET edit product page. */
router.get('/edit/:id', function(req, res, next) {
  ProductService.get(req.params.id, (result) => {
    res.render('./admin/products/form', { title:'Editar produto', action: 'update/' + req.params.id, product: result, session: req.session });
  }, (err) => {
    console.log('error on retrieving product');
    console.error(err);
  });
});

/* POST update product */
router.post('/update/:id', uploadPhoto.single('photo'), function(req, res, next) {
  const file = req.file ? req.file.location : '';
  ProductService.update(req.params.id, req.body, file, (result) => {
    Log.save(req.session.user.login, 'ALTER', 'PRODUCT', req.body.name);
    res.redirect('/admin/products');
  }, (err) => {
    console.log('error on update');
    console.error(err);
  });
});

/* GET delete product */
router.get('/delete/:id', function(req, res, next) {
  ProductService.remove(req.params.id, (result) => {
    Log.save(req.session.user.login, 'DELETE', 'PRODUCT', req.params.id);
    res.redirect('/admin/products');
  }, (err) => {
    console.log('error on delete');
    console.error(err);
  });
});

/* GET product page */
router.get('/:id', (req, res) => {
  ProductService.get(id, (result) => {
    Log.save(req.session.user.login, 'VIEW', 'PRODUCT', result.name);
    res.redirect('/show', { product: result });
  }, (error) => {
    console.log(error);
    res.redirect('/products');
  });

});

module.exports = router;
