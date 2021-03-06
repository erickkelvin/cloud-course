var Sequelize = require('sequelize');
var { db } = require('../db');
var Log = require('../helpers/log');
var { deletePhoto }  = require('../helpers/utils');

function UserService() { }
UserService.getAll = (success, error) => {
  db.query('SELECT * FROM users', {
    type: Sequelize.QueryTypes.SELECT
  }).then(data => {
    if (data) {
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
        type: user.type || 'CLI'
      },
      type: Sequelize.QueryTypes.INSERT
    }
  ).then((result) => {
    console.log(`\n${user.name} has been created!`);
    success(`\n${user.name} has been created!`);
  }).catch(err => {
    if (err.errors && err.errors[0].message.toLowerCase().includes("unique")) {
      error({ message: 'This login is already in use', err: err });
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
  let del = false;

  if ((photo_url_new && user.photo_url) || user.photo_url == 'del') {
    del = true;
  }

  if (!photo_url && user.photo_url && user.photo_url != 'del') {
    photo_url_new = user.photo_url;
  }
  
  deletePhoto(id, (result) => {
    db.query(`UPDATE users u
        SET u.password = :password,
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
      console.log(`\n${user.name} has been updated!`);
      let user_new = user;
      user_new.photo_url = photo_url_new;
      user_new.id = id;
      user_new.login = user.login_alt;
      success(user_new);
    }).catch(err => {
      console.error(err);
      error(err);
    });
  }, (err) => {
    console.log('error on retrieving user');
    console.error(err);
  }, del, 'users');
}

UserService.remove = (id, success, error) => {
  deletePhoto(id, (user) => {
    db.query('DELETE FROM users WHERE id = :id ', {
      replacements: { id: id },
      type: Sequelize.QueryTypes.DELETE
    }).then(result => {
      success(user);
    }).catch(err => {
      console.error(err);
      error(err);
    });
  }, (err) => {
    console.log('error on retrieving user');
    console.error(err);
  }, true, 'users');
}

module.exports = { UserService }
