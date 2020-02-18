const db = require('./connection_db');

module.exports = function querylist() {

    let result = {};
    return new Promise((resolve, reject) => {
        // 找尋
        var sql='SELECT a.*,s.name as subjectname from schedulearticle a left join subject s on a.subjects=s.id';
        var para=[];
     
        db.query(sql, para, function (err, rows) {
            if (err) {
                result.status = "登入失敗。"
                result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;
            }
            result= rows;
            resolve(result);
        });
    });
}