/**
 * Created by qiaojoe on 15-9-29.
 */

var crypto = require('crypto');
var util = require('util');
var send_http = require('request');
var printSystemLogFlag = require('../config').mainClassifyId.printSystemLogFlag;

/**
 * AES加密
 * @param str 明文
 * @param secret 加密密钥
 * @returns {*}
 */
exports.encrypt = function (str, secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
};

/**
 * AES解密
 * @param str 密文
 * @param secret 解密密钥
 * @returns {*}
 */
exports.decrypt = function (str, secret) {
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

/**
 * 判断参数是否为数字
 * @param v 要检查的参数
 * @returns {boolean}
 */
exports.isNum = function (v) {
    if (v != null && v != "") {
        return !isNaN(v);
    }
    return false;
};

/**
 * 深拷贝对象
 * @param {Object} 原始对象
 * @returns {Object} 拷贝后的对象
 */
exports.deepClone = function (obj) {
    if (obj == null) {
        return obj;
    }

    var t = typeof(obj);
    if (t == 'undefined' || t == 'string' || t == 'number' || t == 'boolean' || t == 'function') {
        return obj;
    } else if (util.isArray(obj)) {
        var array = new Array();
        for (var i = 0; i < obj.length; ++i) {
            array.push(this.deepClone(obj[i]));
        }
        return array;
    } else if (t == 'object') {
        var o = {};
        for (var v in obj) {
            o[v] = this.deepClone(obj[v]);
        }
        return o;
    }

    return null;
};

/**
 *
 * @param url
 * @param post_data
 */
exports.http_server = function(type,url,data,callback){

    if (type == 'get') {
        send_http.get({
                headers :{'content-type':'application/x-www-form-urlencoded'},
                url : url,
                body: data
            }, callback
        );
    } else if (type == 'post') {
        send_http.post({
                headers :{'content-type':'application/x-www-form-urlencoded'},
                url : url,
                body: data
            }, callback
        );
    }
    return;
};

/**
 * 日期格式转换成字符串格式
 * @param date
 * @param format
 * @returns {XML|string|void}
 */
function date2str (date, format) {
    var z = {
        y: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
    };
    return format.replace(/(y+|M+|d+|h+|m+|s+)/g, function(v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2))
    });
}
exports.date2str = date2str;
/**
 * 打印系统日志
 * @param flag：是否打印
 * @param msg：打印内容
 */
exports.printSystemLog = function(msg){
    if(printSystemLogFlag){
        console.log(date2str(new Date(), "yyyy-MM-d h:m:s")+":"+msg);
    }
};