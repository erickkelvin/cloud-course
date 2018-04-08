var Sequelize = require('sequelize');
var db = require('../../db/connection');
var express = require('express');
var Log = require('../../Log');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.query.search) {
    search(req.query.search, (result) => {
      console.log(result);
      res.render('./admin/users/index', { title:'Usuários', users: result, query: req.query.search });
    }, (err) => {
      console.log('error on search');
      console.error(err);
    });
  }
  else {
    listAll((result) => {
      console.log(result);
      res.render('./admin/users/index', { title:'Usuários', users: result, query: null });
    }, (err) => {
      console.log('error on listAll');
      console.error(err);
    });
  }
});

/* GET new user page. */
router.get('/new', function(req, res, next) {
  res.render('./admin/users/form', { title:'Adicionar novo usuário', action: 'create', user: {} });
});

/* POST create user */
router.post('/create', function(req, res, next) {
  create(req.body, (result) => {
    res.redirect('/admin/users');
  }, (err) => {
    console.log('error on create');
    console.error(err);
  });
});

/* GET edit user page. */
router.get('/edit/:id', function(req, res, next) {
  get(req.params.id, (result) => {
    res.render('./admin/users/form', { title:'Editar usuário', action: 'update/' + req.params.id, user: result });
  }, (err) => {
    console.log('error on create');
    console.error(err);
  });
});

/* POST update user */
router.post('/update/:id', function(req, res, next) {
  update(req.params.id, req.body, (result) => {
    res.redirect('/admin/users');
  }, (err) => {
    console.log('error on create');
    console.error(err);
  });
});

/* GET delete user */
router.get('/delete/:id', function(req, res, next) {
  remove(req.params.id, (result) => {
    res.redirect('/admin/users');
  }, (err) => {
    console.log('error on delete');
    console.error(err);
  });
});


function listAll(success, error) {
  console.log('Getting all users');

  db.query('SELECT * FROM users', {
    type: Sequelize.QueryTypes.SELECT
  }).then(data => {
    if (data) {
      console.log(data)
      success(data);
      Log.save('1', 'LIST', 'USER', null);
    } else {
      success([]);
    }
  }).catch(err => {
    console.error(err);
    error(err);
  });
}

function create(user, success, error) {

  console.log(user);

  if (!user) {
    error({message: 'User is undefined!'});
    return;
  }

  if (!user.login || !user.password || !user.name || !user.photo_url) {
    error({message: 'User needs login, password, name and photo_url filled!'});
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
        photo_url: user.photo_url,
        type: user.type
      },
      type: Sequelize.QueryTypes.INSERT
    }
  ).then( (result) => {

    console.log(`\n${result}#${user.name} has been created!`);
    Log.save('1', 'INSERT', 'USER', result);
    success({ id: result, message: `${result}#${user.name} foi criado com sucesso!`});
  }).catch(err => {

    if(err.errors && err.errors[0].message.toLowerCase().includes("unique")) {
      error({message: 'This login is already in use'});
    } else {
      error(err);
    }
  })
}

function get(id, success, error) {
  db.query('SELECT * FROM users WHERE id = :id', {
    replacements:  { id: id },
    type: Sequelize.QueryTypes.SELECT
  }).then(data => {
    Log.save('1', 'VIEW', 'USER', id);
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

function search(name, success, error) {
  name = "%"+name+"%";

  db.query('SELECT * FROM users WHERE name like :name OR login like :name', {
    replacements:  { name: name },
    type: Sequelize.QueryTypes.SELECT
  }).then(data => {
    Log.save('1', 'SEARCH', 'USER', null);
    
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

function update(id, user, success, error) {
  if (!user) {
    error({message: 'User is undefined!'});
    return;
  }

  if (!user.login || !user.password || !user.name || !user.photo_url) {
    error({message: 'User needs login, password, name and photo_url filled!'});
    return;
  }

  db.query('UPDATE users u SET u.login = :login, u.password = :password, u.name = :name, u.email = :email, u.phone = :phone, u.photo_url = :photo_url, u.birthdate = :birthdate, u.type = :type WHERE u.id = :id',
    {
      replacements: {
        id: id,
        login: user.login,
        password: user.password,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo_url: user.photo_url,
        birthdate: user.birthdate,
        type: user.type
      },
      type: Sequelize.QueryTypes.PUT
    }
  ).then(function (result) {
    console.log(`\n${result}#${user.name} has been updated!`);
    Log.save('1', 'ALTER', 'USER', user.id);
    success(`${result}#${user.name} has been updated!`);
  }).catch(err => {
    console.error(err);
    error(err);
  })
}

function remove(id, success, error) {
  db.query('DELETE FROM users WHERE id = :id ', {
    replacements: { id: id },
    type: Sequelize.QueryTypes.DELETE
  }).then( (result) => {
    console.log('User deleted.');
    Log.save('1', 'DELETE', 'USER', id);
    success(true);
  }).catch(err => {
    console.error(err);
    error(err);
  })
}

module.exports = router;
