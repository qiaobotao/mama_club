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
//验证用户登录server
var sysUserService = require('./model/service/sysUser');

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

        if (path == '/jinquan_login') {

            var shop = req.body.shop ? req.body.shop : '';
            var account = req.body.account ? req.body.account : '';
            var password = req.body.password ? req.body.password : '';
            sysUserService.checkUser(shop,account, function (err, results) {
                if (!err) {
                    if(results.length > 0){
                        var resUser = results[0];
                        if(resUser.password == password){
                            //查询出用户相关权限，并一起放入到用户所在session中
                            sysUserService.getMenuAndResourcesByUserId(resUser.id,function(err,menuAndResources){
                                if(!err){
                                    //记录用户信息：用户id、用户所在门店、用户名称
                                    var user = {};
                                    user.id = resUser.id;//用户id
                                    user.shopId = resUser.shopId;
                                    user.userName = resUser.userName;//用户名称
                                    user.shopName = resUser.shopName;//所在门店
                                    user.shopCode = resUser.shopCode;// 门店编号
                                    user.availableSopIds = resUser.availableSopIds;// 可查看门店信息
                                    user.shortcutMenuId1 = resUser.shortcutMenuId1;//快捷菜单1
                                    user.shortcutMenuId2 = resUser.shortcutMenuId2;//快捷菜单2
                                    user.shortcutMenuId3 = resUser.shortcutMenuId3;//快捷菜单3
                                    user.shortcutMenuId4 = resUser.shortcutMenuId4;//快捷菜单4
                                    user.menus = menuAndResources.menusData;//拥有菜单
                                    //var resourcesDataList = menuAndResources.resourcesData;
                                    var resourcesObj = {};
                                    for(var i = 0 ; i < menuAndResources.resourcesData.length ; i ++){
                                        var resourcesDataObj = menuAndResources.resourcesData[i];
                                        if(resourcesDataObj.url.indexOf("member_card_") > 0){
                                            var a = "";
                                        }
                                        resourcesObj[resourcesDataObj.url] = "1";
                                    }
                                    user.resourcesData = resourcesObj;//拥有资源

                                    req.session.user = user;
                                    //res.locals.user = req.session.user;
                                    res.redirect('/jinquan');
                                }else{
                                    res.redirect("/");
                                }
                            })
                        }else{
                            res.redirect("/");
                        }
                    }else{
                        res.redirect("/");
                    }
                } else {
                    next();
                }
            });
        }else if (path == '/login') {//跳转到登陆页面不需要验证权限
           next();
       } else {
           if (req.session.user) {//验证是否有用户信息，如果没有跳转到登陆页面
               var pp = path;
               if(1==1){//如果url中有两个page参数，则保留后边那个

               }
                next();
           } else {
               res.redirect("/");
           }
       }
    } else {
        req.session.user = null;
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
      console.log(err.message);
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


