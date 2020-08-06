
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
        this.options = Object.assign({},{
                formCreate: '#modal-create form'
             },
            config);
            
            this.initForm();
            this.initButtons();
    }

    initForm(){
        //this.options.formCreate
        //this.form = document.querySelectorAll('form');
        
        /*this.form.save().then(result=>{
            window.location.reload();
        }).catch(err=>{

        });*/
    }

    initButtons(){
        let form = document.querySelectorAll('form');        
        let btns = document.querySelectorAll('button');
        form.forEach(frm=>{  
              
            let frmId = frm.getAttribute('id');
           // let btns = frm.querySelectorAll('button');
            btns.forEach(btn=>{
                
                if (btn.classList.contains('btn-insert') && frmId === 'create'){
                    this.alert = frm.querySelector('#alert');
                    this.actionInsert(btn, frm);
                }
                
                if (btn.classList.contains('btn-update')){ 
                    this.actionUpdate(btn, frm);
                    
                };

                if (btn.classList.contains('btn-password')){
                    this.updatePw(btn, frm); 
                                 
                }

                if (btn.classList.contains('btn-delete')){
                    this.actionDelete(btn, frm);
                    
                }
                
                if (btn.classList.contains('btn-submit')){
                    this.actionSubmit(btn, frm);
                    this.btnSave = btn;
                    
                }

                if (btn.classList.contains('btn-submitPw')){
                    this.actionSubmit(btn, frm); 
                                     
                }
                                
            });
        });
    
    }
    
    actionSubmit= (btn, frm)=>{
        //console.log(btn, frm);
        btn.addEventListener('click', e=>{
           
            this.btnSave.disabled = true;
            let formData = new FormData(frm);
            
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
        
                this.btnSave.disabled = false;
                this.alert.textContent = txt;
            }
        
            if ( errs.length === 0 ){
            
            let option = {};
            if (formData.get('id') === '0'){
                option = { method: 'post', body: formData };
            }else{
                option = { method: 'put', body: formData  };
            }
            
            let path = frm.getAttribute('action'); 
            console.log(path, option);
            fetch(path, option)
                .then(response=>response.json())
                .then(json=>{    
                    window.location.reload()
                }).catch(e=>{
                    console.log(e);
                });
            }
        })  
    };
    
    actionInsert =  (btn, frm) =>{
        btn.addEventListener('click', e=>{
            let inpt = frm.querySelector('#inputPasswordCreate');
            if (inpt){
                inpt.disabled = false; 
            }  
            let aux = JSON.parse(btn.dataset.aux);
            console.log(aux);
            frm.querySelector(`#${aux.hidden}`).value = '0';
            frm.querySelector('.modal-title').textContent = aux.title;
            frm.setAttribute('method', 'post');
            frm.setAttribute('action', `/admin/${aux.screen}`);

             $(`#${aux.target}`).modal('show');
        });
    };

    updatePw = (btn, frm)=>{
        
        btn.addEventListener('click', e=>{
            let aux = JSON.parse(btn.dataset.aux);
            frm.querySelector(`#${aux.hidden}`).value = aux.id;
            frm.querySelector('.modal-title').textContent = aux.title;
            frm.setAttribute('method', 'put');
            frm.setAttribute('action', `/admin/${aux.screen}`);
            $(`#${aux.target}`).modal('show');
        });
    }

    actionUpdate = (btn, frm)=>{
        //console.log(btn, frm);
        btn.addEventListener('click', e=>{
            let inpt = frm.querySelector('#inputPasswordCreate');
            if (inpt){
                inpt.disabled = true; 
            }                        
            let aux = JSON.parse(btn.dataset.aux);
            frm.querySelector('.modal-title').textContent = aux.title;
            frm.setAttribute('method', 'put');
            frm.setAttribute('action', `/admin/${aux.screen}`); 
            let row = JSON.parse(btn.dataset.row);
            let inputs  =  frm.querySelectorAll('.form-control');
        
            inputs.forEach(input=>{
                if (input.name === 'date'){
                    input.value = moment(row[input.name]).format('YYYY-MM-DD');
                }else if (input.name === 'photo'){
                    frm.querySelector('img').src = `/${row['photo']}`;
                }else{
                    input.value = row[input.name]; 
                }              
            });
            $(`#${aux.target}`).modal('show'); 
        }); 
    };

    actionDelete = (btn)=>{ 
        //console.log(btn, frm); 
        btn.addEventListener('click', e=>{
            let aux = JSON.parse(btn.dataset.aux);
        
            if (confirm(`Excluir o item ${aux.screen}: id = ${aux.id} de nome ${aux.title}`)){

                fetch(`/admin/${aux.screen}/${aux.id}`, {
                    method:'delete'
                })
                .then(response=>response.json())
                .then(json=>{
                    window.location.reload();
                });
            } 
        });  
    }; 
}