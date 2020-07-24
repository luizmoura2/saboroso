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
    save(fields, res){
        let dma = fields.date.split('/');
        dma = `${dma[2]}-${dma[1]}-${dma[0]}]`
        return new Promise((resolve, reject)=>{
            conn.query(`INSERT INTO tb_reservations(name, email, people, date, time) VALUES (?, ?, ?, ?, ?)`, [
                fields.name,
                fields.email,
                fields.people,
                dma,
                fields.time          
            ], (error, result)=>{
                if (error){
                    this.render(fields, res, [error], 'alert-danger');
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