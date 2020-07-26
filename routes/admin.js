var express = require('express');
var router = express.Router();
var users = require('./../inc/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  
      res.render('admin/index');  
});

router.post('/login', function(req, res, next){
  let err = [];
  
  if (!req.body.email){
    err.push('* Digite o nome!');
  }
   if (!req.body.password){
    err.push('* Digite o email!\n');
  }

  if (err.length === 0){   
    users.login(req.body, res).then(user=>{
      req.session.user = user;
      res.redirect('/admin');

    });
  }else{
    users.render(req.body, res, err, 'alert-danger');
  }
    
});

router.get('/login', function(req, res, next) {

  users.render(req, res, [], '');

});

router.get('/contacts', function(req, res, next) {
  
  res.render('admin/contacts', {}); 

});

router.get('/menus', function(req, res, next) {
  
  res.render('admin/menus', {}); 

});

router.get('/reservations', function(req, res, next) {
  
  res.render('admin/reservations', {
    date:{}
  }); 

});

router.get('/users', function(req, res, next) {
  
  res.render('admin/users', {}); 

});

router.get('/emails', function(req, res, next) {
  
  res.render('admin/emails', {}); 

});
  
module.exports = router;