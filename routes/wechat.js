/**
 * Created by qiaojoe on 15-9-29.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var wechat = require('wechat');
var common = require('../common/common');


var wechatConfig = config.server.develop ? config.wechat_develop : config.wechat;

router.all('/', wechat(wechatConfig.token, wechat.text(function (message, req, res, next) {
    // message为文本内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359125035',
    // MsgType: 'text',
    // Content: 'http',
    // MsgId: '5837397576500011341' }
    res.reply();
}).image(function (message, req, res, next) {
    // message为图片内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359124971',
    // MsgType: 'image',
    // PicUrl: 'http://mmsns.qpic.cn/mmsns/bfc815ygvIWcaaZlEXJV7NzhmA3Y2fc4eBOxLjpPI60Q1Q6ibYicwg/0',
    // MediaId: 'media_id',
    // MsgId: '5837397301622104395' }
    res.reply();
}).voice(function (message, req, res, next) {
    // message为音频内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359125022',
    // MsgType: 'voice',
    // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
    // Format: 'amr',
    // MsgId: '5837397520665436492' }
    res.reply();
}).video(function (message, req, res, next) {
    // message为视频内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359125022',
    // MsgType: 'video',
    // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
    // ThumbMediaId: 'media_id',
    // MsgId: '5837397520665436492' }
    res.reply();
}).location(function (message, req, res, next) {
    // message为位置内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359125311',
    // MsgType: 'location',
    // Location_X: '30.283950',
    // Location_Y: '120.063139',
    // Scale: '15',
    // Label: {},
    // MsgId: '5837398761910985062' }
    res.reply();
}).link(function (message, req, res, next) {
    // message为链接内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359125022',
    // MsgType: 'link',
    // Title: '公众平台官网链接',
    // Description: '公众平台官网链接',
    // Url: 'http://1024.com/',
    // MsgId: '5837397520665436492' }
    res.reply();
}).event(function (message, req, res, next) {
    // message为事件内容

    // 扫描二维码事件参数
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359125022',
    // MsgType: 'event',
    // Event: 'subscribe' 或 'unsubscribe' 或 'SCAN' 等等,
    // EventKey: 'qrscene_123' 或 123,
    // Ticket: 'xxxx'}

    var openId = message.FromUserName;  // 用户OpenId
    var event = message.Event;          // 事件类型

    var baseUrl = 'http://' + req.headers.host +'/';
    switch (event) {

        case 'subscribe':       // 添加关注
        {
            break;
        }
        case 'unsubscribe':     // 取消关注
        {
            res.reply();
            break;
        }
        case 'SCAN':            // 扫描二维码
        {

            break;
        }
        case 'LOCATION':        // 地理位置
        {

            break;
        }
        case 'CLICK':           // 处理点击菜单事件
        {
            var eventKey = message.EventKey;


            switch (eventKey) {

                case 'V1_BCHFZ':        // 病虫害防治
                {
                    common.sendPicMessage(openId,require('../model/menu').picNews_BCHFZ,function(err, result){
                        res.reply();
                    });
                    break;
                }
                case 'V1_ZBZS':         // 植保知识
                {
                    common.sendPicMessage(openId,require('../model/menu').picNews_ZBZS,function(err, result){
                        res.reply();
                    });
                    break;
                }
                case 'V2_YCFX':         // 预测分析
                {
                    common.sendPicMessage(openId,require('../model/menu').picNews_YCFX,function(err, result){
                        res.reply();
                    });
                    break;
                }
                case 'V2_YWGG':         // 要文公告
                {
                    common.sendPicMessage(openId,require('../model/menu').picNews_YWGG,function(err, result){
                        res.reply();
                    });
                    break;
                }
                case 'V2_NYZX':         // 农业资讯
                {
                    common.sendPicMessage(openId,require('../model/menu').picNews_NYZX,function(err, result){
                        res.reply();
                    });
                    break;
                }
                case 'V1_ZZJS':       // 种植技术
                {
                    common.sendPicMessage(openId,require('../model/menu').picNews_ZZJS,function(err, result){
                        res.reply();
                    });
                    break;
                }
                default :
                {
                    res.reply();
                }
            }

            break;
        }
        default:
        {
            res.reply();
        }
    }
})));

module.exports = router;