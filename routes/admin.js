var express = require('express');
var router = express.Router();
var users = require('./../inc/users');
var admin = require('./../inc/admin');


router.use(function(req, res, next){

  if ( ['/login'].indexOf(req.url) === -1 && !req.session.user ){
    req.session.destroy(function(){
      res.redirect('/admin/login');
    });    
  }else{    
    next();    
  }
  
});

router.use(function(req, res, next){
    req.menus = admin.getMenus(req);
    next();
});

router.get('/logout', function(req, res, next){
  delete req.session.user;
  res.redirect('admin/login');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  
      res.render('admin/index', {
        menus: req.menus
      });  
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
  
  res.render('admin/contacts', {
    menus: req.menus
  }); 

});

router.get('/menus', function(req, res, next) {
  
  res.render('admin/menus', {
    menus: req.menus
  }); 

});

router.get('/reservations', function(req, res, next) {
  
  res.render('admin/reservations', {
    date:{},
    menus: req.menus
  }); 

});

router.get('/users', function(req, res, next) {
  
  res.render('admin/users', {
    menus: req.menus
  }); 

});

router.get('/emails', function(req, res, next) {
  
  res.render('admin/emails', {
    menus: req.menus
  }); 

});
  
module.exports = router;