
/**
 * Use:
 * new HcodGrid({
 *  deleteUrl: '/admin/reservation/${data.id}
 *  deleteMsg: 'Desja excluir a reserva ${data.nome}',
 * 
 * })
 */
class HcodeGride{

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
    }

    initButtons(){
        [...documento.querySelectorAll(this.options.btnUpdate)].forEach(btn=>{
            btn.addEventListener('click', e=>{
                
                let tr = e.path.find(el=>{
                    return el.tagname.toUpperCase() === 'TR'
                })
                
                let data = JSON.parse(tr.dataset.row);

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
            })
        });

        [...documento.querySelectorAll(this.options.btnDelete)].forEach(btn=>{
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
}