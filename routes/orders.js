var express = require('express');
const _ = require('lodash');
const validator = require('validator');
var exphbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); //to parse json
var mongo = require('mongodb');
const {ObjectID} = require('mongodb');

var cors = require('cors');

var router = express.Router();
var {Order} = require('../models/order');
var {authenticate} = require('../middleware/authenticate');


//--------- to make remote api call-------------//
var unirest = require('unirest');

//-----------milgun setup------------//
var api_key = 'key-f95bdec716bbb041680ce6898e807ba5';
var domain = 'ensemblefurnitures.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});


function send_msg(number,message) {
  var addr = 'http://bhashsms.com/api/sendmsg.php?user=7708528228&pass=c495ba8&sender=ENSMBL&phone=' + number + '&text=' + escape(message) + '&priority=ndnd&stype=normal';
  var Request = unirest.get(addr);
  Request.end(function (response) {
  console.log(response.body);
});
}

function send_mail(email_id,subject,message)
{
  var data = {
  from: 'Ensemble Furnitures <postmaster@ensemblefurnitures.com>',
  to: email_id,
  subject: subject,
  text: message
  };

  mailgun.messages().send(data, function (error, body) {
    if(error){
      console.log(error);
      return;
    }
  console.log(body);
  });
}







//get all orders of a particular dealer, when supplied dealer's id.
router.get('/:id', (req, res) => { 
  var id = req.params.id; // id of the dealer

  // if (!ObjectID.isValid(id)) {
  //   return res.status(404).send();
  // }

  Order.find({retailer_id:id}).then((orders) => {
    if(!orders) {
      return res.status(404).send();
    }
    res.send(orders);
  }).catch((e) => {
    res.status(400).send();
  });
})


//   Order.findById(id).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }

//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });


//post a new order
router.post('/', (req, res) => {
  var body = _.pick(req.body, ["customer.address","customer.email","customer.name","customer.pno","customer.pno_alt",'retailer.adhaar_id','retailer.email','retailer.home_address','retailer.phone','retailer.sales_rep_id','retailer.shop_address','retailer.shop_reg_id','retailer._id','invoice.prods','invoice.tot_cost']);
  var d = new Date();
  body.placedAt=d.toString();
  var order = new Order(body);

  order.save().then((doc) => {
    send_msg(doc.customer.pno,"Thank you your order hass been placed. Pay 300 now, rest will be colletted later");
    send_mail(doc.customer.email, "Ensemble Order","Thank you your order hass been placed");
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});



// //change the order to processing
// router.get('/', (req, res) => {
//   Todo.find().then((todos) => {
//     res.send({todos});
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

// //change the order to done
// router.get('/', (req, res) => {
//   Todo.find().then((todos) => {
//     res.send({todos});
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });


module.exports = router;
