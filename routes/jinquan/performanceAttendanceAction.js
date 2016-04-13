/**
 * Created by kuanchang on 16/4/11.
 * 绩效考勤
 */

var service = require('../../model/service/performanceAttendance');
/**
 * 获取绩效考勤列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    var currentPage = req.query.page ? req.query.page : '1';
    var staffId = req.query.staffId ? req.query.staffId : '';//员工Id


    var staffName = req.query.staffName ? req.query.staffName : '';//员工名称
    var attendanceType = req.query.attendanceType ? req.query.attendanceType : '';//变更类型
    var startDate = req.query.startDate ? req.query.startDate : '';//请假开始日期
    var endDate = req.query.endDate ? req.query.endDate : '';//请假截止日期
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    service.fetchAllPerformanceAttendance(staffId,attendanceType,startDate,endDate,currentPage, function (err, results) {
        if (!err) {
            results.staffId = staffId;
            results.staffName = staffName;
            results.attendanceType = attendanceType;
            results.startDate = startDate;
            results.endDate = endDate;
            res.render('performanceAttendance/performanceAttendanceList', {data : results, replytype : replytype});
        } else {
            console.log(err.message);
            res.render('error');
            // next();
        }
    });
}

/**
 * 保存考勤变更
 * @param req
 * @param res
 */
module.exports.save = function (req, res) {
    //var id = req.body.id ? req.body.id : '';//只有新增，不需要id
    var staffId = req.body.staffId ? req.body.staffId : '';//员工id
    var performanceDate = req.body.performanceDate ? req.body.performanceDate : '';//考核时间(年份)
    var assessmentCycle = req.body.assessmentCycle ? req.body.assessmentCycle : '';//考核时间(上半年/下半年)
    //var performanceEndDate = req.body.performanceEndDate ? req.body.performanceEndDate : '';//考核截止时间
    var attendanceFraction = req.body.attendanceFraction ? req.body.attendanceFraction : '';//考勤打分
    var trainFraction = req.body.trainFraction ? req.body.trainFraction : '';//培训打分
    var serverFraction = req.body.serverFraction ? req.body.serverFraction : '';//实操数打分
    var complainFraction = req.body.complainFraction ? req.body.complainFraction : '';//投诉情况打分
    var remarks = req.body.remarks ? req.body.remarks : '';//备注
    var performanceEndDate = "";
    var performanceStartDate = "";
    if(assessmentCycle == 1){
        performanceStartDate = performanceDate + "-01-01";
        performanceEndDate = performanceDate + "-06-30";
    }else if(assessmentCycle == 2){
        performanceStartDate = performanceDate + "-07-01";
        performanceEndDate = performanceDate + "-12-31";
    }


    service.insertPerformanceAttendance(staffId,attendanceFraction,trainFraction,serverFraction,complainFraction,performanceStartDate,performanceEndDate,remarks,function(err, results) {
        if(!err) {
            res.redirect('/jinquan/performance_attendance_list?replytype=add');
        } else {
            res.render('error');
        }
    })
}

/**
 * 删除绩效考勤
 * @param id
 * @param cb
 */
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delPerformanceAttendance(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/performance_attendance_list?replytype=del');
        } else {
            next();
        }
    });

}
