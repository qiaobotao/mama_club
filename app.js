var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var generateQRCode = require('./routes/generateQRCode');
var wechat = require('./routes/wechat');
var wechatId = require('./routes/getOpenId');
var session = require('express-session');

var jinquan = require('./routes/jinquan');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'mama_club',
    cookie: {maxAge: 60000*1000 },
    resave: false,
    saveUninitialized: true,
    rolling : true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    var path = req.url;

    if (path != '/') {
       if (path == '/jinquan') {
           next();
       } else {
           if (req.session.user) {
                next();
           } else {
               res.render('login');
           }
       }
    } else {
        next();
    }
});


// 业务相关
app.use('/', routes);
app.use('/jinquan',jinquan);



// 微信相关
app.use('/wechat',wechat);
app.use('/qr', generateQRCode); // 扫描二维码
app.use('/openid',wechatId); // 网页授权获取openId

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;


