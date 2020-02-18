const toAdd = require('../models/article_model');
const tolistarticle = require('../models/articlelist_model');
const tolistarticleN = require('../models/articlelistN_model');
const toremovearticle = require('../models/articleremove_model');
const toquerystatus= require('../models/articlestatus_model');
const toupdatestatus= require('../models/articlestatusu_model');
const toarticle= require('../models/articleget_model');
const toupdatearticle= require('../models/articleupdate_model');
const tocategory =require('../models/articlecategory_model');
const tohotarticle =require('../models/articlehot_model');
const toupdateviews =require('../models/articleviewsu_model');
const toarticlecate =require('../models/articlelistcate_model');
const toarticlekeyword =require('../models/articlekeyword_model');
const tosubjects =require('../models/subjects_model');
const verify = require('../models/verification_model');
const Check = require('../service/member_check');
const formidable = require('formidable');
const fs = require('fs');
check = new Check();

module.exports = class Article {

    /********  需 auth token *******/

    //儲存文章
    postAdd(req, res, next) {
        var token = req.cookies.auth;
        const form = new formidable.IncomingForm();

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
                    form.parse(req, async function (err, fields, files) {     
                         // 確認檔案大小是否小於1MB
                        if (check.checkFileSize(files.file.size) === true) {
                            res.json({
                                result: {
                                    status: "上傳檔案失敗。",
                                    err: "請上傳小於5MB的檔案"
                                }
                            })
                            return;
                        }

                         // 確認檔案型態是否為png, jpg, jpeg
                        if(check.checkFileType(files.file.type) === true){

                            // 將圖片轉成base64編碼
                            const image = await fileToBase64(files.file.path);
                            console.log(files.file.type);
                            //已登入狀態
                            const id = tokenResult;
                            // 獲取client端資料
                            const articleData = {
                                title: fields.title,
                                content: fields.content,
                                category: fields.category,
                                author:"Wade",
                                status:'Y',
                                views:0,
                                createdate: onTime(),
                                img:image,
                                img_name:files.file.name,
                                subject:fields.subject
                            }
                            // 將資料寫入資料庫
                            toAdd(articleData).then(result => {
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

                        }else{
                            res.json({
                                result: {
                                    status: "上傳檔案失敗。",
                                    err: "請選擇正確的檔案格式。如：png, jpg, jpeg等。"
                                }
                            })
                            return;
                        }
                    });
                   
                }
            });
        }
      
    }

     //儲存草稿文章
    postAdddraft(req, res, next) {

        var token = req.cookies.auth;
        const form = new formidable.IncomingForm();
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


                    form.parse(req, async function (err, fields, files) {     
                        // 確認檔案大小是否小於1MB
                       if (check.checkFileSize(files.file.size) === true) {
                           res.json({
                               result: {
                                   status: "上傳檔案失敗。",
                                   err: "請上傳小於5MB的檔案"
                               }
                           })
                           return;
                       }

                        // 確認檔案型態是否為png, jpg, jpeg
                       if(check.checkFileType(files.file.type) === true){

                           // 將圖片轉成base64編碼
                           const image = await fileToBase64(files.file.path);
                           console.log(files.file.type);
                           //已登入
                           const id = tokenResult;
                           // 獲取client端資料
                           const articleData = {
                                title: fields.title,
                                content: fields.content,
                                category: fields.category,
                                author:"Wade",
                                status:'N',
                                views:0,
                                createdate: onTime(),
                                img:image,
                                img_name:files.file.name,
                                subject:fields.subject
                            }
                            // 將資料寫入資料庫
                            toAdd(articleData).then(result => {
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
                            });

                       }else{
                           res.json({
                               result: {
                                   status: "上傳檔案失敗。",
                                   err: "請選擇正確的檔案格式。如：png, jpg, jpeg等。"
                               }
                           })
                           return;
                       }
                   });

                 
                }
            });
        }
       
    }
   
    //刪除文章
    postRemovearticle(req, res, next) {
        //console.log("刪除文章");
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
                    //已登入成功
                    const idd = tokenResult;
                    // 獲取client端資料
                    var id=req.body.id;
                    // 將資料寫入資料庫
                    toremovearticle(id).then(result => {
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
                    });
                   
                }
            });
        }

    }


    //更新修改指定文章
    updateArticle(req, res, next) {

        var token = req.cookies.auth;
        const form = new formidable.IncomingForm();

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


                    form.parse(req, async function (err, fields, files) {     
                        // 確認檔案大小是否小於1MB
                       if (check.checkFileSize(files.file.size) === true) {
                           res.json({
                               result: {
                                   status: "上傳檔案失敗。",
                                   err: "請上傳小於5MB的檔案"
                               }
                           })
                           return;
                       }

                        // 確認檔案型態是否為png, jpg, jpeg
                       if(check.checkFileType(files.file.type) === true){

                           // 將圖片轉成base64編碼
                           const image = await fileToBase64(files.file.path);
                           console.log(files.file.type);
                           //已登入狀態
                           const id = tokenResult;

                           // 獲取client端資料
                           const articleData = {
                                id: fields.id,
                                content:fields.content,
                                title:fields.title,
                                category:fields.category,
                                img:image,
                                img_name:files.file.name,
                                subject:fields.subject
                            }

                             // 將資料寫入資料庫
                            toupdatearticle(articleData).then(result => {
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
                            });
                                

                       }else{
                           res.json({
                               result: {
                                   status: "上傳檔案失敗。",
                                   err: "請選擇正確的檔案格式。如：png, jpg, jpeg等。"
                               }
                           })
                           return;
                       }
                   });
                   
                }
            });
        }

    }

     //更新文章顯示狀態
    postArticlestatus(req, res, next) {

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
                    //已登入
                    const id = tokenResult;
                     // 獲取client端資料
                    const articleData = {
                        id: req.body.id,
                        status:req.body.status,
                    }
                
                    // 將資料寫入資料庫
                    toupdatestatus(articleData).then(result => {
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
                    });
                }
            });
        }

       
    }

    
    /********  無token *******/

     //取得所有文章
    getListarticle(req, res, next) {

        // 獲取client端資料
        const articleData = {
            subjectidx: req.query.id
        }
   
        // 將資料寫入資料庫
        tolistarticle(articleData).then(result => {
            // 若寫入成功則回傳
            //Table 只能設定為data
            res.json({
                data: result 
            })
        }, (err) => {
            // 若寫入失敗則回傳
            res.json({
                result: err
            })
        })
    }

     //取得所有尚未發佈文章
     getListarticleN(req, res, next) {
        // 獲取client端資料
      
        // 將資料寫入資料庫
        tolistarticleN().then(result => {
            // 若寫入成功則回傳
            //Table 只能設定為data
            res.json({
                data: result 
            })
        }, (err) => {
            // 若寫入失敗則回傳
            res.json({
                result: err
            })
        })
    }
 
    //取得文章顯示欄位狀態
    getArticlestatus(req, res, next) {
        // 獲取client端資料
      var id=req.body.id;
        // 將資料寫入資料庫
        toquerystatus(id).then(result => {
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

   
     //取得指定文章
     getArticle(req, res, next) {
        // 獲取client端資料
        var id=req.body.id;
        // 將資料寫入資料庫
        toarticle(id).then(result => {
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

    //取得所有分類
    getArticlecategory(req, res, next) {
         // 獲取client端資料
         const articleData = {
            subjectidx:req.query.id
        }
        // 將資料寫入資料庫
        tocategory(articleData).then(result => {
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

    //取得熱門文章
    getArticlehot(req, res, next) {
        // 獲取client端資料
        const articleData = {
           subjectidx:req.query.id
       }
       // 將資料寫入資料庫
       tohotarticle(articleData).then(result => {
           // 若寫入成功則回傳
           res.json({
               status: "查詢成功。",
               result: result ,
               data:result.categorydata
           })
       }, (err) => {
           // 若寫入失敗則回傳
           res.json({
               result: err
           })
       })
   }

     //更新文章瀏覽人數
     postArticleviews(req, res, next) {
        // 獲取client端資料
        const articleData = {
            id: req.body.id,
            views:req.body.views,
        }
       
        // 將資料寫入資料庫
        toupdateviews(articleData).then(result => {
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


      //取得該分類所有文章
      getListarticlecate(req, res, next) {
       // 獲取client端資料
        var category=req.query.category;
        console.log(category);
        // 將資料寫入資料庫
        toarticlecate(category).then(result => {
            // 若寫入成功則回傳
            //Table 只能設定為data
            res.json({
                data: result 
            })
        }, (err) => {
            // 若寫入失敗則回傳
            res.json({
                result: err
            })
        })
    }

    //查詢關鍵字相關文章
    getListarticlekeyword(req, res, next) {
        // 獲取client端資料
         var para=req.query.q;
         para='%'+para+'%';
         var arr=[para,para];
         console.log(arr);
         // 將資料寫入資料庫
         toarticlekeyword(arr).then(result => {
             // 若寫入成功則回傳
             //Table 只能設定為data
             res.json({
                 data: result 
             })
         }, (err) => {
             // 若寫入失敗則回傳
             res.json({
                 result: err
             })
         })
     }

     //查詢所有文章主題
     getArticlesubjects(req, res, next) {
        // 獲取client端資料
         // 將資料寫入資料庫
         tosubjects().then(result => {
             // 若寫入成功則回傳
             //Table 只能設定為data
             res.json({
                 data: result 
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

//file Covert Base64
const fileToBase64 = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'base64', function (err, data) {
            resolve(data);
        })
    })
}