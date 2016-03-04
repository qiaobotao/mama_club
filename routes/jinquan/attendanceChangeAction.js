/**
 * Created by kuanchang on 16/2/15.
 * 考勤变更管理
 */

var service = require('../../model/service/attendanceChange');
/**
 * 获取考勤类型列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    var currentPage = req.query.page ? req.query.page : '1';
    var staffName = req.query.staffName ? req.query.staffName : '';//员工名称
    var attendanceType = req.query.attendanceType ? req.query.attendanceType : '';//变更类型
    var leaveStartDate = req.query.leaveStartDate ? req.query.leaveStartDate : '';//请假开始日期
    var leaveEndDate = req.query.leaveEndDate ? req.query.leaveEndDate : '';//请假截止日期

    service.fetchAllAttendanceChange(staffName,attendanceType,leaveStartDate,leaveEndDate,currentPage, function (err, results) {
        if (!err) {
            results.staffName = staffName;
            results.attendanceType = attendanceType;
            results.leaveStartDate = leaveStartDate;
            results.leaveEndDate = leaveEndDate;
            res.render('attendanceChange/attendanceChangeList', {data : results});
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
        res.render('attendanceChange/attendanceChangeEdit', {attendanceType : attendanceType});
    }else{
        service.fetchSingleAttendanceChange(id, function(err, results) {
            if (!err) {
                var attendanceType = results.length == 0 ? null : results[0];
                res.render('attendanceChange/attendanceChangeEdit', {attendanceType : attendanceType});
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
        service.updateAttendanceChange(id,categoryName,jobTime,startDate,endDate,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/attendance_change_list');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }else{//添加
        service.insertAttendanceChange(categoryName,jobTime,startDate,endDate,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/attendance_change_list');
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

    service.delAttendanceChange(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/attendance_change_list');
        } else {
            next();
        }
    });

}