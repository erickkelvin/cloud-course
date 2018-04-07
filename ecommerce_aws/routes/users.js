var express = require('express');
var router = express.Router();
var { UserService }  = require('../services/users');
var Log = require('../helpers/log');

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  UserService.listAll((result) => {
    var user = req.cookies['ecommerce-user'];
    console.log('Cookies: ', user);

    // Log.save(user.id, 'LIST', 'USER', null);
    res.render('./users/index', { title:'Usuários', users: result });
  }, (err) => {
    console.log('error on listAll');
    console.error(err);
  });

});

router.post('/', function(req, res, next) {

  var user = {
    login: req.body.login,
    password: req.body.password,
    email: req.body.email,
    name: req.body.name,
    photo_url: req.body.photo_url,
    birthdate: req.body.birthdate,
    phone: req.body.phone,
    type: req.body.type,
  }

  console.log('USER', user);

  UserService.create(user, (result) => {
    res.status(200).redirect('/users');
  }, (error) => {
    if(error && error.message) {
      alert(error.message);
    } else {
      Log.save('INSERT', 'USER', user.login);
      console.log(error);
      res.status(500).redirect('/users');
    }
  });

});

router.get('/:id', (req, res) => {

  UserService.get(id, (result) => {
    Log.save('VIEW', 'USER', data.login);
    res.status(200).redirect('/show', { user: result });
  }, (error) => {
    console.log(error);
    res.status(500).redirect('/users');
  });

});

module.exports = router;
