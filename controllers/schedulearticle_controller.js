const toInsert = require('../models/schedule_p_article_model');
const toQuery= require('../models/schedule_s_article_model');
const toRemove= require('../models/schedule_p_rarticle_model');
const verify = require('../models/verification_model');
const Check = require('../service/member_check');
var moment = require('moment');
check = new Check();
module.exports = class schedulearticle {

     //新增排程文章
    postarticletask(req, res, next) {
        var token = req.cookies.auth;

        if(check.checkNull(token) === true) {
            res.json({
                err: "請輸入token！"
            })
        }else if (check.checkNull(token) === false){
            verify(token).then(tokenResult => {
                if (tokenResult === false) {
                    res.json({
                        result: {
                            status: "token錯誤。",
                            err: "請重新登入。"
                        }
                    })
                } else {
                    //已登入狀態
                    const id = tokenResult;
                        // 獲取client端資料
                      // 獲取client端資料
                    let create_date= moment(req.body.createdate).format("YYYY-MM-DD HH:mm:ss");
                    const articleData = {
                    article_id: req.body.articleid,
                    title:req.body.title,
                    subjects:req.body.subjects,
                    category:req.body.category,
                    createdate:create_date,
                    publish_date:req.body.publishtime,
                    status:"Y"
                }
                
                // 將資料寫入資料庫
                toInsert(articleData).then(result => {
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
            });
        }
    
          


      
      

     
    }
    

   //刪除排程任務
   postremove(req, res, next) {

    var token = req.cookies.auth;

        if(check.checkNull(token) === true) {
            res.json({
                err: "請輸入token！"
            })
        }else if (check.checkNull(token) === false){
            verify(token).then(tokenResult => {
                if (tokenResult === false) {
                    res.json({
                        result: {
                            status: "token錯誤。",
                            err: "請重新登入。"
                        }
                    })
                } else {
                    //已登入狀態
                    const id = tokenResult;
                        // 獲取client端資料
                    var val=req.body.id;
                
                    // 將資料寫入資料庫
                    toRemove(val).then(result => {
                        // 若寫入成功則回傳
                        res.json({
                            status: "刪除成功。",
                            result: result 
                        })
                    }, (err) => {
                        // 若寫入失敗則回傳
                        res.json({
                            result: err
                        })
                    })   
                    
                }
            });
        }
    
          
   }

     //搜尋排程文章列表
    gettasklist(req, res, next) {
        //console.log("搜尋文章");
        var token = req.cookies.auth;

        if(check.checkNull(token) === true) {
            res.json({
                err: "請輸入token！"
            })
        }else if (check.checkNull(token) === false){
            verify(token).then(tokenResult => {
                if (tokenResult === false) {
                    res.json({
                        result: {
                            status: "token錯誤。",
                            err: "請重新登入。"
                        }
                    })
                } else {
                    //已登入狀態
                    const id = tokenResult;
                       // 獲取client端資料   
                    //console.log(commentData.article_id);
                    // 將資料寫入資料庫
                    toQuery().then(result => {
                        // 若寫入成功則回傳
                        res.json({
                            status: "查詢成功。",
                            data: result 
                        })
                    }, (err) => {
                        // 若寫入失敗則回傳
                        res.json({
                            result: err
                        })
                    })
                    
                }
            });
        }
      

     
    }

    

    
  
}