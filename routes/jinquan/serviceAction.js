/**
 * Created by kuanchang on 16/1/18.
 */
/**
 * 获取服务列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('service/serviceList');
}
/**
 * 增加服务表单
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('service/serviceAdd');
}