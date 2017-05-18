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
