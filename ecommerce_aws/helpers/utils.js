var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');

const s3 = new AWS.S3({params: {Bucket: process.env.S3_BUCKET}});

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

module.exports = { uploadPhoto, deletePhoto }