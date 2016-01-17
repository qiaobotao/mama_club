/**
 * Created by kuanchang on 16/1/17.
 */
/**
 * 获取预约服务列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('serviceMeet/serviceMeetList');
}

/**
 * 增加预约服务
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('serviceMeet/serviceMeetAdd');
}