/**
 * Created by kuanchang on 16/1/20.
 */

var service_storeroom = require('../../model/service/storeroom');

/**
 * 获取移库列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res, next) {

    res.render('storeroomMove/storeroomMoveList');
}

/**
 * 增加移库单
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    res.render('storeroomMove/storeroomMoveAdd');
}