/**
 * Created by kuanchang on 16/1/13.
 */
/**
 * 获取考勤类型列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('attendanceType/attendanceTypeList');
}
/**
 * 增加员工
 * @param req
 * @param res
 */
module.exports.edit = function (req, res) {
    res.render('attendanceType/attendanceTypeEdit');
}