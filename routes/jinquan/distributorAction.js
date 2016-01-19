/**
 * Created by kuanchang on 16/1/20.
 */
/**
 * 获取经销商列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('distributor/distributorList');
}

/**
 * 增加经销商
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('distributor/distributorAdd');
}