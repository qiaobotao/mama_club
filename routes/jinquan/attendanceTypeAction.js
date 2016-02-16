/**
 * Created by kuanchang on 16/1/13.
 */

var service = require('../../model/service/attendanceType');
/**
 * 获取考勤类型列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    var currentPage = req.query.page ? req.query.page : '1';
    var categoryName = req.query.categoryName ? req.query.categoryName : '';

    service.fetchAllAttendanceType(categoryName,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.categoryName = categoryName;
            res.render('attendanceType/attendanceTypeList', {data : results});
        } else {
            console.log(err.message);
            res.render('error');
           // next();
        }
    });
}
/**
 * 跳转到编辑考勤类型页面
 * @param req
 * @param res
 */
module.exports.edit = function (req, res) {
    var id = req.query.id ? req.query.id : '';
    if(id == ''){
        var attendanceType = [];
        res.render('attendanceType/attendanceTypeEdit', {attendanceType : attendanceType});
    }else{
        service.fetchSingleAttendanceType(id, function(err, results) {
            if (!err) {
                var attendanceType = results.length == 0 ? null : results[0];
                res.render('attendanceType/attendanceTypeEdit', {attendanceType : attendanceType});
            } else {
                next();
            }
        })
    }
}
/**
 * 保存考勤类型
 * @param req
 * @param res
 */
module.exports.save = function (req, res) {
    var id = req.body.id ? req.body.id : '';
    var categoryName = req.body.categoryName ? req.body.categoryName : '';
    var jobTime = req.body.jobTime ? req.body.jobTime : '';
    var startDate = req.body.startDate ? req.body.startDate : '';
    var endDate = req.body.endDate ? req.body.endDate : '';

    if(id!=''){//修改
        service.updateAttendanceType(id,categoryName,jobTime,startDate,endDate,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/attendance_type_list');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }else{//添加
        service.insertAttendanceType(categoryName,jobTime,startDate,endDate,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/attendance_type_list');
            } else {
                console.log(1123);
                console.log(err.message);
                res.render('error');
            }
        })
    }
}

/**
 * 删除考勤类型
 * @param id
 * @param cb
 */
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delAttendanceType(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/attendance_type_list');
        } else {
            next();
        }
    });

}