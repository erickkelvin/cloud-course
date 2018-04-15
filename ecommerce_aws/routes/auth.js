var express = require('express');
var router = express.Router();
var { authenticate } = require('../services/auth');
var { UserService } = require('../services/users');
var { uploadPhoto }  = require('../helpers/utils');
var Log = require('../helpers/log');

/* GET login page. */
router.get('/user/login', function(req, res, next) {
  if (req.session.user) {
    res.redirect('/');
  } else {
    const error = req.session.error || '';
    delete req.session.error;
    res.render('./auth/login', { title: 'Login', error: error, session: req.session});
  }
});

/* POST login page. */
router.post('/user/login', function(req, res, next) {
  authenticate(req.body.login, req.body.password, (user) => {
    req.session.user = user;
    res.redirect('/');
  },(error) => {
    req.session.error = 'Login ou senha incorretos!';
    res.redirect('/user/login');
  });
});

/* GET register page. */
router.get('/user/register', function(req, res, next) {
  res.render('./auth/form', { title: 'Cadastro', action: 'create', user: {}, session: req.session });
});

/* GET edit page. */
router.get('/user/edit', function(req, res, next) {
  if(!req.session.user) {
    res.redirect('/user/login');
  }
  UserService.get(req.session.user.id, (result) => {
    res.render('./auth/form', { title:'Editar perfil', action: 'update', user: result, session: req.session });
  }, (err) => {
    console.log('error on retrieving user');
    console.error(err);
  });
});

/* POST create user */
router.post('/user/create', uploadPhoto.single('photo'), function(req, res, next) {
  const file = req.file ? req.file.location : '';
  UserService.create(req.body, file, (user) => {
    Log.save(req.session.user.login, 'INSERT', 'USER', req.body.login);
    res.redirect('/user/login');
  }, (err) => {
    console.log('error on create');
    console.error(err);
  });
});

router.post('/user/update', uploadPhoto.single('photo'), function(req, res, next) {
  if(!req.session.user) {
    res.redirect('/user/login');
  }
  const file = req.file ? req.file.location : '';
  UserService.update(req.session.user.id, req.body, file, (user) => {
    if (req.session.user.id == user.id) {
      req.session.user = user;
    }
    Log.save(req.session.user.login, 'ALTER', 'USER', user.login);
    res.redirect('/');
  }, (err) => {
    console.log('error on update');
    console.error(err);
  });
});

/* GET logout page. */
router.get('/user/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if(err) {
      return next(err);
    } else {
      return res.redirect('/user/login');
    }
  });
});

module.exports = router;