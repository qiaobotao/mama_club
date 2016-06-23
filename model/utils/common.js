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