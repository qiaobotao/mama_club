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
            res.render('staffTrain/staffTrainList', {data : results,replytype:replytype});
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
/**
 * 保存培训信息
 * @param req
 * @param res
 */
module.exports.save = function (req, res) {
    var courseId = req.body.id ? req.body.id : '';
    var staffId = req.body.staffId ? req.body.staffId : '';
    var staffName = req.body.staffName ? req.body.staffName : '';
    var beforeClassIntegration = req.body.beforeClassIntegration ? req.body.beforeClassIntegration : '';
    var classIntegration = req.body.classIntegration ? req.body.classIntegration : '';
    var afterClassIntegration = req.body.afterClassIntegration ? req.body.afterClassIntegration : '';
    var status = req.body.status ? req.body.status : '';

    // 处理培训信息数据
    var staffTrainArr = new Array();
    for (var i=0;i<staffId.length;i++) {
        var obj = {};
        obj.staffId = staffId[i];
        obj.staffName = staffName[i];
        obj.beforeClassIntegration = beforeClassIntegration[i];
        obj.classIntegration = classIntegration[i];
        obj.afterClassIntegration = afterClassIntegration[i];
        obj.status = status[i];
        staffTrainArr.push(obj);
    }


    //先删除课程对应的所有培训内容，然后在进行添加
    service.delStaffTrain(courseId,function(err, results) {
        if(!err) {
            service.insertStaffTrain(courseId,staffTrainArr,function(err, results) {
                if(!err) {
                    res.redirect('/jinquan/staff_train_list?replytype=update');
                } else {
                    console.log(err.message);
                    res.render('error');
                }
            })
        } else {
            res.render('error');
        }
    })
}