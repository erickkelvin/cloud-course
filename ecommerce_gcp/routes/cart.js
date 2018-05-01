var express = require('express');
var router = express.Router();
var { CartService } = require('../services/cart');
var { ProductService } = require('../services/products');

items = [];

router.post('/add/:id', (req, res, next) => {
  if (req.session.cart) {
    var items = req.session.cart;
    
    var itsNew = true;
    if (items.length > 0) {
      itsNew = true;
      items.forEach(item => {
        if (item.product.id == req.params.id && item.quantity < item.product.quantity) {
          item.quantity += 1;
          itsNew = false;
        }
      });
    }

    if (itsNew) {
      items.push({ product: JSON.parse(req.body.product), quantity: 1 });
    }

    req.session.cart = items;
  } else {
    req.session.cart = [{ product: JSON.parse(req.body.product), quantity: 1 }];
  }
  res.redirect('/cart');
});

router.get('/add/:id', (req, res, next) => {
  var items = req.session.cart;
  if (items.length > 0) {
    items.forEach(item => {
      if (item.product.id == req.params.id && item.quantity < item.product.quantity) {
        item.quantity += 1;
      }
    });
  }
  req.session.cart = items;
  res.redirect('/cart');
});

router.get('/delete/:id', (req, res, next) => {
  if (req.session.cart) {
    var items = req.session.cart;

    if (items.length == 0) {
      next();
    } else {
      var remove = -1;

      for(var i=0; i<items.length; i++) {
        if (items[i].product.id == req.params.id) {
          if (items[i].quantity > 1) {
            items[i].quantity -= 1;
          } else {
            remove = i;
          }
        }
      }

      if (remove > -1) {
        items.splice(remove, 1);
      }
    }
    req.session.cart = items;
  }
  res.redirect('/cart');
});

router.get('/', (req, res, next) => {
  const error = req.session.error || '';
  delete req.session.error;
  res.render('./cart', { title:'Carrinho', message: error, session: req.session });
});

router.post('/checkout', (req, res, next) => {
  if (req.session.user) {
    CartService.checkout(req.session.cart, req.session.user, (result) => {
      console.log('checkout complete');
      req.session.cart = null;
      res.render('./checkout', { title:'Compra realizada com sucesso!', session: req.session });
    }, (err) => {
      console.log('error on checkout');
      res.redirect('/cart');
    });
  }
  else {
    req.session.error = 'Necessário fazer login!';
    res.redirect('/user/login');
  }
});

module.exports = router;