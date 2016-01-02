/**
 * Created by qiaojoe on 15-12-5.
 * 门店管理
 */

var service = require('../../model/service/shop');

/**
 * 获取门店列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {

    service.fetchAllStorerooms(function (err, results) {
        if (!err) {
            res.render('shop/shopList', {shop : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}

/**
 * 增加门店页面
 * @param req
 * @param res
 */
module.exports.preAdd = function (req, res) {

    res.render('shop/shopAdd');

}

/**
 * 增加门店
 * @param req
 * @param res
 */
module.exports.add = function(req, res) {

    var serialNumber = req.body.serialNumber ? req.body.serialNumber : '';
    var name = req.body.name ? req.body.name : '';
    var principal = req.body.principal ? req.body.principal : '';
    var tel = req.body.tel ? req.body.tel : '';
    var address = req.body.address ? req.body.address : '';
    var remark = req.body.remark ? req.body.remark : '';
    var shopstatus = req.body.shopstatus ? req.body.shopstatus : '';

   service.insertShop(serialNumber,name,principal,tel,address,remark,function(err, results) {
       if (!err) {
           res.redirect('/jinquan/shop_list');
       } else {
           console.log(err.message);
           res.render('error', {error : err});
       }
   });

}