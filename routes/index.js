var express = require('express');
var router = express.Router();
var fs = require('fs');
const ScheduleModifyMethod = require('../controllers/schedulearticle_controller');
const ArticleModifyMethod = require('../controllers/modify_controller');
const AboutModifyMethod = require('../controllers/about_controller');
const MemberMethod = require('../controllers/member_controller');
const GuestModifyMethod = require('../controllers/guest_controller');
const CommentModifyMethod = require('../controllers/comment_controller');
const verify = require('../models/verification_model');
const record = require('../models/guest_model');
const Check = require('../service/member_check');
var jwt = require('jsonwebtoken');
scheduleModifyMethod=new ScheduleModifyMethod();
commentModifyMethod = new CommentModifyMethod();
guestModifyMethod = new GuestModifyMethod();
articleModifyMethod = new ArticleModifyMethod();
aboutModifyMethod= new AboutModifyMethod();
memberMethod= new MemberMethod();
check = new Check();

/******  API ********/
/******  前臺API ********/
router.get('/getcomment', commentModifyMethod.getallcomment);
router.post('/postcomment', commentModifyMethod.postcomment);
router.get('/getguestall', guestModifyMethod.getGuestAll);
router.get('/getguestweek', guestModifyMethod.getGuestWeek);
router.get('/getguestday', guestModifyMethod.getGuestDay);
router.get('/getabout', aboutModifyMethod.getabout);
router.get('/getlistarticleN', articleModifyMethod.getListarticleN);
router.get('/getlistarticle', articleModifyMethod.getListarticle);
router.get('/getcategory', articleModifyMethod.getArticlecategory);
router.get('/gethotarticle', articleModifyMethod.getArticlehot);
router.post('/uarticleviews', articleModifyMethod.postArticleviews);
router.get('/articlecatelist', articleModifyMethod.getListarticlecate);
router.get('/articlekeyword', articleModifyMethod.getListarticlekeyword);
router.post('/getarticle', articleModifyMethod.getArticle);
router.post('/getarticlestatus', articleModifyMethod.getArticlestatus);
/******  後臺API(token) ********/
router.post('/addarticle', articleModifyMethod.postAdd);
router.post('/adddraft', articleModifyMethod.postAdddraft);
router.post('/updateabout', aboutModifyMethod.postabout);
router.post('/removearticle', articleModifyMethod.postRemovearticle);
router.post('/updatearticle', articleModifyMethod.updateArticle);
router.post('/uarticlestatus', articleModifyMethod.postArticlestatus);
router.get('/gettasks', scheduleModifyMethod.gettasklist); 
router.post('/removetask', scheduleModifyMethod.postremove); 
router.post('/addtask', scheduleModifyMethod.postarticletask); 
router.get('/getguestinfo', guestModifyMethod.getGuestInfo);
router.get('/getsubjects', articleModifyMethod.getArticlesubjects); /**特殊無token */


/******  會員管理API ********/
//router.post('/register', memberMethod.postRegister);
router.post('/login', memberMethod.postLogin);


/******  前臺頁面 ********/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/index');
 // res.render('index', { title: 'ＷadeBLOG' });
});


/* GET home page. */
router.get('/index', function(req, res, next) {

  var guest = req.cookies.guest;
  var ip =
  (req.headers["x-forwarded-for"] || "").split(",").pop() ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress;
  if(check.checkNull(guest) === true) {
     // 產生訪客token
    const token = jwt.sign({
        algorithm: 'HS256',
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // token一個小時*24後過期。
        data: ip
    }, "1234");
    res.cookie('guest',token);
    /*
    res.json({
        err: "請輸入token！"
    })*/

    // 獲取client端資料
    const guestData = {
        ip: ip,
        enter_date: onTime(),
        device: req.device.type
    }

    record(guestData).then(result => {
      // 若寫入成功則回傳
      /*
      res.json({
          result: result
      })*/
      //res.render('index', { title: 'ＷadeBLOG' });
      }, (err) => {
          // 若寫入失敗則回傳
          res.json({
              err: err
          })
      })
      

  };

  res.render('index', { title: 'ＷadeBLOG' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { 
    title: 'ＷadeBLOG',
    main:''
  });
});

/* GET article page. */
router.get('/article', function(req, res, next) {
  res.render('article', { 
    title: 'ＷadeBLOG',
    main:''
  });
});

/* GET donate page. */
router.get('/donate', function(req, res, next) {
  res.render('donate', { 
    title: 'ＷadeBLOG'
  });
});

/* GET article list page. */
router.get('/listarticle', function(req, res, next) {
  res.render('articlelistcate', { 
    title:'ＷadeBLOG'
  });
});


/******  管理者頁面 ********/
/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* GET admin page. */
router.get('/admin', function(req, res, next) {
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
              //登入成功
              const id = tokenResult;
              res.render('admin', { 
                title: 'Express',
                index:0
              });
          }
      });
  }
});

/* GET admin add article page. */
router.get('/admin/add', function(req, res, next) {
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
              //登入成功
              const id = tokenResult;
              res.render('admin', { 
                title:'Express',
                index: 1
              });
          }
      });
  }
});

/* GET admin edit about page. */
router.get('/admin/about', function(req, res, next) {
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
              //登入成功
              const id = tokenResult;
              res.render('admin', { 
                title:'Express',
                index: 2
              });
          }
      });
  }
});


/* GET admin edit article list page. */
router.get('/admin/listarticle', function(req, res, next) {
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
              //登入成功
              const id = tokenResult;
              res.render('admin', { 
                title:'Express',
                index: 3
              });
          }
      });
  }
});


/* GET admin edit schedule page. */
router.get('/admin/schedulearticle', function(req, res, next) {
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
              //登入成功
              const id = tokenResult;
              res.render('admin', { 
                title:'Express',
                index: 4
              });
          }
      });
  }
});
router.post('/admin/uploadify', function (req,res,next) {
  
  var today = new Date();
  var folder = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var dirname = '/public/images/ckeditor-imgs/' + folder;
  console.log(dirname);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
    console.log('0777');
      // var form = new formidable.IncomingForm();
      // form.encoding = "utf-8";
      // form.uploadDir = dirname;
      // form.maxFontSize = 2 * 1024 * 1024;
      // form.parse(req, function (err, fields, files) {
      //     if (err)return;
      //     var fileName = new Date().getTime() + "." + files.pic.name.split('.')[files.pic.name.split('.').length - 1];
      //     var newPath = form.uploadDir + "/" + fileName;
      //     console.log(newPath);
      //     fs.rename(files.pic.path, newPath, function () {
      //         res.end(JSON.stringify({fileName: '/images/ckeditor-imgs/' + folder + "/" + fileName}))
      //     });
      // })
  } else
      console.error('error')
});

/* GET admin views page. */
router.get('/admin/viewrecord', function(req, res, next) {
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
              //登入成功
              const id = tokenResult;
              res.render('admin', { 
                title:'Express',
                index: 5
              });
          }
      });
  }
});

/* GET admin guest page. */
router.get('/admin/guestrecord', function(req, res, next) {
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
              //登入成功
              const id = tokenResult;
              res.render('admin', { 
                title:'Express',
                index: 6
              });
          }
      });
  }
});

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


module.exports = router;

