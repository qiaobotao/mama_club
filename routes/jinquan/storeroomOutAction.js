/**
 * Created by kuanchang on 16/1/20.
 */
/**
 * 获取出库列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('storeroomOut/storeroomOutList');
}

/**
 * 增加出库单
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('storeroomOut/storeroomOutAdd');
}