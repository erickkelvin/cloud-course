var express = require('express');
var router = express.Router();
var { authenticate } = require('../services/auth');
var { UserService } = require('../services/users');
var { upload }  = require('../helpers/utils');

/* GET login page. */
router.get('/user/login', function(req, res, next) {
  res.render('./auth/login', { title: 'Login', message: '', session: req.session});
});

/* POST login page. */
router.post('/user/login', function(req, res, next) {
  authenticate(req.body.login, req.body.password, (error, user) => {
    if (error) {
      var err = new Error('Login ou senha incorretos!');
      err.status = 401;
      return res.render('./auth/login', { title: 'Login', message: 'Login ou senha incorretos!', session: req.session });
    } else {
      req.session.user = user;
      return res.redirect('/');
    }
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
router.post('/user/create', upload.single('photo'), function(req, res, next) {
  const file = req.file ? req.file.location : '';
  UserService.create(req.body, file, (user) => {
    res.redirect('/user/login');
  }, (err) => {
    console.log('error on create');
    console.error(err);
  });
});

router.post('/user/update', upload.single('photo'), function(req, res, next) {
  if(!req.session.user) {
    res.redirect('/user/login');
  }
  const file = req.file ? req.file.location : '';
  UserService.update(req.session.user.id, req.body, file, (user) => {
    console.log(req.session.user.id, user.id);
    if (req.session.user.id == user.id) {
      req.session.user = user;
    }
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