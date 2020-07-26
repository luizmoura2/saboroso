const conn = require('./../inc/db');

module.exports = {
    render(fields, res, error, clazz){

        res.render('admin/login', {  
            body: fields,
            error: error,
            clazz: clazz
        });  
    },
    login(fields, res){
        
        return new Promise((resolve, reject)=>{
            let query =`SELECT * FROM tb_users WHERE email = '${fields.email}' and password = '${fields.password}'`;
            console.log(query);
            conn.query(query, (error, result)=>{
                if (error){
                    this.render(fields, res, [error.message], 'alert-danger');
                    reject(error) 
                }else{
                    if (result.length > 0){
                        resolve(result);
                    }else{
                        this.render(fields, res, ['Usuário ou senha incorretos!'], 'alert-danger');
                        reject(); 
                    }                                  
                }    
            });
        });
    }

};