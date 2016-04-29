/**
 * Created by kuanchang on 16/1/7.
 */
/**
 * 获取课程列表
 * @param req
 * @param res
 */
var service = require('../../model/service/course');
var laypage = require('laypage');
var consts = require('../../model/utils/consts');

module.exports.list = function (req, res,next) {

    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    var currentPage = req.query.page ? req.query.page : '1';
    var classroom = req.query.classroom ? req.query.classroom : '';
    var courseType = req.query.courseType ? req.query.courseType : '';
    var date = req.query.date ? req.query.date : '';

    var url = '/jinquan'+req.url;
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';

    service.getCourseList(shopId,classroom,courseType,date,currentPage,function(err, results){
        if (!err){
            results.currentPage = currentPage;
            results.classroom = classroom;
            results.courseType = courseType;
            results.date = date;
            res.render('course/courseList',{data : results,replytype : replytype,laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages})
            });

        } else {
            next();
        }
    });
}
/**
 * 增加教室
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('course/courseAdd');
}

module.exports.select = function (req, res, next) {

    var currentPage = req.query.page ? req.query.page : 1;
    service.selectAllCourse(currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            var courseDate = consts.COURSE_DATE;
            res.render('course/courseSelect', {data : results,courseDate:courseDate});
        } else {
            next();
        }
    });

}
/**
 * 只查询父母课程作为活动可选择的课程
 * @param req
 * @param res
 * @param next
 */
module.exports.selectForActivity = function (req, res, next) {

    var currentPage = req.query.page ? req.query.page : 1;
    var courseType = req.query.courseType ? req.query.courseType : '';
    var index = req.query.index ? req.query.index : '';
    var courseIds=req.query.courseIds ? req.query.courseIds : '';
    service.selectCourseByType(currentPage,courseIds ,courseType, function (err, results) {
        if (!err) {
            res.render('course/courseSelectActivity', {data : results,index : index});
        } else {
            next();
        }
    });

}

module.exports.detail = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';
    var type = req.query.type ? req.query.type : '';
    if (type == 1) {
        service.browse_neixun(id,function(err, results){
            if (!err) {
                res.render('course/courseDetail_neixun', {data : results});
            } else {
                next();
            }
        });
    } else if (type ==2) { // 专业

       service.browse_zhuanye(id,function(err, results) {

           if (!err) {
               res.render('course/courseDetail_zhuanye', {data : results});

           } else {
               next();
           }
       });

    } else if (type ==3) {  // 父母

        service.browse_fumu(id,function(err, results) {
            if (!err) {
                res.render('course/courseDetail_fumu', {data : results});
            }  else {
                next();
            }

        });

    } else if (type ==4) { // 会议
        service.browse_huiyi(id,function(err, results) {
            if (!err) {
                res.render('course/courseDetail_huiyi', {data : results});
            } else {
                next();
            }
        });
    }
}

module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';
    var type = req.query.type ? req.query.type : '';

    service.delCourse(id,type,function(err, result){

        if (!err) {
            res.redirect('/jinquan/course_list?replytype='+result);

        } else {
            console.log(err);
            next();
        }

    });
}