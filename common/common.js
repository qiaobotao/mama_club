/**
 * Created by qiaojoe on 15-9-29.
 * 调用wechatApi封装 保证全局只有一个token
 */

var menu = require('../model/menu').jinheMenu;
var config = require('../config');
var WechatAPI = require('wechat-api');
var wechatConfig = config.server.develop ? config.wechat_develop : config.wechat;
var wechatApi = new WechatAPI(wechatConfig.appId, wechatConfig.appSecret);


// 创建菜单
module.exports.createMenu = function(callback) {

    wechatApi.createMenu(menu, callback);

}

// 发送图文消息
module.exports.sendPicMessage = function(openid,message,callback) {

    wechatApi.sendNews(openid,message,callback);
}

// 生成二维码
module.exports.createQRCode = function(id,callback) {
    wechatApi.createLimitQRCode(id, callback);
}

// 展示二维码
module.exports.showQRCode = function(ticket) {
     return wechatApi.showQRCodeURL(ticket);
}


