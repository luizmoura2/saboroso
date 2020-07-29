var express = require('express');
var router = express.Router();
var users = require('./../inc/users');
var admin = require('./../inc/admin');
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations');
var path = require('path');
var formidable = require('formidable');

var form = formidable.IncomingForm({
            uploadDir:path.join(__dirname, '../public/images'),
            keepExtensions: true,
            multiples: true
});


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
    admin.dashboard().then(data=>{
      res.render('admin/index', admin.getParams(req, {
        data: data
      }));
    }).catch(err=>{
      console.log(err);
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
  
  res.render('admin/contacts', admin.getParams(req, {})); 

});

router.post('/menus', function(req, res, next) {
  
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }else{
      menus.save(fields, files).then(results=>{
        res.send(results);
      }).catch(e=>{
        res.send(e);
      })
    }
  });
 
});

router.put('/menus', function(req, res, next) {
  
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }else{
      menus.update(fields, files).then(results=>{
        res.send(results);
        //console.log(results);
      }).catch(e=>{
        //console.log(e);
        res.send(e);
      })
    }
  }); 
});

router.delete('/menus/:id', function(req, res, next) {
      menus.delete(req.params.id).then(results=>{
        res.send(results);
       // console.log(results);
      }).catch(e=>{
       //console.log(e);
        res.send(e);
      }) 
});

router.get('/menus', function(req, res, next) {
  menus.getMenus().then(data=>{
    res.render('admin/menus', admin.getParams(req, {
      data
    })); 
  });
});

/*
* 
* Rotinas para o tratamento das reservations
*/
router.get('/reservations', function(req, res, next) {

  reservations.getReservations().then(data=>{
    res.render('admin/reservations', admin.getParams(req, {
      data,
      date:{}
    })); 
  });

});

router.post('/reservations', function(req, res, next) {
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }else{
      reservations.save(fields, res).then(results=>{
          res.send(results);
      }).catch(e=>{        
          res.send(e);
      });  
    }    
  });
 
});

router.put('/reservations', function(req, res, next) {
  
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }else{      
      reservations.update(fields).then(results=>{
        res.send(results);
        //console.log(results);
      }).catch(e=>{
        //console.log(e);
        res.send(e);
      })
    }
  }); 
});

router.delete('/reservations/:id', function(req, res, next) {
  reservations.delete(req.params.id).then(results=>{
        res.send(results);
       // console.log(results);
      }).catch(e=>{
       //console.log(e);
        res.send(e);
      }) 
});

/*
*Rotinas para  o tratamento de users
 */
router.get('/users', function(req, res, next) {
  
  res.render('admin/users',admin.getParams(req, {})); 

});

router.get('/emails', function(req, res, next) {
  
  res.render('admin/emails',admin.getParams(req, {})); 

});
  
module.exports = router;