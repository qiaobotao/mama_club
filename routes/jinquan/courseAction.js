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