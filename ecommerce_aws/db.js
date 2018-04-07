var Sequelize = require('sequelize');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var config = require('./config.json')[process.env.NODE_ENV];
// console.log('Configurations\n', config);

var db = new Sequelize(
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

function uploadToS3(key, data, callback) {
  var params = {
    Bucket: config.bucket_name,
    Key: key,
    Body: fileToBinaryString(data)
  }

  s3.putObject(params, function(err, data) {
    if (err) {
      callback(e, null);
    } else {
      callback(null, { data: `${config.bucket_name}/${key}` })
      console.log(`Dados enviados com sucesso para ${config.bucket_name}/${key}`);
    }
  });
}

function fileToBinaryString(file) {
  fr = new FileReader();
  fr.onload = () => {
    return fr.result;
  }
  fr.readAsBisnaryString(file);
}

module.exports = { db, uploadToS3 } ;