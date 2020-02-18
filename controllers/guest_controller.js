const toGuestall =require('../models/guest_s_all_model');
const toGuestweek =require('../models/guest_s_week_model');
const toGuestday =require('../models/guest_s_day_model');
const toGuestInfo =require('../models/guest_s_info_model');
var moment = require('moment');
const verify = require('../models/verification_model');
const Check = require('../service/member_check');
check = new Check();
module.exports = class Guest {

     //取得總瀏覽人數
     getGuestAll(req, res, next) { 
        // 獲取client端資料
        const guestData = {
           current_time:moment().format('YYYY-MM-DD')
        }

        // 將資料寫入資料庫
        toGuestall().then(result => {
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

     //取得本週瀏覽人數
     getGuestWeek(req, res, next) {

        //取得當前日期時間
        var now=moment().format('YYYY-MM-DD');
        //取得該日期為當週第幾天
        var weekOfday = moment(now,'YYYY-MM-DD').format('E');
        //console.log(weekOfday);
        //取得一週起始日期
        var last_monday = moment().subtract(weekOfday, 'days').format('YYYY-MM-DD');
        //console.log(last_monday);

        // 獲取client端資料
        const guestData = {
            date_start:last_monday,
            date_end:now
       }
        // 將資料寫入資料庫
        toGuestweek(guestData).then(result => {
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

     //取得今日瀏覽人數
     getGuestDay(req, res, next) {
         
         // 獲取client端資料
         const guestData = {
            current_time:moment().format('YYYY-MM-DD')
         }
        // 將資料寫入資料庫
        toGuestday(guestData).then(result => {
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

     //取得訪客資訊
     getGuestInfo(req, res, next) {
         
        // 獲取client端資料
   
      
    }

    //取得訪客資訊
    getGuestInfo(req, res, next) {
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
                    toGuestInfo().then(result => {
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