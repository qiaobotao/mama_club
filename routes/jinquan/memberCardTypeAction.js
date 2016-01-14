/**
 * Created by kuanchang on 16/1/13.
 */
/**
 * 获取会员卡类型列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('memberCardType/memberCardTypeList');
}
/**
 * 增加员工
 * @param req
 * @param res
 */
module.exports.edit = function (req, res) {
    res.render('memberCardType/memberCardTypeEdit');
}