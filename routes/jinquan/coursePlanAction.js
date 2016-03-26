/**
 * Created by qiaojoe on 16-3-13.
 */

var service = require('../../model/service/course');

module.exports.list = function (req, res, next) {

    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';

    service.getCoursePlanList(function (err, results) {
        if (!err) {
            res.render('coursePlan/coursePlanList',{data : results,replytype:replytype});
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

    var type = req.query.type ? req.query.type : '';

    // 内训
    if (type == 1) {

        var course = req.body.course ? req.body.course : '';
        var teacher = req.body.teacherid ? req.body.teacherid : '';
        var startTime = req.body.startTime ? req.body.startTime : '';
        var endTime = req.body.endTime ? req.body.endTime : '';
        var score = req.body.score ? req.body.score : '';
        var content = req.body.content ? req.body.content : '';
        //重复项
        var arr_staffId = req.body.staffId ? req.body.staffId : '';
        // 处理数据
        var arr = new Array();
        if (arr_staffId instanceof Array) {
            for (var i=0;i<arr_staffId.length;i++) {
                var obj = {};
                obj.staffId = arr_staffId[i];
                arr.push(obj);
            }
        } else {
            var obj = {};
            obj.staffId = arr_staffId;
            arr.push(obj);
        }

        service.insertCourse_neixun(course,classroomid,date,startTime,endTime,type,score,content,arr,teacher,function(err, results) {

            if(!err) {
                 res.redirect('/jinquan/course_plan?replytype=add');
            } else {
                next();
            }
        }) ;
    } else if (type == 2) { // 专业课
        var course = req.body.course ? req.body.course : '';
        var startTime = req.body.startTime ? req.body.startTime : '';
        var endTime = req.body.endTime ? req.body.endTime : '';
        // 重复项

    } else if (type == 3) { // 父母课

        var count = req.body.count ? req.body.count : '';
        var price = req.body.price ? req.body.price : '';
        var startTime = req.body.startTime ? req.body.startTime :'';
        var endTime = req.body.endTime ? req.body.endTime : '';
        var content = req.body.content ? req.body.content : '';


    } else { // 会议

        var startTime = req.body.startTime ? req.body.startTime : '';
        var endTime = req.body.endTime ? req.body.endTime : '';
        var content = req.body.content ? req.body.content : '';

    }


}

module.exports.edit = function (req, res, next) {

    var courseId = req.query.courseId ? req.query.courseId : '';
    var classRoomId = req.query.classRoomId ? req.query.classRoomId : '';
    var date = req.query.date ? req.query.date : '';
    var courseType = req.query.type ? req.query.type : '';

    if (courseType == 1) { // 内训

        service.browse_neixun(courseId,function (err, results) {
            if (!err) {

                service.getPlan(classRoomId,date,function(err, plans) {

                    if (!err) {
                        results.coursePlan = plans;
                        results.classRoomId = classRoomId;
                        results.courseId = courseId;
                        results.date = date;
                        console.log(results);
                        res.render('coursePlan/coursePlanEdit_neixun',{result : results});
                    } else {
                       next();
                    }
                });
            } else {
                next();
            }
        });
    }
}
