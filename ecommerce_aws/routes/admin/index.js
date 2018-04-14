var express = require('express');
var router = express.Router();
var { CartService }  = require('../../services/cart');

/* GET admin page. */
router.get('/', function(req, res, next) {
  res.render('./admin/index', { title: 'Painel de administrador', session: req.session });

  CartService.checkout({},{});
});

module.exports = router;