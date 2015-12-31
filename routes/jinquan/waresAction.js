/**
 * Created by qiaojoe on 15-12-12.
 * 商品Action
 */

var service = require('../../model/service/wares');

/**
 * 商品展示首页list
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {

    service.fetchAllWares(function(err, results){
        if (!err) {
            res.render('wares/waresList', {wares : results});
        } else {
            console.log(err.message);
            res.render('error');
        }
    });
}

/**
 * 查看商品详情
 * @param req
 * @param res
 */
module.exports.detail = function (req, res) {

    var id = req.query.id ? req.query.id : 0;
    service.fetchSingleWares(id, function(err, results){

        if (!err) {
            var wares = results.length == 0 ? '' : results[0];
            res.render('wares/waresDetail', {wares : wares});
        } else {
            console.log(err.message);
            res.render('error');
        }
    });
}

/**
 * 编辑商品
 * @param req
 * @param res
 */
module.exports.preEdit = function (req, res) {

    var id = req.query.id ? req.query.id : 0;
    service.fetchSingleWares(id, function(err, results){

        if (!err) {
            var wares = results.length == 0 ? null : results[0];
            res.render('wares/waresEdit', {wares : wares});
        } else {
            console.log(err.message);
            res.render('error');
        }
    });
}

/**
 * 修改商品
 * @param req
 * @param res
 */
module.exports.waresUpdate = function (req, res) {

}


