var express = require('express');
var router = express.Router();
var { ProductService }  = require('../../services/products');
var { upload }  = require('../../helpers/utils');
var Log = require('../../helpers/log');

/* GET products listing. */
router.get('/', function(req, res, next) {
  if (req.query.search) {
    ProductService.search(req.query.search, (result) => {
      console.log(result);
      res.render('./admin/products/index', { title:'Produtos', products: result, query: req.query.search });
    }, (err) => {
      console.log('error on search');
      console.error(err);
    });
  }
  else {
    ProductService.listAll((result) => {
      var user = req.cookies['ecommerce-user'];
      console.log('Cookies: ', user);

      // Log.save(product.id, 'LIST', 'PRODUCT', null);
      res.render('./admin/products/index', { title:'Produtos', products: result, query: null });
    }, (err) => {
      console.log('error on listAll');
      console.error(err);
    });
  }
});

/* GET new product page. */
router.get('/new', function(req, res, next) {
  res.render('./admin/products/form', { title:'Adicionar novo produto', action: 'create', product: {} });
});

/* POST create product */
router.post('/create', upload.single('photo'), function(req, res, next) {
  const file = req.file ? req.file.location : '';
  ProductService.create(req.body, file, (result) => {
    res.redirect('/admin/products');
  }, (err) => {
    console.log('error on create');
    console.error(err);
  });
});

/* GET edit product page. */
router.get('/edit/:id', function(req, res, next) {
  ProductService.get(req.params.id, (result) => {
    res.render('./admin/products/form', { title:'Editar produto', action: 'update/' + req.params.id, product: result });
  }, (err) => {
    console.log('error on retrieving product');
    console.error(err);
  });
});

/* POST update product */
router.post('/update/:id', upload.single('photo'), function(req, res, next) {
  const file = req.file ? req.file.location : '';
  ProductService.update(req.params.id, req.body, file, (result) => {
    res.redirect('/admin/products');
  }, (err) => {
    console.log('error on update');
    console.error(err);
  });
});

/* GET delete product */
router.get('/delete/:id', function(req, res, next) {
  ProductService.remove(req.params.id, (result) => {
    res.redirect('/admin/products');
  }, (err) => {
    console.log('error on delete');
    console.error(err);
  });
});

/* GET product page */
router.get('/:id', (req, res) => {
  ProductService.get(id, (result) => {
    Log.save('VIEW', 'Product', data.login);
    res.redirect('/show', { product: result });
  }, (error) => {
    console.log(error);
    res.redirect('/products');
  });

});

module.exports = router;
