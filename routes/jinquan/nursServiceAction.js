/**
 * Created by kuanchang on 16/1/18.
 */
/**
 * 获取护理服务列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('nursService/nursServiceList');
}

/**
 * 增加会员
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('nursService/nursServiceAdd');
}