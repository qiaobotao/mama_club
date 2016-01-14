/**
 * Created by kuanchang on 16/1/13.
 */

/**
 * 获取活动列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('activityManage/activityManageList');
}
/**
 * 编辑活动
 * @param req
 * @param res
 */
module.exports.edit = function (req, res) {
    res.render('activityManage/activityManageEdit');
}