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
  if (del) {
    const { UserService } = require('../services/users');
    const { ProductService } = require('../services/products');
    let Service;
    if (serviceType === 'users') {
      Service = UserService;
    }
    else if (serviceType === 'products') {
      Service = ProductService;
    }
    Service.get(id, (result) => {
      if (result.photo_url) {
        const photoKey = result.photo_url.substr(result.photo_url.lastIndexOf('/') + 1);
        s3.deleteObject({Key: photoKey}, (err, data) => {
          if (err) {
            error(err);
          }
          success(result);
        });
      }
      else {
        success(result);
      }
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

sendEmail = (items, client, callback) => {

  var itemsList = '';
  var total = 0;
  var date = new Date();
  date = `${date.getDate()}/${date.getMonth()}`;

  items.forEach((item) => {
    itemsList += `
    <li>
      <h4>${item.product.name}</h4>
      <p>${item.product.description}</p>
      <p>Quantidade: ${item.quantity}</p>
      <p>Valor unitário: ${item.product.price}</p>
      <p>Valor total: ${item.product.price * item.quantity}</p>
    </li>
    `;

    total += (item.quantity * item.product.price);
  });

  var body = `
  <h3>
	  Olá ${client.name}
  </h3>
  <p>Você realizou uma nova compra no <b style="color:#DB7D25">SmartVendas!</b></p>
  <p>Sua compra foi realizada no dia ${date}, contendo os seguintes itens:</p>

  <ul>
    ${itemsList}
  </ul>

  <p>Compra no valor total de ${total} reais.</p>

  <b>Obrigado!</b>
  `

  var params = {
    Destination: {
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
        Data: 'Nova compra no SmartVendas'
      }
    },
    Source: 'zedequiassantoss@gmail.com',
  };

  console.log(`Sending email to ${client.email}`);
  ses.sendEmail(params, (err, data) => {
    if(err) {
      console.log('Error sending the email')
      console.log(err);
      callback(err, null);
    } else {
      console.log(`MessageId: ${data.MessageId}`);
      callback(null, data.MessageId);
    }
  });
}

module.exports = { uploadPhoto, deletePhoto, sendEmail }
