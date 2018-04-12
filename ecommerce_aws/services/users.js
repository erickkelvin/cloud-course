var Sequelize = require('sequelize');
var { db } = require('../db');
var Log = require('../helpers/log');

var loggedUser = null;

function UserService (){}
UserService.getAll = (success, error) => {
  console.log('Getting all users');

  db.query('SELECT * FROM users', {
    type: Sequelize.QueryTypes.SELECT
  }).then(data => {
    if (data) {
      console.log(data)
      success(data);
    } else {
      success([]);
    }
  }).catch(err => {
    console.error(err);
    error(err);
  });
}

UserService.create = (user, photo_url, success, error) => {
  if (!user) {
    error({message: 'User is undefined!'});
    return;
  }

  if (!user.login || !user.password || !user.name || !user.email) {
    error({message: 'User needs email, login, password, and name filled!'});
    return;
  }

  db.query(`INSERT INTO users(login, password, name, email, birthdate, phone, photo_url, type)
    VALUES (:login, :password, :name, :email, :birthdate, :phone, :photo_url, :type)`,
    {
      replacements: {
        login: user.login,
        password: user.password,
        name: user.name,
        email: user.email,
        birthdate: user.birthdate,
        phone: user.phone,
        photo_url: photo_url,
        type: user.type
      },
      type: Sequelize.QueryTypes.INSERT
    }
  ).then((result) => {
    console.log(`\n${result}#${user.name} has been created!`);
    success(`${result}#${user.name} has been created!`);
  }).catch(err => {
    if (err.errors && err.errors[0].message.toLowerCase().includes("unique")) {
      error({ message: 'This login is already in use' });
    } else {
      error(err); //error on create
    }
  });
}

UserService.get = (id, success, error) => {
  db.query('SELECT * FROM users WHERE id = :id', {
    replacements:  { id: id },
    type: Sequelize.QueryTypes.SELECT
  }).then(data => {
    if (data) {
      success(data[0]);
    } else {
      success(null);
    }
  }).catch(err => {
    console.error(err);
    error(err);
  });
}

UserService.search = (query, success, error) => {
  query = "%"+query+"%";

  db.query('SELECT * FROM users WHERE name like :query OR login like :query', {
    replacements:  { query: query },
    type: Sequelize.QueryTypes.SELECT
  }).then(data => {
    Log.save('SEARCH', 'USER', null);
    
    if (data) {
      success(data);
    } else {  
      success(null);
    }
  }).catch(err => {
    console.error(err);
    error(err);
  });
}

UserService.update = (id, user, photo_url, success, error) => {
  let photo_url_new = photo_url;

  if (user.photo_url && !photo_url) {
    photo_url_new = user.photo_url;
  }

  if (!user) {
    error({message: 'User is undefined!'});
    return;
  }

  if (!user.login || !user.password || !user.name || !user.email) {
    error({message: 'User needs email, login, password and name filled!'});
    return;
  }

  db.query(`UPDATE users u
      SET u.login = :login,
        u.password = :password,
        u.name = :name,
        u.email = :email,
        u.phone = :phone,
        u.photo_url = :photo_url,
        u.birthdate = :birthdate,
        u.type = :type
      WHERE u.id = :id`,
    {
      replacements: {
        id: id,
        login: user.login,
        password: user.password,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo_url: photo_url_new,
        birthdate: user.birthdate,
        type: user.type
      },
      type: Sequelize.QueryTypes.UPDATE
    }
  ).then(result => {
    console.log(`\n${result}#${user.name} has been updated!`);
    Log.save('ALTER', 'USER', user.login);
    success(`${result}#${user.name} has been updated!`);
  }).catch(err => {
    console.error(err);
    error(err);
  })
}

UserService.remove = (id, success, error) => {
  db.query('DELETE FROM users WHERE id = :id ', {
    replacements: { id: id },
    type: Sequelize.QueryTypes.DELETE
  }).then(result => {
    console.log('User deleted.');
    Log.save('DELETE', 'USER', id);
    success(true);
  }).catch(err => {
    console.error(err);
    error(err);
  })
}

UserService.authenticate = (login, password, success, error) => {
  db.query('SELECT * FROM users WHERE login = :login', {
    replacements: { login: login },
    type: Sequelize.QueryTypes.SELECT
  }).then(result => {
    if(result) {
      console.log('result', result[0]);
      if(result[0].password == password) {
        loggedUser = result[0];
        success(result[0]);
      }
      else { success(false); }

    } else {
      success(null);
    }
  }).catch(err => {
    console.error(err);
    error(err);
  })
}

UserService.logout = () => {
  loggedUser = null;
}

module.exports = { UserService, loggedUser }
