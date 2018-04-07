var Sequelize = require('sequelize');
var { db, uploadToS3 } = require('../db');
var Log = require('../helpers/log');
var loggedUser = null;

function UserService (){}
UserService.listAll = (success, error) => {
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

UserService.create = (user, success, error) => {

  if (!user) {
    error({message: 'User is undefined!'});
    return;
  }

  if (!user.login || !user.password || !user.name || !user.photo_url || !user.email) {
    error({message: 'User needs email, login, password, name and photo_url filled!'});
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
        photo_url: 'http://placehold.it/400',
        type: user.type
      },
      type: Sequelize.QueryTypes.INSERT
    }
  ).then( (result) => {

    uploadToS3(result, user.photo_url, (err, data) => {
      if(err) {
        console.log('Error while uploading the image');
        console.log(err, err.stack);
      } else {
        user.photo_url = data;
        
        UserService.update(user, () => {
          console.log(`\n${result}#${name} has been created!`);
          success(`${result}#${name} has been created!`);
        }, (err) => {
          error(err);
        })        
      }
    });
  }).catch(err => {

    if(err.errors && err.errors[0].message.toLowerCase().includes("unique")) {
      error({message: 'This login is already in use'});
    } else {
      error(err);
    }
  })
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

UserService.search = (name, success, error) => {
  name = "%"+name+"%";

  db.query('SELECT * FROM users WHERE name like :name OR login like : name', {
    replacements:  { name: name },
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

UserService.update = (user, success, error) => {

  if (!user) {
    error({message: 'User is undefined!'});
    return;
  }

  if (!user.login || !user.password || !user.name || !user.photo_url || !user.email) {
    error({message: 'User needs email, login, password, name and photo_url filled!'});
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
        id: user.id,
        login: user.login,
        password: user.password,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo_url: user.photo_url,
        birthdate: user.birthdate,
        type: user.type
      },
      type: Sequelize.QueryTypes.UPDATE
    }
  ).then(result => {
    console.log(`\n${result}#${name} has been updated!`);
    Log.save('ALTER', 'USER', user.login);
    success(`${result}#${name} has been updated!`);
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
