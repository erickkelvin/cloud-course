var Sequelize = require('sequelize');
var { db, uploadToS3 } = require('../db');
var Log = require('../helpers/log');

function ProductService (){}
ProductService.listAll = (success, error) => {
  console.log('Getting all products');

  db.query('SELECT * FROM products', {
    type: Sequelize.QueryTypes.SELECT
  }).then(data => {
    if (data) {
      console.log(data)
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

ProductService.create = (product, success, error) => {

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
        photo_url: product.photo_url,
        price: product.price
      },
      type: Sequelize.QueryTypes.INSERT
    }
  ).then( (result) => {

    uploadToS3(result, product.photo_url, (err, data) => {
      if(err) {
        console.log('Error while uploading the image');
        console.log(err, err.stack);
      } else {
        product.photo_url = data;

        ProductService.update(product, () => {
          console.log(`\n${result}#${name} has been created!`);
          Log.save('INSERT', 'PRODUCT', product.name);
          success(`${result}#${name} has been created!`);
        }, (err) => {
          error(err);
        })        
      }
    });
  }).catch(err => {
    error(err);
  })
}

ProductService.get = (id, success, error) => {
  db.query('SELECT * FROM products WHERE id = :id', {
    replacements:  { id: id },
    type: Sequelize.QueryTypes.SELECT
  }).then(data => {
    Log.save('VIEW', 'PRODUCT', data.name);
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

ProductService.search = (name, success, error) => {
  name = "%"+name+"%";

  db.query('SELECT * FROM products WHERE name like :name OR login like : name', {
    replacements:  { name: name },
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

ProductService.update = (product, success, error) => {

  db.query(`UPDATE products p
      SET p.name = :name,
        p.description = :description,
        p.manufacturer = :manufacturer,
        p.quantity = :quantity,
        p.photo_url = :photo_url,
        p.price = :price
      WHERE u.id = :id`,
    {
      replacements: {
        name: product.name,
        description: product.description,
        manufacturer: product.manufacturer,
        quantity: product.quantity,
        photo_url: product.photo_url,
        price: product.price
      },
      type: Sequelize.QueryTypes.UPDATE
    }
  ).then( (result) => {
    console.log(`\n${result}#${name} has been updated!`);
    Log.save('ALTER', 'PRODUCT', product.name);
    success(`${result}#${name} has been updated!`);
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