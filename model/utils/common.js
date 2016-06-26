/**
 * Created by kuanchang on 16/6/23.
 * 公用方法
 */


/**
 * 将数组（或字符串）转换成字符串，主要应用在后台获取的数组转换成字符串
 * @param array
 * @param symbol
 */
module.exports.array2Str = function(array,symbol) {
    var retStr = "";
    if (array instanceof Array) {
        for (var i=0;i<array.length;i++)
        {
            retStr +=array[i]+symbol;
        }
        retStr =retStr.substr(0,retStr.length-1);
    }else{
        retStr=  array;
    }
    return retStr;
}



/**
 * 日期格式转换成字符串格式
 * @param date
 * @param format
 * @returns {XML|string|void}
 */
module.exports.date2str = function date2str (date, format) {
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