var { UserService } = require('./users');
var Sequelize = require('sequelize');
var { db } = require('../db');

function AuthService() { }
authenticate = (login, password, success, error) => {
  db.query('SELECT * FROM users WHERE login = :login && password = :password', {
    replacements:  { login: login, password: password },
    type: Sequelize.QueryTypes.SELECT
  }).then(data => {
    if (data.length) {
      return success(data[0]);
    } else {
      return error(true);
    }
  }).catch(err => {
    console.error(err);
    return error(err);
  });
}

checkAdmin = (req, res, next) => {
  if(req.session.user) {
    UserService.get(req.session.user.id, (user) => {
      if (user.type == 'ADM') {
        next();
      }
      else {
        console.log('user not admin');
        req.session.error = 'Credenciais inválidas!';
        res.sendStatus(401);
      }
    }, (err) => {
      console.log('error on getAll');
      console.error(err);
      req.session.error = 'Credenciais inválidas!';
      res.redirect('/user/login');
    });
  }
  else {
    console.log('not logged in');
    req.session.error = 'Necessário fazer login!';
    res.redirect('/user/login');
  }
}

module.exports = { authenticate, checkAdmin }