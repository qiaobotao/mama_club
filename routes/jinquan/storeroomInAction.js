/**
 * Created by kuanchang on 16/1/20.
 */
/**
 * 获取入库列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('storeroomIn/storeroomInList');
}

/**
 * 增加入库单
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('storeroomIn/storeroomInAdd');
}