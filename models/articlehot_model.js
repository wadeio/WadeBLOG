const db = require('./connection_db');

module.exports = function query(articleData) {
    let result = {};
    return new Promise((resolve, reject) => {

                var sql="SELECT * from article where status=?";
                var para=["Y"];
                if(articleData.subjectidx>0){
                    sql+=" and subject=?";
                    para.push(articleData.subjectidx);
                }

                sql+=" order by views desc limit ?";
                para.push(3);

                // 將資料寫入資料庫
                db.query(sql, para, function (err, rows) {
                    // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
                    if (err) {
                        console.log(err);
                        result.status = "查詢失敗。";
                        result.err = "伺服器錯誤，請稍後在試！"
                        reject(result);
                        return;
                    }
                    // 若寫入資料庫成功，則回傳給clinet端下：
                    rows.forEach(element => {
                        element.img=element.img.toString('utf8');
                    });
                    result.status = "查詢成功。"
                    result.categorydata = rows;
                    resolve(result);
                })
            
        
    })
}