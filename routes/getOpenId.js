/**
 * Created by qiaojoe on 15-10-10.
 */


var express = require('express');
var router = express.Router();
var myUtil = require('../common/utils');
var config = require('../config');
var querystring = require('querystring');

//生成二维码
router.all('/', function (req, res) {

    var code = req.query.code;
    var state = req.query.state;
    var baseUrl = 'http://' + req.headers.host +'/';

    console.log('获取的code'+code);
    console.log(baseUrl);

    // 获取到code，然后根据code 请求openid
    var appid = config.wechat_develop.appId;
    var appsecret = config.wechat_develop.appSecret;
    var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appid+'&secret='+appsecret+'&code='+code+'&grant_type=authorization_code';
    console.log('请求连接'+url);
    var data = querystring.stringify({
    //    appid : appid,
    //    secret : appsecret,
    //    code : code,
    //    grant_type : 'authorization_code'
    });
    myUtil.http_server('get',url,data,function(err, results){

        if (!err) {
            var body = JSON.parse(results.body);
            console.log('@@@@@'+JSON.stringify(body));
            var openid = body.openid;
            console.log('获取的openid='+openid);
            res.redirect(baseUrl+'task?openid='+openid);

        } else {
           res.render('task/error', {});
        }
    });
});

module.exports = router;