/**
 * Created by kuanchang on 16/1/18.
 */

/**
 * 获取投诉列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('complain/complainList');
}
/**
 * 增加投诉
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('complain/complainAdd');
}