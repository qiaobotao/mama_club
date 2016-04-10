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
    var startDate = req.query.startDate ? req.query.startDate : '';//请假开始日期
    var endDate = req.query.endDate ? req.query.endDate : '';//请假截止日期
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    service.fetchAllAttendanceChange(staffName,attendanceType,startDate,endDate,currentPage, function (err, results) {
        if (!err) {
            results.staffName = staffName;
            results.attendanceType = attendanceType;
            results.startDate = startDate;
            results.endDate = endDate;
            res.render('attendanceChange/attendanceChangeList', {data : results, replytype : replytype});
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
        var attendanceChange = [];
        res.render('attendanceChange/attendanceChangeEdit', {attendanceChange : attendanceChange});
    }else{
        service.fetchSingleAttendanceChange(id, function(err, results) {
            if (!err) {
                var attendanceChange = results.length == 0 ? null : results[0];
                res.render('attendanceChange/attendanceChangeEdit', {attendanceChange : attendanceChange});
            } else {
                next();
            }
        })
    }
}
/**
 * 保存考勤变更
 * @param req
 * @param res
 */
module.exports.save = function (req, res) {
    var id = req.body.id ? req.body.id : '';
    var staffId = req.body.staffId ? req.body.staffId : '';//员工id
    var attendanceType = req.body.attendanceType ? req.body.attendanceType : '';//类型
    var leaveStartDate = req.body.leaveStartDate ? req.body.leaveStartDate : '';//开始日期
    var leaveEndDate = req.body.endDate ? req.body.leaveEndDate : '';//截止日期
    var startDate = req.body.endDate ? req.body.startDate : '';//开始小时
    var endDate = req.body.endDate ? req.body.endDate : '';//截止小时
    var leaveReason = req.body.leaveReason ? req.body.leaveReason : '';//原因
    var attendanceTypeDetailed = req.body.attendanceTypeDetailed ? req.body.attendanceTypeDetailed : '';//加班或请假明细

    if(leaveEndDate == null){
        leaveEndDate = leaveStartDate;
    }

    if(id!=''){//修改
        service.updateAttendanceChange(id,staffId,attendanceType,leaveStartDate,leaveEndDate,startDate,endDate,leaveReason,attendanceTypeDetailed,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/attendance_change_list');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }else{//添加
        service.insertAttendanceChange(staffId,attendanceType,leaveStartDate,leaveEndDate,startDate,endDate,leaveReason,attendanceTypeDetailed,function(err, results) {
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