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
    },

    update(fields, files){
        return new Promise((resolve, reject)=>{
            let query ='';
            let params = [];
            if (files.photo.name){
                fields.photo = `images/${path.parse(files.photo.path).base}`;
                query = `UPDATE tb_menus SET title =?, description=?,  price=?, photo=? WHERE id=?`;
                params = [
                            fields.title,
                            fields.description,
                            fields.price,
                            fields.photo,
                            fields.id
                        ];
            }else{
                query = `UPDATE tb_menus SET title =?, description=?,  price=? WHERE id=?`;
                params = [
                            fields.title,
                            fields.description,
                            fields.price,
                            fields.id
                        ];
            }
           
            conn.query(query, params, (err, results)=>{
                        if (err){
                            //console.log(err);
                            reject(err);
                        }else{
                            //console.log(results);
                            resolve(results);
                        }
            });
        });
    },
    /**
     * Excluir o registo do menu de identificador id
     * @param {*} id 
     */
    delete(id){
        return new Promise((resolve, reject)=>{
            let query = `DELETE FROM tb_menus WHERE id = ?`
            conn.query(query, [id], (err,results)=>{
                if (err){
                    //console.log(err);
                    reject(err);
                }else{
                    //console.log(results);
                    resolve(results);
                }
            })
        })
    }
}