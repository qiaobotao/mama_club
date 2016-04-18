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

    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;

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
    var chargeType = req.query.chargeType ? req.query.chargeType : '3';//收费类型

    service.fetchSingleMoneyManage(id, '2016-03-17',function(err, results) {
        if (!err) {
            //1、护理；2、课程；3、商品；4、购买会员卡；5、内购；6、会员卡续费
            if (chargeType == 1) {//护理收费
                res.render('moneyManage/moneyManageEdit_huli', {data : results,chargeType:chargeType});
            } else if (chargeType == 2) {//课程收费
                res.render('moneyManage/moneyManageEdit_kecheng', {data : results,chargeType:chargeType});
            } else if (chargeType == 3) {//会员购买商品收费
                res.render('moneyManage/moneyManageEdit_shangpin', {data : results,chargeType:chargeType});
            } else if (chargeType == 4) {//购买会员卡
                res.render('moneyManage/moneyManageEdit_buycard', {data : results,chargeType:chargeType});
            } else if (chargeType == 5) {//员工内购
                res.render('moneyManage/moneyManageEdit_neigou', {data : results,chargeType:chargeType});
            } else if (chargeType == 6) {//会员卡缴费
                res.render('moneyManage/moneyManageEdit_xufei', {data : results,chargeType:chargeType});
            }
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

    var id = req.body.id ? req.body.id : '';//收费单id
    var memberId = req.body.memberId ? req.body.memberId : '';//会员id
    var staffId = req.body.staffId ? req.body.staffId : '';//员工id
    var classMeetId = req.body.classMeetId ? req.body.classMeetId : '';//课程id
    var serviceId = req.body.serviceId ? req.body.serviceId : '';//服务单id
    var state = req.body.state ? req.body.state : '';//状态
    var chargeType = req.body.chargeType ? req.body.chargeType : '';//收费项目
    var remark = req.body.remark ? req.body.remark : '';//描述
    if(chargeType == ''){
        res.redirect('/jinquan/money_manage_list?replytype=error');
        return;
    }

    var proNo = req.body.proNo ? req.body.proNo : '';//商品id
    var price = req.body.price ? req.body.price : '';//商品单价
    var count = req.body.count ? req.body.count : '';//购买数量
    var subtotal = req.body.subtotal ? req.body.subtotal : '';//小计
    var discountPrice = req.body.discountPrice ? req.body.discountPrice : '';//优惠后价格

    // 处理商品集合数据
    var proArr = new Array();
    if (proNo instanceof Array) {
        for (var i = 0; i < proNo.length; i++) {
            var obj = {};
            obj.waresId = proNo[i];
            obj.price = price[i];
            obj.count = count[i];
            obj.subtotal = subtotal[i];
            obj.discountPrice = discountPrice[i];
            proArr.push(obj);
        }
    } else {
        var obj = {};
        obj.waresId = proNo;
        obj.price = price;
        obj.count = count;
        obj.subtotal = subtotal;
        obj.discountPrice = discountPrice;
        proArr.push(obj);
    }
    if(id != ""){//只可以修改总费用和状态
        res.redirect('/jinquan/money_manage_list?replytype=edit');
    }else{
        service.insertMoneyManage(chargeType,memberId,staffId,classMeetId,serviceId,state,function(err, results) {
            if (!err) {
                /**
                 * 1、护理；2、课程；3、商品；4、购买会员卡；5、内购；6、会员卡续费
                 * 如果是课程、商品、内购，则需要继续添加商品集合
                 * 如果是护理服务单，还需要往护理服务单中增加一条记录
                 */
                var addPro = false;
                var addService = false;
                if(chargeType == 2 || chargeType == 3 || chargeType == 5){
                    addPro = true;
                }
                if(chargeType == 1){
                    addService = true;
                }
                if(addPro){//需要添加商品
                    service.insertProsByMoneyManage(results.insertId,proArr,function(err, results) {
                        if (!err) {
                            res.redirect('/jinquan/money_manage_list?replytype=add');
                        } else {
                            next();
                        }
                    });
                }
                if(addService){//添加护理服务单
                    //service.insertServiceByMoneyManage(results.insertId,proArr,function(err, results) {
                    //    if (!err) {
                    //        res.redirect('/jinquan/money_manage_list?replytype=add');
                    //    } else {
                    //        next();
                    //    }
                    //});
                }
                //res.redirect('/jinquan/money_manage_list?replytype=add');
            } else {
                next();
            }
        });
    }

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
            res.redirect('/jinquan/money_manage_list?replytype=del');
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


