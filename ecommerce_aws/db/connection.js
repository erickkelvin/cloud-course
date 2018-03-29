var Sequelize = require('sequelize');

var config = require('../config.json')[process.env.NODE_ENV];
// console.log('Configurations\n', config);

var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    port: config.port,
    logging: console.log,
    host: config.host,
    dialect: config.dialect,
    operatorsAliases: Sequelize.Op
  }
);

module.exports = sequelize;