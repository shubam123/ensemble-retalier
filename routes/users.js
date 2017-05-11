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

var router = express.Router();
var {User} = require('../models/user');
var {authenticate} = require('../middleware/authenticate');




//milgun sett
var api_key = 'key-f95bdec716bbb041680ce6898e807ba5';
var domain = 'ensemblefurnitures.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});




router.get('/mail',(req, res) => {

  var data = {
  from: 'Ensemble Furnitures <postmaster@ensemblefurnitures.com>',
  to: 'shubamdaphnis@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
  };

  mailgun.messages().send(data, function (error, body) {
    if(error){
      console.log(error);
      return;
    }
  console.log(body);
  res.send(body);
  });

});

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
  res.send(body);
  });


}



// POST /users
router.post('/', (req, res) => {
  var body = _.pick(req.body, ['email', 'password','phone','sales_rep_id','home_address','shop_address','adhaar_id','shop_reg_id']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    var response={"status":"success","user":{"_id":user._id,"email":user.email,"phone":user.phone,"sales_rep_id":user.sales_rep_id,"home_address":user.home_address,"shop_address":user.shop_address,"adhaar_id":user.adhaar_id,"shop_reg_id":user.shop_reg_id}};
    res.header('x-auth', token).send(response);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

router.post('/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {

    var response={"status":"success","user":{"_id":user._id,"email":user.email,"phone":user.phone,"sales_rep_id":user.sales_rep_id,"home_address":user.home_address,"shop_address":user.shop_address,"adhaar_id":user.adhaar_id,"shop_reg_id":user.shop_reg_id}};
      res.header('x-auth', token).send(response);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

router.delete('/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send({"status":"success"});
  }, () => {
    res.status(400).send();
  });
});


module.exports = router;
