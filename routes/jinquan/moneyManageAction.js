/**
 * Created by kuanchang on 16/4/14.
 * 金钱管理（收费管理）
 */

var laypage = require('laypage');
var service = require('../../model/service/moneyManage');

/**
 * 获取收费管理列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res, next) {

    var currentPage = req.query.page ? req.query.page : '1';
    var shopname = req.query.shopname ? req.query.shopname : '';
    var principal = req.query.principal ? req.query.principal : '';
    var number = req.query.number ? req.query.number : '';

    var url = '/jinquan'+req.url;
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';

    service.fetchAllMoneyManage(shopname,principal,number,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.name = shopname;
            results.principal = principal;
            results.number = number;
            res.render('moneyManage/moneyManagelist', {data : results, replytype : replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages})
            });
        } else {
            console.log(err);
            next();
        }
    });
}

/**
 * 跳转到编辑页面（用于修改、添加）
 * @param req
 * @param res
 */
module.exports.edit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleMoneyManage(id, function(err, results) {
        if (!err) {
            var moneyManage = results.length == 0 ? null : results[0];
            res.render('moneyManage/moneyManageEdit', {moneyManage : moneyManage});
        } else {
            next();
        }
    })
}

/**
 * 增加收费管理
 * @param req
 * @param res
 */
module.exports.save = function(req, res, next) {

    var serialNumber = req.body.serialNumber ? req.body.serialNumber : '';
    var name = req.body.name ? req.body.name : '';
    var principal = req.body.principal ? req.body.principal : '';
    var tel = req.body.tel ? req.body.tel : '';
    var address = req.body.address ? req.body.address : '';
    var remark = req.body.remark ? req.body.remark : '';

    service.insertMoneyManage(serialNumber,name,principal,tel,address,remark,function(err, results) {
        if (!err) {
            res.redirect('/jinquan/shop_list?replytype=add');
        } else {
            next();
        }
    });

}

/**
 * 删除收费管理
 * @param req
 * @param res
 */
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delMoneyManage(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/shop_list?replytype=del');
        } else {
            next();
        }
    });

}

/**
 * 设置收费管理是否可用
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

    service.updateMoneyManage(id, serialNumber,  name, address, principal, tel, remark, function(err, results) {
        if (!err) {
            res.redirect('/jinquan/shop_list?replytype=update');
        } else {
            next();
        }
    })
}

module.exports.browse = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';
    service.fetchSingleMoneyManage(id, function (err, results) {
        if (!err && results.length != 0) {
            var data = results[0];
            res.render('shop/shopBrowse', {data : data});
        } else {
            next();
        }
    })
}


