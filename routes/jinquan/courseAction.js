/**
 * Created by kuanchang on 16/1/7.
 */
/**
 * 获取课程列表
 * @param req
 * @param res
 */
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