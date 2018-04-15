var express = require('express');
var router = express.Router();
var { UserService }  = require('../../services/users');
var { uploadPhoto }  = require('../../helpers/utils');
var Log = require('../../helpers/log');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.query.search) {
    UserService.search(req.query.search, (result) => {
      console.log(result);
      Log.save(req.session.user.login, 'SEARCH', 'USER', req.query.search);
      res.render('./admin/users/index', { title:'Usuários', users: result, query: req.query.search, session: req.session });
    }, (err) => {
      console.log('error on search');
      console.error(err);
    });
  }
  else {
    UserService.getAll((result) => {
      Log.save(req.session.user.login, 'LIST', 'USER', null);
      res.render('./admin/users/index', { title:'Usuários', users: result, query: null, session: req.session });
    }, (err) => {
      console.log('error on getAll');
      console.error(err);
    });
  }
});

/* GET new user page. */
router.get('/new', function(req, res, next) {
  res.render('./admin/users/form', { title:'Adicionar novo usuário', action: 'create', user: {}, session: req.session });
});

/* POST create user */
router.post('/create', uploadPhoto.single('photo'), function(req, res, next) {
  const file = req.file ? req.file.location : '';
  UserService.create(req.body, file, (result) => {
    Log.save(req.session.user.login, 'INSERT', 'USER', req.body.login);
    res.redirect('/admin/users');
  }, (err) => {
    console.log('error on create');
    console.error(err);
  });
});

/* GET edit user page. */
router.get('/edit/:id', function(req, res, next) {
  UserService.get(req.params.id, (result) => {
    res.render('./admin/users/form', { title:'Editar usuário', action: 'update/' + req.params.id, user: result, session: req.session });
  }, (err) => {
    console.log('error on retrieving user');
    console.error(err);
  });
});

/* POST update user */
router.post('/update/:id', uploadPhoto.single('photo'), function(req, res, next) {
  const file = req.file ? req.file.location : '';
  UserService.update(req.params.id, req.body, file, (user) => {
    if (req.session.user.login == user.id) {
      req.session.user = user;
    }
    Log.save(req.session.user.login, 'ALTER', 'USER', user.login);
    res.redirect('/admin/users');
  }, (err) => {
    console.log('error on update');
    console.error(err);
  });
});

/* GET delete user */
router.get('/delete/:id', function(req, res, next) {
  UserService.remove(req.params.id, (user) => {
    Log.save(req.session.user.login, 'DELETE', 'USER', user.login);
    res.redirect('/admin/users');
  }, (err) => {
    console.log('error on delete');
    console.error(err);
  });
});

/* GET user page */
router.get('/:id', (req, res) => {
  UserService.get(req.params.id, (user) => {
    Log.save(req.session.user.login, 'VIEW', 'USER', user.login);
    res.render('./admin/users/show', { title: user.name, user: user, session: req.session });
  }, (error) => {
    console.log(error);
    res.redirect('/admin/users');
  });

});

module.exports = router;
