/**
 * Created by kuanchang on 16/3/21.
 * 绩效查询
 */

var service = require('../../model/service/performanceSearch');
/**
 * 获取绩效查询数据
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    var staffId = req.query.staffId ? req.query.staffId : '';//员工名称
    var staffName = req.query.staffName ? req.query.staffName : '';//员工名称
    var performanceDate = req.query.performanceDate ? req.query.performanceDate : '';//考勤时间
    if(staffId == ''){
        res.render('performanceSearch/performanceSearchList',{data : {}});
        return;
    }
    /**
     * 1、查找该月份的打卡记录
     * 2、查找该月份用到的考勤类别
     * 3、查找该月份内的考勤变更信息
     * 4、遍历所有打卡记录，找到正常考勤天数等表格所需数据
     */
    var curMonthDays = new Date(performanceDate.split("-")[0], performanceDate.split("-")[1], 0).getDate();
    service.fetchPerformanceSearch(staffId,performanceDate+"-01", performanceDate+"-"+curMonthDays,function (err, results) {
        if (!err) {
            results.staffId = staffId;
            results.staffName = staffName;
            results.performanceDate = performanceDate;
            res.render('performanceSearch/performanceSearchList', {data : results});
        } else {
            console.log(err.message);
            res.render('error');
            // next();
        }
    });
}