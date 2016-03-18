/**
 * Created by kuanchang on 16/1/13.
 */
var service = require('../../model/service/staffTrain');
/**
 * 获取员工培训列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {

    var currentPage = req.query.page ? req.query.page : '1';
    var trainName = req.query.trainName ? req.query.trainName : '';
    var teacherName = req.query.teacherNamee ? req.query.teacherNamee : '';

    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';

    service.fetchAllStaffTrain(trainName,teacherName,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.teacherName = teacherName;
            results.trainName = trainName;
            res.render('staffTrain/staffTrainList', {data : results});
        } else {
            next();
        }
    });
}

/**
 * 跳转到编辑员工培训页面
 * @param req
 * @param res
 */
module.exports.edit = function (req, res) {
    var id = req.query.id ? req.query.id : '';
    var show = req.query.show ? req.query.show : '';
    service.fetchSingleStaffTrain(id, function(err, results) {
        if (!err) {
            var course = results.courseData[0];
            var staffTrains = results.staffTrainData;
            res.render('staffTrain/staffTrainEdit', {show:show,course : course,staffTrains:staffTrains});
        } else {
            next();
        }
    })
}