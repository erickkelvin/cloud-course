var { sendEmail } = require('../helpers/utils');

function CartService (){}
CartService.checkout = (items, client, error) => {

  var items = [
    {
      product: {
        id: 1,
        name: 'celular',
        price: 15
      },
      quantity: 1
    },
    {
      product: {
        id: 2,
        name: 'tv',
        price: 1000
      },
      quantity: 1
    },
    {
      product: {
        id: 3,
        name: 'fone',
        price: 14
      },
      quantity: 2
    }
  ]

  var client = {
    name: 'Zedequias',
    email: 'zedequiassantoss@gmail.com'
  }

  console.log('###################################');
  sendEmail(items, client).then((data) => {
    
  }).catch((err) => {

  });
}

module.exports = { CartService }