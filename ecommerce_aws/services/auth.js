var { UserService } = require('./users');

function AuthService() { }
authenticate = (username, password, callback) => {
  UserService.getAll((users) => {
    console.log(users);
    users.forEach((user) => {
      if (user.login == username && user.password == password) {
        return callback(null, user);
      }
    });
    return callback();
  }, (err) => {
    console.log('error on getAll');
    console.error(err);
    return callback(err, null);
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
        res.sendStatus(401);
      }
    }, (err) => {
      console.log('error on getAll');
      console.error(err);
      res.status(401).redirect('/login');
    });
  }
  else {
    console.log('not logged in');
    res.status(401).redirect('/login');
  }
}

checkClient = (req, res, next) => {
  if(req.session.user) {
    UserService.get(req.session.user.id, (user) => {
      if (user.type == 'CLI') {
        next();
      }
      else {
        console.log('user not client');
        res.sendStatus(401);
      }
    }, (err) => {
      console.log('error on getAll');
      console.error(err);
      res.status(401).redirect('/login');
    });
  }
  else {
    console.log('not logged in');
    res.status(401).redirect('/login');
  }
}

module.exports = { authenticate, checkAdmin }