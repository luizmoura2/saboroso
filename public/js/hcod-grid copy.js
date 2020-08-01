
/**
 * Use:
 * new HcodGrid({
 *  deleteUrl: '/admin/reservation/${data.id}
 *  deleteMsg: 'Desja excluir a reserva ${data.nome}',
 * 
 * })
 */
class HcodGrid{

    constructor(config){
        this.options = Object.assign({}, 
            {
                formCreate: '#modal-create form',
                btnUpdate: '.btn-update',
                btnDelete: '.btn-delete'
            },
            config);
            
            this.initForm();
            this.initButtons();
    }

    initForm(){
        this.form = document.querySelector(this.options.formCreate);
        this.form.save().then(result=>{
            window.location.reload();
        }).catch(err=>{

        });
        this.alert = this.form.querySelector('#alert');//Div de msg
    }

    initButtons(){
        this.btnSave = this.form.querySelector('.btn-success');
        let btns = document.querySelectorAll('btn');

            btns.forEach(btn=>{
                if (btn.classList.contains('btn-update')){
                    btn.addEventListener('click', (btn)=>{
                        let aux = JSON.parse(btn.dataset.aux);
                        this.form.querySelector('.modal-title').textContent = aux.title;
                        this.form.setAttribute('method', 'put');
                        this.form.setAttribute('action', `/admin/${aux.screen}`); 
                        let row = JSON.parse(btn.dataset.row);
                        let inputs  =  this.form.querySelectorAll('.form-control');
                    
                        inputs.forEach(input=>{
                          if (input.name === 'date'){
                            input.value = moment(row[input.name]).format('YYYY-MM-DD');
                          }else{
                            input.value = row[input.name]; 
                          }              
                        });//this.actionEdit(btn, 'reservations', 'Alteração de Reserva'));
                    
                    });
                };

                if (btn.classList.contains('btn-delete')){
                    btn.addEventListener('click', this.actionDelete(btn, 'reservations'));
                }
                if (btn.classList.contains('btn-submmit')){
                    btn.addEventListener('click', this.actionSubmit(btn));
                }
            });
            //e=>{
                
                /*let tr = e.path.find(el=>{
                    console.log(el);
                    if (typeof el.tagname === 'string' && el.tagname === 'tr'){
                        console.log(el);
                        return el;
                    };
                })*  /
                
                //let data = JSON.parse(tr.dataset.row);
                let data = JSON.parse(btn.dataset.row);

                for(let name in data){
                    let input = this.form.querySelector(`[name=${name}`)
                
                    switch (name){
                        case 'data':
                            if (input){
                               input.value = moment(data[name]).format('YYYY-MM-DD');
                            }
                            break
                        default:
                            if (input){
                                input.value = data[name];
                            }
                    }             
                }
               
              $('#modal-create').modal('show')  ;
            })*/
        //});

        [...document.querySelectorAll(this.options.btnDelete)].forEach(btn=>{
            btn.addEventListener('click', e=>{
                let tr = e.path.find(el=>{
                    return el.tagname.toUpperCase() === 'TR'
                })
                let data = JSON.parse(tr.dataset.row);

                if (confirm(eval('`'+this.options.deleteMsg+'`'))){
                    fetch(eval('`'+his.options.deleteUrl+'`'), {
                        method: 'delete'
                    }).then(response=>response.json())
                    .then(json=>{
                        window.location.reload();
                    })
                }
            })
        });
    }

    actionSubmit = (e)=>{  
        
        btnSave.disabled = true;
        let formData = new FormData(this.form);
        
        let errs = [];
    
        for(var [campo, vlr] of formData){
             if (vlr === '' && campo !== 'id'){
               errs.push(`O campo '${campo}', não pode ser nulo!`);  
             }
        };
        if (errs.length>0){
            this.alert.classList.add('alert-danger');
            let txt = '';
    
            errs.forEach(err=>{       
              txt = `${txt},  *${err}`;
            });
    
            btnSave.disabled = false;
            this.alert.textContent = txt;
        }
    
        if ( errs.length === 0 ){
          
          let option = {};
          if (formData.get('id') === '0'){
            option = { method: 'post', body: formData };
          }else{
            option = { method: 'put', body: formData  };
          }
         
          let path = this.form.getAttribute('action'); 
         fetch(path, option)
            .then(response=>response.json())
            .then(json=>{    
              window.location.reload()
            }).catch(e=>{
              console.log(e);
            });
        }
    };

    actionEdit =  (btn, acao, titulo)=>{
        this.form.querySelector('.modal-title').textContent = titulo;
        this.form.setAttribute('method', 'put');
        this.form.setAttribute('action', `/admin/${acao}`); 
        let row = JSON.parse(btn.dataset.row);
        let inputs  =  this.form.querySelectorAll('.form-control');
    
        inputs.forEach(input=>{
          if (input.name === 'date'){
            input.value = moment(row[input.name]).format('YYYY-MM-DD');
          }else{
            input.value = row[input.name]; 
          }              
        });
            
        $('#modal-create').modal('show');   
    }

    actionDelete = (btn, acao)=>{  
    let id = btn.dataset.id;
    let title = btn.dataset.title;
    option = { method: 'delete' };
    if (confirm(`Excluir o item ${acao}: id = ${id} de nome ${title}`)){

        fetch(`/admin/${acao}/${id}`, option)
        .then(response=>response.json())
        .then(json=>{
            window.location.reload();
        });
    }    
    }; 
}