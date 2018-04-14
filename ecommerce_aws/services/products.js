var Sequelize = require('sequelize');
var { db } = require('../db');
var Log = require('../helpers/log');

function ProductService (){}
ProductService.getAll = (success, error) => {
  console.log('Getting all products');

  db.query('SELECT * FROM products', {
    type: Sequelize.QueryTypes.SELECT
  }).then(data => {
    if (data) {
      success(data);
      Log.save('LIST', 'PRODUCT', null);
    } else {
      success([]);
    }
  }).catch(err => {
    console.error(err);
    error(err);
  });
}

ProductService.create = (product, photo_url, success, error) => {
  
  if (!product) {
    error({message: 'Product is undefined!'});
    return;
  }

  db.query(`INSERT INTO products(name, description, manufacturer, quantity, photo_url, price)
    VALUES (:name, :description, :manufacturer, :quantity, :photo_url, :price)`,
    {
      replacements: {
        name: product.name,
        description: product.description,
        manufacturer: product.manufacturer,
        quantity: product.quantity,
        photo_url: photo_url,
        price: product.price
      },
      type: Sequelize.QueryTypes.INSERT
    }
  ).then( (result) => {
    console.log(`\n${result}#${product.name} has been created!`);
    Log.save('INSERT', 'PRODUCT', product.name);
    success(`${result}#${product.name} has been created!`);
  }).catch(err => {
    error(err);
  });
}

ProductService.get = (id, success, error) => {
  db.query('SELECT * FROM products WHERE id = :id', {
    replacements:  { id: id },
    type: Sequelize.QueryTypes.SELECT
  }).then(data => {
    Log.save('VIEW', 'PRODUCT', data.name);
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

ProductService.search = (query, success, error) => {
  query = "%"+query+"%";

  db.query('SELECT * FROM products WHERE name like :query OR description like :query', {
    replacements:  { query: query },
    type: Sequelize.QueryTypes.SELECT
  }).then(data => {
    Log.save('SEARCH', 'PRODUCT', null);
    
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

ProductService.update = (id, product, photo_url, success, error) => {
  let photo_url_new = photo_url;

  if (product.photo_url && !photo_url) {
    photo_url_new = product.photo_url;
  }

  db.query(`UPDATE products p
      SET p.name = :name,
        p.description = :description,
        p.manufacturer = :manufacturer,
        p.quantity = :quantity,
        p.photo_url = :photo_url,
        p.price = :price
      WHERE p.id = :id`,
    {
      replacements: {
        id: id,
        name: product.name,
        description: product.description,
        manufacturer: product.manufacturer,
        quantity: product.quantity,
        photo_url: photo_url_new,
        price: product.price
      },
      type: Sequelize.QueryTypes.UPDATE
    }
  ).then( (result) => {
    console.log(`\n${result}#${product.name} has been updated!`);
    Log.save('ALTER', 'PRODUCT', product.name);
    success(`${result}#${product.name} has been updated!`);
  }).catch(err => {
    console.error(err);
    error(err);
  })
}

ProductService.remove = (id, success, error) => {
  db.query('DELETE FROM products WHERE id = :id ', {
    replacements: { id: id },
    type: Sequelize.QueryTypes.DELETE
  }).then( (result) => {
    console.log('Product deleted.');
    Log.save('DELETE', 'PRODUCT', id);
    success(true);
  }).catch(err => {
    console.error(err);
    error(err);
  })
}

module.exports = { ProductService }