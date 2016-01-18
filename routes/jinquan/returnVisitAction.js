/**
 * Created by kuanchang on 16/1/18.
 */
/**
 * 获取预约课程列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('returnVisit/returnVisitList');
}

/**
 * 增加预约课程
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('returnVisit/returnVisitAdd');
}