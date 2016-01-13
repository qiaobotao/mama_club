/**
 * Created by kuanchang on 16/1/12.
 */

/**
 * 获取员工列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('staff/staffList');
}
/**
 * 增加员工
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('staff/staffAdd');
}