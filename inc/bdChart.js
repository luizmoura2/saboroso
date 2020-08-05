const conn = require('./db');
const { values } = require('mysql2/lib/constants/charset_encodings');
var moment = require('moment');

module.exports = {

    chart(req){
        return new Promise((resolve, reject)=>{
            let query = `SELECT
                        concat(year(date),'-',month(date)) as date,
                        count(*) as total,
                        sum(people)/count(*) as avg_people
                    FROM tb_reservations
                    WHERE date BETWEEN '${req.query.start}' and '${req.query.end}'
                    GROUP BY YEAR(date) DESC, month(date) DESC
                    ORDER BY YEAR(date) DESC, month(date) DESC;`;
console.log(query);
            conn.query(query, (err, results)=>{
                if (err){
                    reject(err);
                }else{
                    let months = [];
                    let values = [];
                    results.forEach(row=>{
                        months.push(moment(row.date).format('MMM-YYYY'));
                        values.push(row.total);
                    });
                    resolve({
                        months,
                        values
                    })
                }
            });
        })
    }

};