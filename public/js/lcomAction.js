  let formCreate = document.querySelector('#modal-create form');
  let alert = formCreate.querySelector('#alert');
  let btnSave = formCreate.querySelector('.btn-success');
  
  
  //formCreate.addEventListener('submit', e=>{
  actionSubmit = (e)=>{  
    ///e.preventDefault();
    //console.log(e);
   // console.log('entrou')  ;
    
    btnSave.disabled = true;
    let formData = new FormData(formCreate);
    
    let errs = [];

    for(var [campo, vlr] of formData){
         if (vlr === '' && campo !== 'id'){
           errs.push(`O campo '${campo}', não pode ser nulo!`);  
         }
    };
    if (errs.length>0){
        alert.classList.add('alert-danger');
        let txt = '';

        errs.forEach(err=>{       
          txt = `${txt},  *${err}`;
        });

        btnSave.disabled = false;
        alert.textContent = txt;
    }

    if ( errs.length === 0 ){
      let path = formCreate.getAttribute('action'); 
      let option = {};
      if (formData.get('id') === '0'){
        option = { method: 'post', body: formData };
      }else{
        option = { method: 'put', body: formData  };
      }
     
     //console.log(path, option);
     fetch(path, option)
        .then(response=>response.json())
        .then(json=>{ 
          //console.log(json);     
          window.location.reload()
        }).catch(e=>{
          console.log(e);
        });
    }
  };

  actionInsert =  (btn, acao, titulo)=>{
    formCreate.querySelector('#inputIdUpdate').value = '0';
    formCreate.querySelector('.modal-title').textContent = titulo;
    formCreate.setAttribute('method', 'post');
    formCreate.setAttribute('action', `/admin/${acao}`);    
    $('#modal-create').modal('show');
  };

  actionEdit =  (btn, acao, titulo)=>{
    formCreate.querySelector('.modal-title').textContent = titulo;
    formCreate.setAttribute('method', 'put');
    formCreate.setAttribute('action', `/admin/${acao}`); 
    let row = JSON.parse(btn.dataset.row);
    let inputs  = formCreate.querySelectorAll('.form-control');

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

  $('#modal-create').on('hidden.bs.modal', e=>{    
    alert.textContent = '';
    alert.classList.remove('alert-danger');
    btnSave.disabled = false;
    formCreate.reset();
  });
  
