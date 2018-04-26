var Sequelize = require('sequelize');
var { db } = require('../db');
var { sendEmail } = require('../helpers/utils');

function CartService (){}
CartService.checkout = (items, client, success, error) => {

  var query = `
    UPDATE products
    SET quantity = CASE id
  `
  var ids = 'WHERE id IN(';

  items.forEach(item => {
    query += ` WHEN ${item.product.id} THEN ${item.product.quantity - item.quantity}`;
    ids += `'${item.product.id}',`;
  });
  query += ' END ';
  ids = ids.slice(0, ids.length-1) + ');';
  query += ids;

  console.log(query);

  db.query(query, {
    type: Sequelize.QueryTypes.UPDATE
  }).then((result) => {
    sendEmail(items, client, (err, data) => {
      if(err) error(err);
      else success(data);
    })
  }).catch(err => {
    console.log(err);
    error(err);
  })

}

module.exports = { CartService }