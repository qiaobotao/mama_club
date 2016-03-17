/**
 * Created by kuanchang on 16/1/7.
 */
/**
 * 获取课程列表
 * @param req
 * @param res
 */
var service = require('../../model/service/course');

module.exports.list = function (req, res) {
    res.render('course/courseList');
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
            res.render('course/courseSelect', {data : results});
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