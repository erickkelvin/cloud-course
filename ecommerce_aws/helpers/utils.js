var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');

const s3 = new AWS.S3({params: {Bucket: process.env.S3_BUCKET}});
const ses = new AWS.SES();

var uploadPhoto = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`);
    }
  })
});

deletePhoto = (id, success, error, del, serviceType) => {
  console.log(del, id, serviceType);
  if (del) {
    const { UserService } = require('../services/users');
    const { ProductService } = require('../services/products');
    let Service;
    if (serviceType === 'users') {
      console.log(del, id, serviceType);
      Service = UserService;
    }
    else if (serviceType === 'products') {
      Service = ProductService;
    }
    Service.get(id, (result) => {
      const photoKey = result.photo_url.substr(result.photo_url.lastIndexOf('/') + 1);
      s3.deleteObject({Key: photoKey}, (err, data) => {
        if (err) {
          error(err);
        }
        success('Successfully deleted photo.');
      });
    }, (err) => {
      console.log('error on retrieving object');
      console.error(err);
      error(err);
    });
  }
  else {
    success('Photo didn\'t change.');
  }
}

sendEmail = (items, client) => {

  var body = `
    <h2>Registrando sua compra ${client.name}</h2>
    ${JSON.stringify(items)}
    <p>Obrigado!</p>
  `;

  var params = {
    Destination: { /* required */
      CcAddresses: [],
      ToAddresses: [client.email]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Nova compra no Smart'
      }
    },
    Source: 'zedequiassantoss@gmail.com',
  };

  console.log('####### SENDING EMAIL #######');

  // Create the promise and SES service object
  // var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
  ses.sendEmail(params).then((data) => {
    // console.log(data.MessageId, data);
  }).catch((err) => {
    // console.error(err, err.stack);
  })
}

module.exports = { uploadPhoto, deletePhoto, sendEmail }
