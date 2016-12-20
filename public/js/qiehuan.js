var courseDate = ['8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'];
/**
 * 根据传入的日期下标，返回该下标对应的日期
 */
function getTimeByIndex(index){
    return courseDate[index];
}

/*
 *    ForDight(Dight,How):数值格式化函数，Dight要
 *    格式化的  数字，How要保留的小数位数。
 */
function  ForDight(Dight,How)
{
    Dight  =  Math.round  (Dight*Math.pow(10,How))/Math.pow(10,How);
    return  Dight;
}

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


/**
 * 字符串转日期
 * @param str
 * @returns {Date}
 */
function stringToDate(str){
    var tempStrs = str.split(" ");
    var dateStrs = tempStrs[0].split("-");
    var year = parseInt(dateStrs[0], 10);
    var month = parseInt(dateStrs[1], 10) - 1;
    var day = parseInt(dateStrs[2], 10);
    var timeStrs = tempStrs[1].split(":");
    var hour = parseInt(timeStrs [0], 10);
    var minute = parseInt(timeStrs[1], 10);
    var second = parseInt(timeStrs[2], 10);
    var date = new Date(year, month, day, hour, minute, second);
    return date;
}

/**
 * list页面点击删除按钮给出的提示弹出框
 * @param url :点击确认删除后跳转的地址
 */
function delData(url){
    parent.layer.confirm('是否删除本条记录？删除后将不能恢复！', {
        btn: ['确认删除','取消'] //按钮
    }, function(){
        parent.layer.msg('正在删除', {
            icon: 3,
            time: 1000, //500毫秒后自动关闭
        });
        window.location.href=url;
    }, function(){
    });
}
/**
 * 校验手机号码（电话）
 * @param s
 * @returns {boolean}  false：手机号不正确
 */
function isMobil(s) {
    var patrn = /^(13[0-9]{9})|(14[0-9])|(18[0-9])|(15[0-9][0-9]{8})$/;
    if (!patrn.exec(s)) return false
    return true
}

/**
 * 校验身份证号
 * @param card
 * @returns {boolean}  false:身份证不合法
 */
function isIdCard(cardid) {
    //身份证正则表达式(18位)
    var isIdCard2 = /^[1-9]\d{5}(19\d{2}|[2-9]\d{3})((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{4}|\d{3}X)$/i;
    var stard = "10X98765432"; //最后一位身份证的号码
    var first = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //1-17系数
    var sum = 0;
    if (!isIdCard2.test(cardid)) {
        return false;
    }
    var year = cardid.substr(6, 4);
    var month = cardid.substr(10, 2);
    var day = cardid.substr(12, 2);
    var birthday = cardid.substr(6, 8);
    if (birthday != dateToString(new Date(year + '/' + month + '/' + day))) { //校验日期是否合法
        return false;
    }
    for (var i = 0; i < cardid.length - 1; i++) {
        sum += cardid[i] * first[i];
    }
    var result = sum % 11;
    var last = stard[result]; //计算出来的最后一位身份证号码
    if (cardid[cardid.length - 1].toUpperCase() == last) {
        return true;
    } else {
        return false;
    }
}

//日期转字符串 返回日期格式20080808
function dateToString(date) {
    if (date instanceof Date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month < 10 ? '0' + month: month;
        var day = date.getDate();
        day = day < 10 ? '0' + day: day;
        return year + month + day;
    }
    return '';
}
/**
 * 验证邮箱信息
 * @param str
 * @returns {boolean} false :邮箱不合法
 */
function isEmail(str){
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return reg.test(str);
}
function isOnlyNum(obj){
    var objF = parseFloat(obj.value);   //returns   22.34
    if(objF == 'NaN'){
        return "";
    }
    if(objF < 0){
        parent.layer.msg('请输入正确数值！');
        obj.value='';
    }else if(objF > 100){
        parent.layer.msg('请输入正确数值！');
        obj.value='';
    }
    obj.value = objF;
}