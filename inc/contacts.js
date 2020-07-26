const conn = require('./../inc/db');

module.exports = {
    render(fields, res, error, clazz){

        res.render('contacts', { 
            title: 'Contatos - Restaurante Saboroso!',
            background: 'images/img_bg_3.jpg',
            h1: 'Diga um oi!',  
            body: fields,
            error: error,
            clazz: clazz
        });  
    },
    save(fields, res){
        
        return new Promise((resolve, reject)=>{
            conn.query(`INSERT INTO tb_contacts(name, email, message) VALUES (?, ?, ?)`, [
                fields.name,
                fields.email,
                fields.message     
            ], (error, result)=>{
                if (error){
                    this.render(fields, res, [error.message], 'alert-danger');
                    reject(error) 
                }else{
                    fields = {};
                    this.render(fields, res, ['Insert succeful', [result]], 'alert-success');
                    resolve(result);                                  
                }    
            });
        });
    }

};