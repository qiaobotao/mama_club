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
module.exports.list = function (req, res, next) {

    var currentPage = req.query.page ? req.query.page : '1';
    var shopname = req.query.shopname ? req.query.shopname : '';
    var principal = req.query.principal ? req.query.principal : '';
    var number = req.query.number ? req.query.number : '';

    service.fetchAllShop(shopname,principal,number,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.name = shopname;
            results.principal = principal;
            results.number = number;
            res.render('shop/shopList', {data : results});
        } else {
            next();
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
module.exports.add = function(req, res, next) {

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
           next();
       }
   });

}

/**
 * 删除门店
 * @param req
 * @param res
 */
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delShop(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/shop_list');
        } else {
            next();
        }
    });

}

/**
 * 设置门店是否可用
 * @param req
 * @param res
 */
module.exports.setStatus = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';
    var status = req.query.status ? req.query.status : '';
    var selectPage = req.query.page ? req.query.page : '1';
    var shopname = req.query.shopname ? req.query.shopname : '';
    var principal = req.query.principal ? req.query.principal : '';
    var number = req.query.number ? req.query.number : '';


    service.setStatus(id, status, function (err, results) {

        if (!err) {
            res.redirect('/jinquan/shop_list?page='+selectPage+'&shopname='+shopname+'&principal='+principal+'&number='+number);
        } else {
            next();
        }

    })
}

/**
 * 修改
 * @param req
 * @param res
 */
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleShop(id, function(err, results) {
        if (!err) {
            var shop = results.length == 0 ? null : results[0];
            res.render('shop/shopEdit', {shop : shop});
        } else {
            next();
        }
    })
}

/**
 * 修改保存
 * @param req
 * @param res
 */
module.exports.update = function(req, res,next) {

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
            next();
        }
    })
}

