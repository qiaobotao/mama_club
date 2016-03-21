/**
 * Created by kuanchang on 16/3/21.
 * 考勤查询
 */

var service = require('../../model/service/attendanceSearch');
/**
 * 获取考勤类型列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    var currentPage = req.query.page ? req.query.page : '1';
    var staffName = req.query.staffName ? req.query.staffName : '';//员工名称
    var startDate = req.query.startDate ? req.query.startDate : '';//请假开始日期
    var endDate = req.query.endDate ? req.query.endDate : '';//请假截止日期
    service.fetchAllAttendanceSearch(staffName,startDate,endDate,currentPage, function (err, results) {
        if (!err) {
            results.staffName = staffName;
            results.startDate = startDate;
            results.endDate = endDate;
            res.render('attendanceSearch/attendanceSearchList', {data : results});
        } else {
            console.log(err.message);
            res.render('error');
            // next();
        }
    });
}