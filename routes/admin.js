var express = require('express');
var router = express.Router();
var users = require('./../inc/users');
var admin = require('./../inc/admin');
//var menus = require('./../inc/menus');
//var reservations = require('./../inc/reservations');
var bdAction = require('./../inc/bdActions');
var path = require('path');
var formidable = require('formidable');
var moment = require('moment');
moment.locale('pt-BR')

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
  console.log(req.fields);
  if (!req.fields.email){
    err.push('* Digite o nome!');
  }
   if (!req.fields.password){
    err.push('* Digite o email!\n');
  }

  if (err.length === 0){   
    users.login(req.fields, res).then(user=>{
      req.session.user = user;
      res.redirect('/admin');
    });
  }else{
    users.render(req.fields, res, err, 'alert-danger');
  }
    
});

router.get('/login', function(req, res, next) {

  users.render(req, res, [], '');

});

/* Procedimento para  Contacts*/
router.get('/contacts', function(req, res, next) {
  bdAction.actionGet('tb_contacts', 'id').then(data=>{
    res.render('admin/contacts', admin.getParams(req, {
      data,
      date:{},
      moment
    })); 
  });
});

router.delete('/contacts/:id', function(req, res, next) {
  bdAction.actionDelete('tb_contacts', req.params.id).then(results=>{
    res.send(results);    
  }).catch(e=>{ 
    res.send(e);
  });
});

/* Procedimento para Menus*/
router.post('/menus', function(req, res, next) {
  
  let fields = req.fields;
  let files = req.files;
  fields.photo = `images/${path.parse(files.photo.path).base}`;
  
  bdAction.actionSave(fields, 'tb_menus').then(results=>{      
        res.send(results);
      }).catch(e=>{
        res.send(e);
      }); 
});

router.put('/menus', function(req, res, next) {

  bdAction.actionUpdate(req.fields, 'tb_menus').then(results=>{        
        res.send(results);
        
      }).catch(e=>{
        
        res.send(e);
      })
  
});

router.delete('/menus/:id', function(req, res, next) {
  
  bdAction.actionDelete('tb_menus', req.params.id).then(results=>{ 
        res.send(results);
      
      }).catch(e=>{
     
        res.send(e);
      }) 
});

router.get('/menus', function(req, res, next) {
  
  bdAction.actionGet('tb_menus', 'title').then(data=>{
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
  let start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
  let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');
  //bdAction.actionGet('tb_reservations', 'name', req).then(data=>{ 
    bdAction.actionPagination('tb_reservations', 'name', req).then(pag=>{ 
    res.render('admin/reservations', admin.getParams(req, {
      data: pag.data,
      ttlReg: pag.ttlReg,
      ttlPag: pag.ttlPag,
      curPag: pag.curPag,
      links: pag.links,
      date:{
        start: start,
        end: end
      },
      moment,
      
    })); 
  });
});

router.post('/reservations', function(req, res, next) {
  let fields = req.fields;
  if (fields.date.indexOf('/') > -1){
    let dma = fields.date.split('/');
    fields.date = `${dma[2]}-${dma[1]}-${dma[0]}]`;
  }
  bdAction.actionSave(fields, 'tb_reservations').then(results=>{      
        res.send(results);
      }).catch(e=>{
        res.send(e);
      });  
});

router.put('/reservations', function(req, res, next) {
  
    bdAction.actionUpdate(req.fields, 'tb_reservations').then(results=>{        
      res.send(results);
      
    }).catch(e=>{
      
      res.send(e);
    })
});

router.delete('/reservations/:id', function(req, res, next) {
  
      bdAction.actionDelete('tb_reservations', req.params.id).then(results=>{ 
        res.send(results);
      
      }).catch(e=>{
     
        res.send(e);
      }) 
      
});

/*
*Rotinas para  o tratamento de users
 */
router.get('/users', function(req, res, next) {
  bdAction.actionGet('tb_users', 'name').then(data=>{
    res.render('admin/users', admin.getParams(req, {
      data     
    })); 
  });
});

router.post('/users', function(req, res, next) {
  bdAction.actionSave(req.fields, 'tb_users').then(results=>{
      res.send(results);
  }).catch(e=>{        
      res.send(e);
  }); 

});

router.put('/users/pw', function(req, res, next) {
  bdAction.actionUpdate(req.fields, 'tb_users').then(results=>{
      res.send(results);
    }).catch(e=>{
      console.log(e);
      res.send(e);
    });
});

router.put('/users', function(req, res, next) {
  bdAction.actionUpdate(req.fields, 'tb_users').then(results=>{
      res.send(results);
    }).catch(e=>{
      console.log(e);
      res.send(e);
    });
});

router.delete('/users/:id', function(req, res, next) {
  bdAction.actionDelete('tb_users', req.params.id).then(results=>{
        res.send(results);
      }).catch(e=>{
        res.send(e);
      }) 
});

/*Procedimento para tratamento de emails */
router.get('/emails', function(req, res, next) {
  bdAction.actionGet('tb_emails', 'email').then(data=>{
    res.render('admin/emails',admin.getParams(req, {
      data     
    })); 
  });
});
  
router.delete('/emails/:id', function(req, res, next) {
  bdAction.actionDelete('tb_emails', req.params.id).then(results=>{
        res.send(results);
    }).catch(e=>{
      res.send(e);
    }) 
});

module.exports = router;