/**
 * Created by kuanchang on 16/1/21.
 */
/**
 * 获取角色列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('sysRole/sysRoleList');
}
/**
 * 增加角色
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('sysRole/sysRoleAdd');
}