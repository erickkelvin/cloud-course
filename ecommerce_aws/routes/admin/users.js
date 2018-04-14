var express = require('express');
var router = express.Router();
var { UserService }  = require('../../services/users');
var { upload }  = require('../../helpers/utils');
var Log = require('../../helpers/log');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.query.search) {
    UserService.search(req.query.search, (result) => {
      console.log(result);
      res.render('./admin/users/index', { title:'Usuários', users: result, query: req.query.search, session: req.session });
    }, (err) => {
      console.log('error on search');
      console.error(err);
    });
  }
  else {
    UserService.getAll((result) => {
      // Log.save(user.id, 'LIST', 'USER', null);
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
router.post('/create', upload.single('photo'), function(req, res, next) {
  const file = req.file ? req.file.location : '';
  UserService.create(req.body, file, (result) => {
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
router.post('/update/:id', upload.single('photo'), function(req, res, next) {
  const file = req.file ? req.file.location : '';
  UserService.update(req.params.id, req.body, file, (user) => {
    if (req.session.user.id == user.id) {
      req.session.user = user;
    }
    res.redirect('/admin/users');
    
  }, (err) => {
    console.log('error on update');
    console.error(err);
  });
});

/* GET delete user */
router.get('/delete/:id', function(req, res, next) {
  UserService.remove(req.params.id, (result) => {
    res.redirect('/admin/users');
  }, (err) => {
    console.log('error on delete');
    console.error(err);
  });
});

/* GET user page */
router.get('/:id', (req, res) => {
  UserService.get(id, (result) => {
    Log.save('VIEW', 'USER', data.login);
    res.redirect('/show', { user: result });
  }, (error) => {
    console.log(error);
    res.redirect('/users');
  });

});

module.exports = router;
