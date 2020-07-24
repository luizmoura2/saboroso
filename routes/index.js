const conn = require('./../inc/db');
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  menus.getMenus().then(result=>{
    res.render('index', { 
      title: 'Restaurante Saboroso!',
      menus: result,
      isHome: true
    });

  });  

});

router.get('/contacts', function(req, res, next){

  res.render('contacts', { 
    title: 'Contatos - Restaurante Saboroso!',
    background: 'images/img_bg_3.jpg',
    h1: 'Diga um oi!'  
  });
    
});

router.get('/menus', function(req, res, next){

    menus.getMenus().then(result=>{
      res.render('menus',  { title: 'Menus -Restaurante Saboroso!',
        background: 'images/img_bg_1.jpg',
        h1: 'Saboreie nosso menu!!',
        menus: result
      });
    });

});

router.get('/reservations', function(req, res, next){
  
  reservations.render(req.body, res, [], ''); 

});

router.post('/reservations', function(req, res, next){
  
  let err = [];

  if (!req.body.name){
    err.push('*Digite o nome!');
  }
   if (!req.body.email){
    err.push('*Digite o email!\n');
  }
   if (!req.body.people){
    err.push('*Digite quantas pessoas! ');
  }
   if (!req.body.date){
    err.push('*Digite a data!');
  }
   if (!req.body.time){
    err.push('*Digite a hora!');
  }
  
  if (err.length === 0){   
    reservations.save(req.body, res); 
  }else{
    reservations.render(req.body, res, err, 'alert-danger');
  }
  
});

router.get('/services', function(req, res, next){

  res.render('services', { title: 'Serviços - Menus -Restaurante Saboroso!',
      background: 'images/img_bg_1.jpg',
      h1: 'É um prazer poder servir!'
    });
    
});

module.exports = router;
