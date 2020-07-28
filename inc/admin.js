var conn = require('./db');

module.exports ={

    dashboard(){
        let query = `SELECT
                (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
                (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
                (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
                (SELECT COUNT(*) FROM tb_users) AS nrusers;`;
        return new Promise((resolve, reject)=>{           
            conn.query(query, (err, result)=>{
                if (err){
                    reject(err);
                }else{
                    resolve(result[0]);
                }
            })
        });
    },
       
    getParams(req, params){
        return Object.assign({
            menus: req.menus,
            user: req.session.user[0]
        }, params );
    },

    getMenus(req){
      let menus =  [
           {
            text:'Tela Inicial',
            href:'/admin/',
            icon:'home',
            active:false
           },
           {
            text:'Menus',
            href:'/admin/menus',
            icon:'cutlery',
            active:false
           },
           {
            text:'Reservas',
            href:'/admin/reservations',
            icon:'calendar-check-o',
            active:false
           },
           {
            text:'Contatos',
            href:'/admin/contacts',
            icon:'comments',
            active:false
           },
           {
            text:'Usuários',
            href:'/admin/users',
            icon:'users',
            active:false
           },
           {
            text:'E-mails',
            href:'/admin/emails',
            icon:'envelope',
            active:false
           }
       ] 
       menus.map(menu=>{
           if (menu.href === `/admin${req.url}`){
                menu.active= true;
           }
           
       });
       return menus;
    }
}