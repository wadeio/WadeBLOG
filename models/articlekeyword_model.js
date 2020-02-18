const db = require('./connection_db');

module.exports = function querydata(arr) {
    let result = {};
    console.log(arr);
    return new Promise((resolve, reject) => {
                arr.push('Y');
                // 將資料寫入資料庫
                db.query("SELECT * from article where (content like ? or title like ?) and status=?", arr, function (err, rows) {
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
                    result.answer = rows;
                    resolve(rows);
                })
            
        
    })
}