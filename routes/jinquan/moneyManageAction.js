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


    var memberId = req.body.memberId ? req.body.memberId : '';//会员id
    var staffId = req.body.staffId ? req.body.staffId : '';//员工id
    var classMeetId = req.body.classMeetId ? req.body.classMeetId : '';//课程id
    var serviceId = req.body.serviceId ? req.body.serviceId : '';//服务单id
    var state = req.body.state ? req.body.state : '';//状态
    var chargeType = req.body.chargeType ? req.body.chargeType : '';//收费项目
    var remark = req.body.remark ? req.body.remark : '';//描述

    var proId = req.body.proId ? req.body.proId : '';//商品id
    var price = req.body.price ? req.body.price : '';//商品单价
    var count = req.body.count ? req.body.count : '';//购买数量
    var cost = req.body.cost ? req.body.cost : '';//小计

    // 处理子女集合数据
    var proArr = new Array();
    if (proId instanceof Array) {
        for (var i = 0; i < proId.length; i++) {
            var obj = {};
            obj.proId = proId[i];
            obj.price = price[i];
            obj.count = count[i];
            obj.cost = cost[i];
            proArr.push(obj);
        }
    } else {
        var obj = {};
        obj.proId = proId;
        obj.price = price;
        obj.count = count;
        obj.cost = cost;
        proArr.push(obj);
    }


    service.insertMoneyManage(chargeType,memberId,staffId,classMeetId,serviceId,state,function(err, results) {
        if (!err) {
            res.redirect('/jinquan/money_manage_list?replytype=add');
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


