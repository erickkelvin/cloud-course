const Storage = require('@google-cloud/storage');
const multer = require('multer');
const multerGoogleStorage = require('multer-google-storage');
const path = require('path');

const uploadPhoto = multer({
  storage: multerGoogleStorage.storageEngine()
});

deletePhoto = (id, success, error, del, serviceType) => {
  const storage = new Storage();
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
        storage
          .bucket(process.env.GCS_BUCKET)
          .file(photoKey)
          .delete()
        .then(() => {
          success(`${photoKey} deleted.`);
        })
        .catch(err => {
          if (err.message.includes("No such object")) {
            success('Photo didn\'t exist.');
          }
          else {
            error(err);
          }
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
  /*let itemsList = '';
  let total = 0;
  let date = new Date();
  date = `${date.getDate()}/${date.getMonth()}`;

  items.forEach((item) => {
    itemsList += `
    <li>
      <h4>${item.product.name}</h4>
      <p>${item.product.description}</p>
      <p>Quantidade: ${item.quantity}</p>
      <p>Valor unitário: R$ ${item.product.price}</p>
      <p>Subtotal: R$ ${(item.product.price * item.quantity).toFixed(2)}</p>
    </li>
    `;

    total += (item.quantity * item.product.price);
  });

  let body = `
  <h3>
	  Olá ${client.name}!
  </h3>
  <p>Você realizou uma nova compra no <b style="color:#DB7D25">SmartVendas!</b></p>
  <p>Sua compra foi realizada no dia ${date}, contendo os seguintes itens:</p>

  <ul>
    ${itemsList}
  </ul>
  <br>
  <p>
    <strong>TOTAL: </strong> R$ ${total.toFixed(2)}
  </p>

  <b>Obrigado!</b>
  `

  let params = {
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
    Source: process.env.SES_EMAIL,
  };

  console.log(`Sending email to ${client.email}`);
  ses.sendEmail(params, (err, data) => {
    if(err) {
      console.log('Error sending the email');
      if (err.message.includes('Email address is not verified.')) {
        ses.verifyEmailAddress({ EmailAddress: client.email }, function (err, data) {
          if (err) {
            return callback(err, null);
          }
          else {
            console.log('Verification e-mail sent!');
            return callback(err, 'Needs verification.');
          }
        });
      }
      else {
        return callback(err, null);
      }
    } else {
      console.log(`MessageId: ${data.MessageId}`);
      return callback(null, data.MessageId);
    }
  });*/
  return; //remove this when uncommenting this function
}

module.exports = { uploadPhoto, deletePhoto, sendEmail }