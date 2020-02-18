const toRegister =require('../models/member_model');
const Check = require('../service/member_check');
const encryption = require('../models/encryption');
const loginAction = require('../models/login_model');
var jwt = require('jsonwebtoken');
check = new Check();

module.exports = class Member {
    postRegister(req, res, next) {
        // 進行加密
        const password = encryption(req.body.password);
        
        // 獲取client端資料
        const memberData = {
            name: req.body.name,
            account: req.body.account,
            password: password,
            create_date: onTime()
        }

        const checkEmail = check.checkEmail(memberData.account);
        // 不符合email格式
        if (checkEmail === false) {
            res.json({
                result: {
                    status: "註冊失敗。",
                    err: "請輸入正確的Eamil格式。(如1234@email.com)"
                }
            })
        // 若符合email格式
        } else if (checkEmail === true) {
            // 將資料寫入資料庫
            toRegister(memberData).then(result => {
                // 若寫入成功則回傳
                res.json({
                    result: result
                })
            }, (err) => {
                // 若寫入失敗則回傳
                res.json({
                    err: err
                })
            })
        }

    }



    postLogin(req, res, next) {
        // 進行加密
        const password = encryption(req.body.password);
        
        // 獲取client端資料
        const memberData = {
            account: req.body.account,
            password: password
        }

        loginAction(memberData).then(rows => {
            if (check.checkNull(rows) === true) {
                res.json({
                    result: {
                        status: "登入失敗。",
                        statuscode:"404",
                        err: "請輸入正確的帳號或密碼。"
                    }
                })
            } else if (check.checkNull(rows) === false) {

                 // 產生token
                const token = jwt.sign({
                    algorithm: 'HS256',
                    exp: Math.floor(Date.now() / 1000) + (60 * 60), // token一個小時後過期。
                    data: rows[0].id
                }, "1234");
                //res.setHeader('token', token);
                res.cookie('auth',token);
                res.json({
                    result: {
                        status: "登入成功。",
                        statuscode:"200",
                        loginMember: "歡迎 " + rows[0].name + " 的登入！",
                    }
                })
            }
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