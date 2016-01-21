/**
 * Created by kuanchang on 16/1/21.
 */
/**
 * 获取资源列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('sysResources/sysResourcesList');
}
/**
 * 增加资源
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('sysResources/sysResourcesAdd');
}