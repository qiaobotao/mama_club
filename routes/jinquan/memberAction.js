/**
 * Created by kuanchang on 16/1/17.
 */
/**
 * 获取会员列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('member/memberList');
}

/**
 * 增加会员
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('member/memberAdd');
}