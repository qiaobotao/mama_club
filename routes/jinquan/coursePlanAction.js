/**
 * Created by qiaojoe on 16-3-13.
 */

var service = require('../../model/service/course');

module.exports.list = function (req, res, next) {
    service.getCoursePlanList(function (err, results) {
        if (!err) {
            res.render('coursePlan/coursePlanList',{data : results});
        } else {
            res.render('error', {error : err});
        }
    });
}


module.exports.preadd = function (req, res, next) {

    var type = req.query.type ? req.query.type : '';

    var courseId = req.query.courseId ? req.query.courseId : '';
    var classRoomId = req.query.classRoomId ? req.query.classRoomId : '';
    var date = req.query.date ? req.query.date : '';
    var obj = {};
    obj.courseId = courseId;
    obj.classRoomId = classRoomId;
    obj.date = date;
    service.getPlan(classRoomId,date,function (err, results) {
        if (!err) {
            obj.coursePlan = results;
            if (type == 1) {
                res.render('coursePlan/coursePlanAdd_neixun', {result : obj});
            } else if (type == 2) {
                res.render('coursePlan/coursePlanAdd_zhuanye', {result : obj});
            } else if (type == 3) {
                res.render('coursePlan/coursePlanAdd_fumu', {result : obj});
            } else if (type == 4) {
                res.render('coursePlan/coursePlanAdd_huiyi', {result : obj});
            }

        } else {
            next();
        }
    });
}

module.exports.add = function (req, res, next) {

    var classroomid = req.query.classroomid ? req.query.classroomid : '';
    var courseId = req.query.courseId ? req.query.courseId : '';
    var date = req.query.date ? req.query.date : '';

    var type = req.query.courseType ? requ.query.courseType : '';

    // 内训
    if (type == 1) {


    }


}

module.exports.edit = function (req, res, next) {


    var courseId = req.query.courseId ? req.query.courseId : '';
    var classRoomId = req.query.classRoomId ? req.query.classRoomId : '';
    var date = req.query.date ? req.query.date : '';
    res.render('coursePlan/coursePlanEdit');

}
