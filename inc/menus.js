let conn = require('./db');

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
    }
}