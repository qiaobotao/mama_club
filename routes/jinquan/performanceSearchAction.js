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
    service.fetchPerformanceSearch(staffId,performanceDate, function (err, results) {
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