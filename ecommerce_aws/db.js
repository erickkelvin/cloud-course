var Sequelize = require('sequelize');

var db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    port: process.env.DB_PORT,
    logging: console.log,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    operatorsAliases: Sequelize.Op
  }
);

module.exports = { db };