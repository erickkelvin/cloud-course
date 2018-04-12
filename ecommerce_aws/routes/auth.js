var express = require('express');
var router = express.Router();
var { authenticate } = require('../services/auth');

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('./auth/login', { title: 'Login', message: '', session: req.session});
});

/* POST login page. */
router.post('/login', function(req, res, next) {
  authenticate(req.body.login, req.body.password, (error, user) => {
    if (error) {
      var err = new Error('Login ou senha incorretos!');
      err.status = 401;
      return res.render('./auth/login', { title: 'Login', message: 'Login ou senha incorretos!', session: req.session });
    } else {
      req.session.user = {
        id: user.id.toString(),
        name: user.name,
        photo_url: user.photo_url
      };
      return res.redirect('/');
    }
  });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('./auth/register', { title: 'Cadastro', session: req.session });
});

/* GET logout page. */
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if(err) {
      return next(err);
    } else {
      return res.redirect('/login');
    }
  });
});

module.exports = router;