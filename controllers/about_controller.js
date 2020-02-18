const toSave = require('../models/about_model');
const toQuery = require('../models/getabout_model');
const verify = require('../models/verification_model');
const Check = require('../service/member_check');
check = new Check();
module.exports = class About {

     //更新關於文章
    postabout(req, res, next) {
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
                    const aboutData = {
                        title: req.body.title,
                        content: req.body.content
                    }
                    // 將資料寫入資料庫
                    toSave(aboutData).then(result => {
                        // 若寫入成功則回傳
                        res.json({
                            status: "更新成功。",
                            result: result 
                        })
                    }, (err) => {
                        // 若寫入失敗則回傳
                        res.json({
                            result: err
                        })
                    });
                    
                }
            });
        }
      

     
    }

    //取得關於文章
    getabout(req, res, next) {
        // 將資料寫入資料庫
        toQuery().then(result => {
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