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
    dialectOptions: process.env.NODE_ENV === 'production' && process.env.DB_INSTANCE_CONNECTION_NAME ? {
      socketPath: `/cloudsql/${process.env.DB_INSTANCE_CONNECTION_NAME}`
    } : {},
    operatorsAliases: Sequelize.Op
  }
);

module.exports = { db };