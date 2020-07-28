let conn = require('./db');
var path = require('path');

module.exports = {

    getMenus(){
        let query = "SELECT * FROM tb_menus ORDER BY title";
        return new Promise((resolve, reject)=>{
        
            conn.query(query, (err, result)=>{
                
                if (err){
                    reject(err);
                }
                    
                resolve(result);
                
            });
        });
    },

    save(fields, files){
        return new Promise((resolve, reject)=>{
            
            fields.photo = `images/${path.parse(files.photo.path).base}`;
            let query = `INSERT INTO tb_menus(title, description,  price, photo) VALUES(?, ?, ?, ?)`;

            conn.query(query, [
                                fields.title,
                                fields.description,
                                fields.price,
                                fields.photo
                            ], (err, results)=>{
                                if (err){
                                    console.log(err);
                                    reject(err);
                                }else{
                                    console.log(results);
                                    resolve(results);
                                }
            })
        });

    }
}