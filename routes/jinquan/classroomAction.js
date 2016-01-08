/**
 * Created by kuanchang on 16/1/7.
 */
/**
 * 获取教室列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('classroom/classroomList');
}

/**
 * 增加门店
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('classroom/classroomAdd');
}