var AWS = require('aws-sdk');
var multer = require('multer')
var multerS3 = require('multer-s3')
AWS.config.update({
  region:'us-east-1'
})

const s3 = new AWS.S3();
const ses = new AWS.SES();

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    }
  })
});

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

module.exports = { upload, sendEmail }