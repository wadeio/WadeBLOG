var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var device = require('express-device');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var schedule = require('node-schedule');
var moment = require('moment');
const db = require('./models/connection_db');
var app = express();

var rule1     = new schedule.RecurrenceRule();
var times1    = [1,6,11,16,21,26,31,36,41,46,51,56];
rule1.minute  = times1;
schedule.scheduleJob(rule1, function(){
  console.log("---------------------");
  console.log("Running Cron Job");
  console.log('排程發佈文章:'+ new Date());

  let result = {};
      db.query('SELECT * from schedulearticle', "", function (err, rows) {
          if (err) {
              result.status = "登入失敗。"
              result.err = "伺服器錯誤，請稍後在試！"
              //reject(result);
              return;
          }
          result= rows;
          //更新發佈文章
          result.forEach(element => {

            if(moment(element.publish_date).isBefore(new Date())){
                  db.query('UPDATE article SET status=? where id=?', ["Y",element.article_id],    function (err, rows) {
                    // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
                    if (err) {
                        console.log(err);
                        result.status = "更新失敗。";
                        result.err = "伺服器錯誤，請稍後在試！"
                        console.log(result.status);
                        //reject(result);
                        //return;
                    }
                    // 若寫入資料庫成功，則回傳給clinet端下：
                    result.status = "更新成功。"
                    console.log(result.status+"..."+element.article_id);

                    db.query('DELETE from schedulearticle where id=?', element.id, function (err, rows) {
                      // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
                      if (err) {
                          console.log(err);
                          result.status = "刪除失敗。";
                          result.err = "伺服器錯誤，請稍後在試！"
                          console.log(result.status);
                          //reject(result);
                          //return;
                      }
                      // 若寫入資料庫成功，則回傳給clinet端下：
                      result.status = "刪除成功。"
                      console.log(result.status);
                      //result.id = id;
                      //resolve(result);
                  })
                    //result.Savedata = articleData;
                    //resolve(result);
                })

            }
               
          });
          //console.log(result);
          //resolve(result);
      });

  console.log("Publish article successfully!");
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(device.capture());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
