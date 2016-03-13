/**
 * Created by qiaojoe on 16-3-13.
 */

var service_classroom = require('../../model/service/classroom');
var service = require('../../model/service/course');

module.exports.list = function (req, res, next) {

    // 处理一周内的时间
    var arr_date = new Array();
    var date_temp = new Date();
    var date = new Date(date_temp);
    for (var i=1;i<8;i++) {
        date.setDate(date_temp.getDate()+i);
        var times = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        arr_date.push(times);
    }


    res.render('coursePlan/coursePlanList');
}


module.exports.add = function (req, res, next) {

    res.render('coursePlan/coursePlanAdd');

}
