const db = require('./connection_db');

module.exports = function update(articleData) {
    let result = {};
    return new Promise((resolve, reject) => {
                // 將資料寫入資料庫
                db.query('UPDATE article SET views=? where id=?', [articleData.views,articleData.id], function (err, rows) {
                    // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
                    if (err) {
                        console.log(err);
                        result.status = "更新失敗。";
                        result.err = "伺服器錯誤，請稍後在試！"
                        reject(result);
                        return;
                    }
                    // 若寫入資料庫成功，則回傳給clinet端下：
                    result.status = "更新成功。"
                    result.articleData = articleData;
                    resolve(result);
                })
            
        
    })
}