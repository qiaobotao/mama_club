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

   service.insertShop(serialNumber,name,principal,tel,address,remark,function(err, results) {
       if (!err) {
           res.redirect('/jinquan/shop_list');
       } else {
           console.log(err.message);
           res.render('error', {error : err});
       }
   });

}

/**
 * 删除门店
 * @param req
 * @param res
 */
module.exports.del = function (req, res) {

    var id = req.query.id ? req.query.id :'';

    service.delShop(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/shop_list');
        } else {
            console.log(err.message);
            res.render('error', {message : err});
        }
    });

}

/**
 * 设置门店是否可用
 * @param req
 * @param res
 */
module.exports.setStatus = function(req, res) {

    var id = req.query.id ? req.query.id : '';
    var status = req.query.status ? req.query.status : '';

    service.setStatus(id, status, function (err, results) {

        if (!err) {
            res.redirect('/jinquan/shop_list');
        } else {
            console.log(err.message);
            res.render('error', {message : err});
        }

    })
}

/**
 * 修改
 * @param req
 * @param res
 */
module.exports.preEdit = function(req, res) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleShop(id, function(err, results) {
        if (!err) {
            var shop = results.length == 0 ? null : results[0];
            res.render('shop/shopEdit', {shop : shop});
        } else {
            console.log(err.message);
            res.render('error', {message : err});
        }
    })
}

/**
 * 修改保存
 * @param req
 * @param res
 */
module.exports.update = function(req, res) {

    var id = req.body.id ? req.body.id : '';
    var serialNumber = req.body.serialNumber ? req.body.serialNumber : '';
    var name = req.body.name ? req.body.name : '';
    var principal = req.body.principal ? req.body.principal : '';
    var tel = req.body.tel ? req.body.tel : '';
    var address = req.body.address ? req.body.address : '';
    var remark = req.body.remark ? req.body.remark : '';

    service.updateShop(id, serialNumber,  name, address, principal, tel, remark, function(err, results) {
        if (!err) {
            res.redirect('/jinquan/shop_list');
        } else {
            console.log(err.message);
            res.render('error', {message : err});
        }
    })
}