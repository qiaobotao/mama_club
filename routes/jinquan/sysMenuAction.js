/**
 * Created by kuanchang on 16/1/21.
 */
/**
 * 获取菜单列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('sysMenu/sysMenuList');
}
/**
 * 增加菜单
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('sysMenu/sysMenuAdd');
}