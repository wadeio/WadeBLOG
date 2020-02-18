const db = require('./connection_db');

module.exports = function querydata(articleData) {
    let result = {};
    return new Promise((resolve, reject) => {
                var sql='SELECT a.*,s.name as subjectname from article a left join subject s on a.subject=s.id ';
                var para=[];
                sql+='where (status=?)';
                para.push("N");
                
                
                
                // 將資料寫入資料庫
                db.query(sql,para, function (err, rows) {
                    // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
                    if (err) {
                        console.log(err);
                        result.status = "查詢失敗。";
                        result.err = "伺服器錯誤，請稍後在試！"
                        reject(result);
                        return;
                    }
                    // 若寫入資料庫成功，則回傳給clinet端下：
                    //result.status = "更新成功。"
                    //result.Saveabout = aboutData;
                  
                    rows.forEach(element => {
                        element.img=element.img.toString('utf8');
                    });
                    //console.log(rows);
                    resolve(rows);
                })
            
        
    })
}