let conn = require('./db');
const { forEach } = require('mysql2/lib/constants/charset_encodings');

class Pagination{
    constructor(table, order, req, itmPerPag = 10){
        this.table = table;
        this.order = order;
        this.params = [];
        this.itmPerPag = itmPerPag;
        this.dtStart = req.query.start;
        this.dtEnd = req.query.end;
    }

    getPage(page){
        this.curPag = page;
        this.iniReg = (page-1)*this.itmPerPag; //Porque o banco começa com zero se for a primeira pagina=1 tem que 
        let query = [];
        let params = [];
        let WHERE = '';
        if (this.dtStart && this.dtEnd){
           WHERE = ` WHERE date BETWEEN '${this.dtStart}' AND '${this.dtEnd}'`;
        }      
        query.push(`SELECT * FROM ${this.table} ${WHERE} ORDER BY ${this.order} LIMIT ${this.iniReg}, ${this.itmPerPag} `); 
        query.push(` SELECT count(*) AS ttlReg FROM ${this.table} ${WHERE}`);
        
            console.log(query.join(';'), params);
        return new Promise((resolve, reject)=>{
            conn.query(query.join(';'), (err, result)=>{
                if (err){
                    reject(err);
                }else{
                    this.data = result[0];
                    this.ttlReg = result[1][0].ttlReg;
                    this.ttlPag = Math.ceil(this.ttlReg/this.itmPerPag);
                    this.curPag = page;
                    
                    resolve(this.data);
                }
            });
        });   
    }

    getTtlReg(){
        return this.ttlReg;
    }

    getTtlPag(){
        return this.ttlPag;
    }

    getCurPag(){
        return parseInt(this.curPag);
    }

    getNav(params){
        let limitNav = 5;
        let links = [];
        let nrStart = 0;
        let nrEnd = 0;
        let ttlPag = parseInt(this.getTtlPag());
        let curPag = parseInt(this.getCurPag());
        if ( ttlPag < limitNav){
            limitNav = ttlPag;
        }
        if ((curPag - parseInt(limitNav/2)) < 1){
            nrStart = 1;
            nrEnd = limitNav;
        }else if ((curPag + parseInt(limitNav/2)) > ttlPag){
            nrStart = ttlPag - limitNav;
            nrEnd = ttlPag;
        }else{
            nrStart = curPag - parseInt(limitNav/2);
            nrEnd = curPag + parseInt(limitNav/2);
        }

        if (curPag > 1){
            links.push({
                text: '«',
                href: '?'+this.getQueryString(Object.assign({}, params, {page:curPag-1})),
                clazz: 'active'
            });
        }

        for(let i=nrStart; i<=nrEnd; i++){
            let active = '';
            let href = '?'+this.getQueryString(Object.assign({}, params, {page:i}));
            if (i == curPag){
                active = 'active';
                href = '#';
            } 
            links.push({
                text: i,
                href: href,
                clazz: active
            });
        }

        if (curPag < ttlPag){
            links.push({
                text: '»',
                href: '?'+this.getQueryString(Object.assign({}, params, {page:curPag+1})),
                clazz: 'active'
            });
        }
       
        return links;

    }
    getQueryString(params){
        let queryString = [];
        for(let name in params){
            queryString.push(
                `${name}=${params[name]}`
            )
        }
        return queryString.join('&');
    }
}
module.exports = Pagination;