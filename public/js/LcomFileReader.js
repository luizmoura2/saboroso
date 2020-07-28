class LcomFileReader{

    constructor(input, img){
        this.input = input; 
        this.img = img;
        
        this.initInputEvent();

    };

    initInputEvent(){
        document.querySelector(this.input).addEventListener('change', e=>{
            this.reader(e.target.files[0]).then(result=>{                
                document.querySelector(this.img).src = result;
            });
        })
    };

    reader(file){
        return new Promise((resolve, reject)=>{
            let read = new FileReader();
            read.onload = ()=>{
                resolve(read.result);
            };
            read.onerror = ()=>{
                reject('Não foi possível ler o arquivo!')
            };
            read.readAsDataURL(file);
        });

    };
}