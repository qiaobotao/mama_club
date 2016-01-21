/**
 * Created by kuanchang on 16/1/21.
 */
/**
 * 获取用户列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('sysUser/sysUserList');
}
/**
 * 增加用户
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('sysUser/sysUserAdd');
}
/**
 * 设置用户属性
 * @param req
 * @param res
 */
module.exports.set = function (req, res) {
    res.render('sysUser/sysUserSet');
}