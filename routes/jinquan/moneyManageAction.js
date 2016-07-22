/**
 * Created by kuanchang on 16/4/14.
 * 金钱管理（收费管理）
 */

var laypage = require('laypage');
var service = require('../../model/service/moneyManage');//收费单Server
var memberCardService = require('../../model/service/membercard');
var nursService = require('../../model/service/nursservice');//护理服务单Service
var consts = require('../../model/utils/consts');
var utils = require('../../common/utils');
var commonUtil = require('../../model/utils/common');//公共类

/**
 * 获取收费管理列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res, next) {
    utils.printSystemLog("kchang在收费单list中");
    var currentPage = req.query.page ? req.query.page : '1';
    var chargeType = req.query.chargeType ? req.query.chargeType : '';//收费类型
    var startDate = req.query.startDate ? req.query.startDate : '';//开始时间
    var endDate = req.query.endDate ? req.query.endDate : '';//截止时间
    var state = req.query.state ? req.query.state : '';//状态

    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;

    service.fetchAllMoneyManage(chargeType,startDate,endDate,state,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.chargeType = chargeType;
            results.startDate = startDate;
            results.endDate = endDate;
            results.state = state;
            res.render('moneyManage/moneyManagelist', {data : results, replytype : replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
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

    var id = req.query.id ? req.query.id : '';//收费单id
    var chargeType = req.query.chargeType ? req.query.chargeType : '2';//仅购买商品
    var thisDate = commonUtil.date2str(new Date(),'yyyy-MM-dd');

    //1、购买会员卡；2、护理收费；3、上课付费；4、仅商品购买；5、仅服务次卡；6、员工内购；7、会员卡续费
    if (chargeType == 1) {//购买会员卡
        res.render('moneyManage/moneyManageEdit_buycard', {data : results,chargeType:chargeType});
    } else if (chargeType == 2) {//护理收费

        service.fetchSingleMoneyManageByHuli(id, thisDate,function(err, results) {
            if (!err) {
                var moneyObj = results.moneyManageData.length > 0 ? results.moneyManageData[0]:{};//收费单单独处理
                var serviceArr = results.moneyManageServicesData.length > 0 ? results.moneyManageServicesData:{};//收费单（服务子表）单独处理
                var proArr = results.moneyManageWaresData.length > 0 ? results.moneyManageWaresData:{};//收费单（商品子表）单独处理
                var activityManageData = results.activityManageData.length > 0 ? results.activityManageData:{};//收费单（商品子表）单独处理
                res.render('moneyManage/moneyManageEdit_huli', {moneyObj : moneyObj,serviceArr:serviceArr,proArr:proArr,activityManageData:activityManageData,chargeType:chargeType});
            } else {
                next();
            }
        });
        /*
        //对于护理收费，还要获取护理单信息
        nursService.getNurServiceById(results.moneyManageData.serviceId,function(err, nurServiceRes) {
            if (!err) {
            }else{
                next();
            }
        });
        */
    } else if (chargeType == 3) {//上课付费
        res.render('moneyManage/moneyManageEdit_kecheng', {data : results,chargeType:chargeType});
    } else if (chargeType == 4) {//仅商品购买
        res.render('moneyManage/moneyManageEdit_shangpin', {data : results,chargeType:chargeType});
    } else if (chargeType == 5) {//仅服务此卡
        res.render('moneyManage/moneyManageEdit_service', {data : results,chargeType:chargeType});
    } else if (chargeType == 6) {//员工内购
        res.render('moneyManage/moneyManageEdit_neigou', {data : results,chargeType:chargeType});
    } else if (chargeType == 7) {//会员续费
        res.render('moneyManage/moneyManageEdit_xufei', {data : results,chargeType:chargeType});
    }
}

/**
 * 增加收费管理
 * @param req
 * @param res
 */
module.exports.save = function(req, res, next) {

    var shopId = req.session.user.shopId;//所属门店id
    var id = req.body.id ? req.body.id : '';//收费单id
    var nursServiceId = req.body.nursServiceId ? req.body.nursServiceId : '';//护理服务单编号
    var memberId = req.body.memberId ? req.body.memberId : '';//会员id
    var memberCardId = req.body.memberCardId ? req.body.memberCardId : '';//会员卡id
    var staffId = req.body.staffId ? req.body.staffId : '';//员工id
    var classMeetId = req.body.classMeetId ? req.body.classMeetId : '';//课程id
    var serviceMeetId = req.body.serviceMeetId ? req.body.serviceMeetId : '';//预约服务单id
    var chargeType = req.body.chargeType ? req.body.chargeType : '';//收费项目
    var payType = req.body.payType ? req.body.payType : '';//支付方式：现金；充值卡；折扣卡；微信；支付宝
    var receivableMoney = req.body.receivableMoney ? req.body.receivableMoney : '';//应收金额
    var discountMoney = req.body.activityDiscountMoney ? req.body.activityDiscountMoney : '';//优惠金额
    var actualMoney = req.body.actualMoney ? req.body.actualMoney : '';//实收金额
    var activityManageId = req.body.availableActivity ? req.body.availableActivity : '';//参与的活动id（如果没选活动不添加即可）
    var activityManageMxId = req.body.lessLevel ? req.body.lessLevel : '';//活动中，选择的优惠方式id
    var discounts = req.body.discounts ? req.body.discounts : '';//折上折力度
    var discountsMoney = req.body.discountsMoney ? req.body.discountsMoney : '';//折扣卡优惠费用
    var finalActualMoney = req.body.finalActualMoney ? req.body.finalActualMoney : '';//折上折力度
    var meetTime = req.body.meetTime ? req.body.meetTime : '';//预约时间
    var serviceStartTime = req.body.serviceTime ? req.body.serviceTime : '';//开始服务时间
    var serviceEndTimeHH = req.body.serviceEndTimeHH ? req.body.serviceEndTimeHH : '';//服务截止时间(小时)
    var serviceEndTimeSS = req.body.serviceEndTimeSS ? req.body.serviceEndTimeSS : '';//服务截止时间（分钟）
    var serviceDate = meetTime.split(" ")[0];//服务日期
    var serviceEndTime = serviceEndTimeHH+":"+serviceEndTimeSS;
    var state = "0";
    if(payType != '0'){//不是延迟收费，即为已收费
        state = "1";//1、已收费；0：未收费
    }

    if(chargeType == ''){
        res.redirect('/jinquan/money_manage_list?replytype=error');
        return;
    }

    //记录商品信息集合  start
    var proId = req.body.proId ? req.body.proId : '';//商品id
    var proNo = req.body.proNo ? req.body.proNo : '';//商品编码
    var price = req.body.price ? req.body.price : '';//商品单价
    var insidePrice = req.body.insidePrice ? req.body.insidePrice : '';//内部单价
    var count = req.body.count ? req.body.count : '';//购买数量
    var subtotal = req.body.subtotal ? req.body.subtotal : '';//小计
    var discount = req.body.lessMoney ? req.body.lessMoney : '';//优惠价格

    // 处理商品集合数据
    var proArr = new Array();
    if (proNo instanceof Array) {
        for (var i = 0; i < proNo.length; i++) {
            var obj = {};
            obj.waresId = proId[i];
            obj.price = price[i];
            obj.count = count[i];
            obj.subtotal = subtotal[i];
            obj.discount = discount[i];
            obj.insidePrice = insidePrice[i];
            proArr.push(obj);
        }
    } else {
        if(proNo != ""){
            var obj = {};
            obj.waresId = proId;
            obj.price = price;
            obj.count = count;
            obj.subtotal = subtotal;
            obj.discount = discount;
            obj.insidePrice = insidePrice;
            proArr.push(obj);
        }
    }
    //记录商品信息集合  end

    //记录服务信息集合  start
    var serviceId = req.body.serviceId ? req.body.serviceId : '';//服务id
    var serviceCount = req.body.serviceCount ? req.body.serviceCount : '';//服务次数
    var servicePrice = req.body.servicePrice ? req.body.servicePrice : '';//服务单价
    var serviceSubtotal = req.body.serviceSubtotal ? req.body.serviceSubtotal : '';//服务小计
    var serviceLessMoney = req.body.serviceLessMoney ? req.body.serviceLessMoney : '';//服务优惠费用
    var serviceStaffId = req.body.serviceStaffId ? req.body.serviceStaffId : '';//服务技师
    var serviceTraineeId = req.body.serviceTraineeId ? req.body.serviceTraineeId : '';//实习技师


    // 处理服务集合数据
    var serviceArr = new Array();
    if (serviceId instanceof Array) {
        for (var i = 0; i < serviceId.length; i++) {
            var obj = {};
            obj.serviceId = serviceId[i];
            obj.serviceCount = serviceCount[i];
            obj.servicePrice = servicePrice[i];
            obj.serviceSubtotal = serviceSubtotal[i];
            obj.serviceLessMoney = serviceLessMoney[i];
            obj.serviceStaffId = serviceStaffId[i];
            obj.serviceTraineeId = serviceTraineeId[i];
            serviceArr.push(obj);
        }
    } else {
        var obj = {};
        obj.serviceId = serviceId;
        obj.serviceCount = serviceCount;
        obj.servicePrice = servicePrice;
        obj.serviceSubtotal = serviceSubtotal;
        obj.serviceLessMoney = serviceLessMoney;
        obj.serviceStaffId = serviceStaffId;
        obj.serviceTraineeId = serviceTraineeId;
        serviceArr.push(obj);
    }
    //记录服务信息集合  end
    if(id != ""){//只可以修改总费用和状态
        service.updateMoneyManage(id, payType,actualMoney,state,function(err,results){
            if(!err){
                res.redirect('/jinquan/money_manage_list?replytype=edit');
            }else{
                next();
            }
        });
    }else{
        //1、购买会员卡；2、护理收费；3、上课付费；4、仅商品购买；5、仅服务次卡；6、员工内购；7、会员卡续费
        service.insertMoneyManage(shopId,chargeType,memberId,memberCardId,staffId,classMeetId,payType,receivableMoney,discountMoney,actualMoney,activityManageId,activityManageMxId,discounts,discountsMoney,finalActualMoney,state,function(err, results) {
            if (!err) {
                var moneyManageId = results.insertId;
                if(chargeType == 1){//购买会员卡：需要将会员卡状态改为启用
                    memberCardService.updateMemberCardByActivation(consts.STATE_ENABLE,memberCardId,function(err, results) {
                        if (!err) {
                            res.redirect('/jinquan/money_manage_list?replytype=add');
                        } else {
                            next();
                        }
                    });
                }else if(chargeType == 2){//添加护理服务单
                    //nursService.insertNursServiceByMoneyManage(serviceMeetId,serviceDate,serviceStartTime,serviceEndTime,function(err, results) {
                    //更新护理服务单中状态以及结束时间
                    var nursState = payType>0?"2":"3";
                    //状态
                    //2、完成已收费
                    //3、完成未收费
                    nursService.updateNursServiceByMoneyManage(nursServiceId,nursState,serviceEndTime,function(err, results) {
                        if (!err) {
                            //更新收费单主表中的服务单id
                            service.updateMoneyManage4ServiceId(moneyManageId,nursServiceId,function(err, results) {
                                if (!err) {
                                    //将收费的服务信息保存到子表中（并记录收费主表id、nursServiceId）
                                    service.insertServiceByMoneyManage(moneyManageId,nursServiceId,serviceArr,function(err, results) {
                                        if (!err) {
                                            if(proArr.length > 0){
                                                //将收费的商品信息保存到子表中（并记录收费主表id、护理服务单主表id）
                                                service.insertProsByMoneyManage(moneyManageId,nursServiceId,proArr,function(err, results) {
                                                    if (!err) {
                                                        //增加出库单后，进行跳转
                                                        res.redirect('/jinquan/money_manage_list?replytype=add');
                                                    } else {
                                                        next();
                                                    }
                                                });
                                            }else{
                                                res.redirect('/jinquan/money_manage_list?replytype=add');
                                            }
                                        } else {
                                            next();
                                        }
                                    });
                                } else {
                                    next();
                                }
                            });
                        } else {
                            next();
                        }
                    });
                }else if(chargeType == 3 || chargeType == 4 || chargeType == 6){//需要添加商品
                    service.insertProsByMoneyManage(moneyManageId,proArr,function(err, results) {
                        if (!err) {
                            /**
                             * 判断所有商品出自几个库房
                             * 如果是多个，分开生成多个出库单
                             *      a、遍历所有商品对应库房id，判断分别出自几个库房
                             *      b、添加所有入库单主表
                             *      c、添加所有入库单子表（主表id通过第二步获取）
                             *      c、修改库存表数据
                             */

                            res.redirect('/jinquan/money_manage_list?replytype=add');
                        } else {
                            next();
                        }
                    });
                }else if(chargeType = 5){//服务此卡：只修改
                    nursService.insertNursServiceByMoneyManage(serviceMeetId,function(err, results) {
                        if (!err) {
                            var nursServiceId = results.insertId;//刚创建的服务单id
                            //更新收费单主表中的服务单id
                            service.updateMoneyManage4ServiceId(moneyManageId,nursServiceId,function(err, results) {
                                if (!err) {
                                    //将收费的服务信息保存到子表中（并记录收费主表id、护理服务单主表id）
                                    service.insertServiceByMoneyManage(moneyManageId,nursServiceId,serviceArr,function(err, results) {
                                        if (!err) {
                                            res.redirect('/jinquan/money_manage_list?replytype=add');
                                        } else {
                                            next();
                                        }
                                    });
                                } else {
                                    next();
                                }
                            });
                        } else {
                            next();
                        }
                    });
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
    var serviceId = req.query.serviceId ? req.query.serviceId :'';

    service.delMoneyManage(id,serviceId,function(err, results){
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



