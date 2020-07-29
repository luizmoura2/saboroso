const conn = require('./../inc/db');

module.exports = {

    render(fields, res, error, clazz){
        res.render('reservations', { title: 'Reservas - Restaurante Saboroso!',
            background: 'images/img_bg_2.jpg',
            h1: 'Reserve uma Mesa!',
            body: fields,
            error: error,
            clazz: clazz
        });  
    },

    getReservations(){
        let query = "SELECT * FROM tb_reservations ORDER BY date, time";
        
        return new Promise((resolve, reject)=>{
        
            conn.query(query, (err, result)=>{
                
                if (err){
                    reject(err);
                }
                    
                resolve(result);
                
            });
        });
    },
    /**
     * Salva o registro de reserva em Banco de dados
     * @param {*} fields 
     * @param {*} res 
     */
    save(fields, res){

        if (fields.date.indexOf('/') > -1){
            let dma = fields.date.split('/');
            fields.date = `${dma[2]}-${dma[1]}-${dma[0]}]`;
        }
        let query = `INSERT INTO tb_reservations(name, email, people, date, time) VALUES (?, ?, ?, ?, ?)`;
        let params =  [
                        fields.name,
                        fields.email,
                        fields.people,
                        fields.date,
                        fields.time          
                    ];
                    
        return new Promise((resolve, reject)=>{
            conn.query(query, params, (error, result)=>{
                if (error){
                    reject(error) 
                }else{
                    resolve(result);                                  
                }    
            });
        });
    },
    /**
     * Atualiza o registro de reserva no Banco de dados
     * @param {*} fields 
     * @param {*} files 
     */
    update(fields){
        return new Promise((resolve, reject)=>{
                   
            let query = `UPDATE tb_reservations SET name=?, email=?, people=?, date=?, time=? WHERE id=?`;
            let params = [
                            fields.name,
                            fields.email,
                            fields.people,
                            fields.date,
                            fields.time,
                            fields.id
                        ];          
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
     * Exclui o registro da reserva de identificador id
     * @param {*} id 
     */
    delete(id){
        return new Promise((resolve, reject)=>{
            let query = `DELETE FROM tb_reservations WHERE id = ?`
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

};