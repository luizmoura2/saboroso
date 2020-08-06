const conn = require('./../inc/db');
var menus = require('./../inc/menus');
//var reservations = require('./../inc/bdActions');
var contacts = require('./../inc/contacts');
var express = require('express');
const bdAction = require('./../inc/bdActions');
var router = express.Router();

module.exports = function(io){
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
      
        contacts.render(req.body, res, [], '');

    });

    router.post('/email', function(req, res, next){
        bdAction.actionSave(req.fields, 'tb_emails').then(results=>{ 
          //io.emit('dashboard update');
          console.log(results);           
        }).catch(e=>{ 
          console. log(e);
        });
    });

    router.post('/contacts', function(req, res, next){
      let fields = req.fields;
      let err = [];

      if (!fields.name){
        err.push('* Digite o nome!');
      }
      if (!fields.email){
        err.push('* Digite o email!\n');
      }
      if (!fields.message){
        err.push('* Digite a mensagem! ');
      }   
      let data = {
        title:'Contacts - Restaurante Saboroso!',
        image: 'images/img_bg_3.jpg',
        dica: 'Diga um oi!',
        url: 'contacts',
        error:'',
        clazz: ''
      };
      if (err.length === 0){   
        io.emit('dashboard update');
        bdAction.actionSave(fields, 'tb_contacts').then(results=>{ 
          data.error = ['Insert succeful', [results]];
          data.clazz = 'alert-success';

          io.emit('dashboard update');
          bdAction.render({}, res, data);            
        }).catch(e=>{ 
          data.error = e;
          data.clazz = 'alert-danger';

          bdAction.render(fields, res, data);
        });         
      }else{
        data.error = err;
        data.clazz = 'alert-danger'; 

        bdAction.render(fields, res, data);        
      }
      
        
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
      let data = {
        title: 'Reservas - Restaurante Saboroso!',
        image: 'images/img_bg_2.jpg',
        dica: 'Reserve uma mesa!',
        url: 'reservations',
        error:'',
        clazz: ''
      };
      bdAction.render(req.fields, res, data); 

    });

    router.post('/reservations', function(req, res, next){
      let fields = req.fields;
      let err = [];
      
      if (!fields.name){
        err.push('*Digite o nome!');
      }
      if (!fields.email){
        err.push('*Digite o email!\n');
      }
      if (!fields.people){
        err.push('*Digite quantas pessoas! ');
      }
      if (!fields.date){
        err.push('*Digite a data!');
      }
      if (!fields.time){
        err.push('*Digite a hora!');
      }
      let data = {
        title: 'Reservas - Restaurante Saboroso!',
        image: 'images/img_bg_2.jpg',
        dica: 'Reserve uma mesa!',
        url: 'reservations',
        error:'',
        clazz: ''
      };
      if (err.length === 0){ 
        
        if (fields.date.indexOf('/') > -1){
          let dma = fields.date.split('/');
          fields.date = `${dma[2]}-${dma[1]}-${dma[0]}]`;
        }
        
        bdAction.actionSave(fields, 'tb_reservations').then(results=>{  
          data.error = ['Insert succeful', [results]];
          data.clazz = 'alert-success';  

          io.emit('dashboard update');
          bdAction.render({}, res, data);            
        }).catch(e=>{
          data.error = e;
          data.clazz = 'alert-danger';

          bdAction.render(fields, res, data);
        });        
      }else{
        data.error = err;
        data.clazz = 'alert-danger'; 
        bdAction.render(fields, res, data);
      }
      
    });

    router.get('/services', function(req, res, next){

      res.render('services', { title: 'Serviços - Menus -Restaurante Saboroso!',
          background: 'images/img_bg_1.jpg',
          h1: 'É um prazer poder servir!'
        });
        
    });


  return router;
} 
