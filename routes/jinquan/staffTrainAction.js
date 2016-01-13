/**
 * Created by kuanchang on 16/1/13.
 */
/**
 * 获取员工培训列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('staffTrain/staffTrainList');
}
/**
 * 增加员工
 * @param req
 * @param res
 */
module.exports.edit = function (req, res) {
    res.render('staffTrain/staffTrainEdit');
}