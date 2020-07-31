/**
 * Para utilizar o prototipo chama:
 * let form = document.querySeletor('form');
 * form.save().then(result=>{
 *  ...
 *      console.log(result);
 *      window.location.reload();
 *  ...
 * }).catch(err=>{
 *      console.log(error);
 * });
 * 
 */
HTMLFormElement.prototype.save = function(){
    let form = this;
   return new Promise((resolve, reject)=>{
        form.addEventListener('submit', e=>{
            e.preventDefault();
            let formData = new FormData(form);
            fetch(form.action, {
                method: form.method,
                body: formData
            }).then(response=>response.json())
            .then(json=>{
                resolve(json);
            }).catch(err=>{
                reject(err);
            });
        })
    });

    
}