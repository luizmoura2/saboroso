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

    actionGet(table, order){
        let query = `SELECT * FROM ${table} ORDER BY ${order}`;
        
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
     * Monta os arrary de parametros e valores
     * nas variáveis globais: this.value e this.params, para 
     * inserção de dados no Banco
     * @param {object} fields Os campos e os valores 
     * a serem transformados nas tuplas da tabela
     */
    assemblerInsert(fields){
        this.tuplas = [];
        this.params = []; 
        this.interr = [];
        for(var key in fields){
            if (key !== 'id'){
                this.tuplas.push(key);
                this.params.push(fields[key]);
                this.interr.push('?')
            }            
        }
    },

    /**
     * Salva o registro de reserva em Banco de dados
     * @param {object} fields Os campos a serem inseridos
     * @param {string} table O nome da tabela onde haverá a inserção
     */
    actionSave(fields, table){
        this.assemblerInsert(fields);
                
        let query = `INSERT INTO ${table}(${this.tuplas.join()}) VALUES (${this.interr.join()})`;
        let params = this.params;
        
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

    assemblerUpdate(fields){
        this.keys = [];
        this.vals = [];
        let id = '';
        for(var key in fields){
         if (key !== 'passwordConfirm'){
            if (key === 'id'){
                id = fields[key]
            }else{
                this.keys.push(key+'=?');
                this.vals.push(fields[key]);
            }
            
          }
        }
        this.vals.push(id);
    },
    /**
     * Atualiza o registro de reserva no Banco de dados
     * @param {object} fields Os campos com o Id, a serem alterados
     * @param {*} table O nome da tabela onde haverá a atualização
     */
    actionUpdate(fields, table){
        return new Promise((resolve, reject)=>{
            this.assemblerUpdate(fields);
            let query = `UPDATE ${table} SET ${this.keys.join()} WHERE id=?`;
            let params = this.vals;
            conn.query(query, params, (err, results)=>{
                if (err){
                    reject(err);
                }else{                   
                    resolve(results);
                }
            });
        });
    },

    /**
     * Exclui o registro da reserva de identificador id
     * @param {string} table O nome da tabela 
     * @param {string} id O id do resitro a ser excluido
     */
    actionDelete(table, id){
        return new Promise((resolve, reject)=>{
            let query = `DELETE FROM ${table} WHERE id = ?`
            conn.query(query, [id], (err, results)=>{
                if (err){
                    reject(err);
                }else{
                    resolve(results);
                }
            })
        })
    }

};