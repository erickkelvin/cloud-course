var express = require('express');
var router = express.Router();
var { CartService } = require('../services/cart');
var { ProductService } = require('../services/products');

items = [];

router.post('/add/:productid', (req, res, next) => {
  if (req.session.cart) {
    var items = req.session.cart;
    
    var itsNew = true;
    if (item.length > 0) {
      itsNew = true;
      items.forEach(item => {
        if (item.product.id == req.params.id && item.quantity < item.product.quantity) {
          item.quantity += 1;
          itsNew = false;
        }
      });
    }

    if (itsNew) {
      item.push({ product: req.body, quantity: 1 });
    }

    req.session.cart = items;
  } else {
    req.session.cart = [{ product: req.body, quantity: 1 }];
  }
});

router.delete('/add/:productid', (req, res, next) => {
  if (req.session.cart) {
    var items = req.session.cart;

    if (item.length == 0) {
      next();
    } else {
      var remove = -1;

      for(var i=0; i<items.length; i++) {
        if (items[i].product.id == req.params.id) {
          if (item[i].quantity > 1) {
            item[i].quantity -= 1;
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
});

router.get('/checkout', (req, res, next) => {
  res.render('./cart', { title:'Carrinho', session: req.session });
});

router.post('/checkout', (req, res, next) => {
  CartService.checkout(req.session.cart, req.session.user, () => {
    console.log('checkout complete');
    res.redirect('/');
  }, (err) => {
    console.log('error on checkout');
    console.error(err);
  });
});

module.exports = router;