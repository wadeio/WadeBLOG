const toInsert = require('../models/comment_p_message_model');
const toQuerycomment = require('../models/comment_s_message_model');

module.exports = class Comment {

     //指定文章留言 or 回覆指定留言
    postcomment(req, res, next) {
         // 獲取client端資料
         const commentData = {
            article_id: req.body.articleid,
            parent_id:req.body.parentid,
            message_name:req.body.name,
            email:req.body.eamil,
            content:req.body.content,
            message_date:onTime()
        }
       
        // 將資料寫入資料庫
        toInsert(commentData).then(result => {
            // 若寫入成功則回傳
            res.json({
                status: "新增成功。",
                result: result 
            })
        }, (err) => {
            // 若寫入失敗則回傳
            res.json({
                result: err
            })
        })
      
      

     
    }

    //查詢該篇文章所有留言
    getallcomment(req, res, next) {

         // 獲取client端資料
         const commentData = {
            article_id: req.query.articleid
        }
       
        console.log(commentData.article_id);
        // 將資料寫入資料庫
        toQuerycomment(commentData).then(result => {
            // 若寫入成功則回傳
            res.json({
                status: "查詢成功。",
                result: result 
            })
        }, (err) => {
            // 若寫入失敗則回傳
            res.json({
                result: err
            })
        })
    }

    
  
}

//取得現在時間，並將格式轉成YYYY-MM-DD HH:MM:SS
const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
}