
var laypage = require('laypage');
var service = require('../../model/service/nursservice');
var storeroomOutService = require('../../model/service/storeroomOut');
var serviceMeetService = require('../../model/service/servicemeet');
var commonUtil = require('../../model/utils/common');//公共类

/**
 * Created by kuanchang on 16/1/18.
 */
/**
 * 获取护理服务列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res,next) {
    //res.render('nursService/nursServiceList');
    // 从session 中获取门店id

    var shopId = req.session.user.shopId;
    var name = req.query.name ? req.query.name : '';
    var principal = req.query.principal ? req.query.principal : '';
    var serviceDate = req.query.serviceDate ? req.query.serviceDate : '';
    var currentPage = req.query.page ? req.query.page : 1;
    currentPage =currentPage<1?1:currentPage;
// 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;
    service.fetchAllNursService(shopId,name,principal,serviceDate,currentPage, function (err, results) {
        if (!err) {
            results.name = name;
            results.principal = principal;
            results.serviceDate = serviceDate;
            results.currentPage = currentPage;
            res.render('nursService/nursServiceList', {data : results, replytype : replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
            });
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}


module.exports.doEdit = function (req, res,next) {
    var id = req.body.id ? req.body.id : '';
    var serviceMeetId = req.body.serviceMeetId ? req.body.serviceMeetId : '';
    var serviceDate = req.body.serviceDate ? req.body.serviceDate : '';
    var name = req.body.name ? req.body.name : '';
    var tel = req.body.tel ? req.body.tel : '';
    var startTime = req.body.startTime ? req.body.startTime : '';
    var endTime = req.body.endTime ? req.body.endTime : '';
    var serviceType = req.body.serviceType ? req.body.serviceType : '';
    var address = req.body.address ? req.body.address : '';
    var bowelFrequenc = req.body.bowelFrequenc ? req.body.bowelFrequenc : '';
    //var deal = req.body.deal ? req.body.deal : '';
    var shape = req.body.shape ? req.body.shape : '';
    var feedSituation = req.body.feedSituation ? req.body.feedSituation : '';
    var urination = req.body.urination ? req.body.urination : '';
    var feedRemark = req.body.feedRemark ? req.body.feedRemark : '';
    var milkSituation = req.body.milkSituation ? req.body.milkSituation : '';
    var childCurrentMonths = req.body.childCurrentMonths ? req.body.childCurrentMonths : '';
    var milkNumber = req.body.milkNumber ? req.body.milkNumber : '';
    var childCurrentHeight = req.body.childCurrentHeight ? req.body.childCurrentHeight : '';
    var milkAmount = req.body.milkAmount ? req.body.milkAmount : '';
    var childCurrentWeight = req.body.childCurrentWeight ? req.body.childCurrentWeight : '';
    var isCarefulNurse = req.body.isCarefulNurse ? req.body.isCarefulNurse : '';
    var referralAdvise = req.body.referralAdvise ? req.body.referralAdvise : '';
    var specialInstructions = req.body.specialInstructions ? req.body.specialInstructions : '';
    var breastExplain = req.body.breastExplain ? req.body.breastExplain : '';
    var leaveAdvise = req.body.leaveAdvise ? req.body.leaveAdvise : '';
    var isLeadTrainee = req.body.isLeadTrainee ? req.body.isLeadTrainee : '';
    var whetherAppointmentAgain = req.body.whetherAppointmentAgain ? req.body.whetherAppointmentAgain : '';
    var traineeName = req.body.traineeName ? req.body.traineeName : '';

    var serviceNeedsTemp = req.body.serviceNeeds ? req.body.serviceNeeds : '';//服务需求可以是多选的
    var serviceNeeds = commonUtil.array2Str(serviceNeedsTemp,",");

    var breastpumpBrandTemp = req.body.breastpumpBrand ? req.body.breastpumpBrand : '';
    var breastpumpBrand = commonUtil.array2Str(breastpumpBrandTemp,",");

    var diagnosisTemp = req.body.diagnosis ? req.body.diagnosis : '';
    var diagnosis = commonUtil.array2Str(diagnosisTemp,",");


    var dealTemp = req.body.deal ? req.body.deal : '';
    var deal = commonUtil.array2Str(dealTemp,",");

    var childReasonTemp = req.body.childReason ? req.body.childReason : '';
    var childReason = commonUtil.array2Str(childReasonTemp,",");

    var motherReasonTemp = req.body.motherReason ? req.body.motherReason : '';
    var motherReason = commonUtil.array2Str(motherReasonTemp,",");

    var otherReasonTemp = req.body.otherReason ? req.body.otherReason : '';
    var otherReason = commonUtil.array2Str(otherReasonTemp,",");


    // 获取
    var oper = req.body.principalId ? req.body.principalId : '';
    var outType = req.body.outType ? req.body.outType : '37';
    var storeroom = req.body.storeroom ? req.body.storeroom : '1';//暂时无参数
    var remarks = req.body.remarks ? req.body.remarks : '护理服务时，会员购买商品';

    // 数组
    var arr_proId = req.body.proId ? req.body.proId : '';
    var arr_proname = req.body.proname ? req.body.proname :'';
    var arr_proNo = req.body.proNo ? req.body.proNo : '';
    var arr_count = req.body.count ? req.body.count : '';
    var arr_price = req.body.price ? req.body.price : '';

    // 处理数据
    var arr = new Array();

    if (arr_proId instanceof Array) {
        for (var i=0;i<arr_proId.length;i++) {
            var obj = {};
            obj.proId = arr_proId[i];
            obj.proName = arr_proname[i];
            obj.proSerial = arr_proNo[i];
            obj.count = arr_count[i];
            obj.price = arr_price[i];
            arr.push(obj);
        }
    } else {
        var obj = {};
        obj.proId = arr_proId;
        obj.proName = arr_proname;
        obj.proSerial = arr_proNo;
        obj.count = arr_count;
        obj.price = arr_price;
        arr.push(obj);
    }
    service.updateNursService(id,serviceMeetId,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
        bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
        milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
        diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
        isLeadTrainee,whetherAppointmentAgain,traineeName, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/nurs_service_list?replytype=update');
            } else {
                next();
            }
        });
    /*
    if(arr.length>0){
        var address="";var consignee="";var consigneeTel="";
        storeroomOutService.insertOutLog(oper,outType,new Date(),storeroom,remarks,address,consignee,consigneeTel,function(err, results) {

            if (!err) {

                var outLogId = results.insertId;
                storeroomOutService.insertOutLogMX(outLogId,arr,function (err, results) {

                    if (!err) {
                        //修改物资信息
                        storeroomOutService.updateInventory(storeroom,arr,function(err, results) {
                            if (!err) {
                                service.updateNursService(outLogId,id,serviceMeetId,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
                                    bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
                                    milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
                                    diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
                                    isLeadTrainee,whetherAppointmentAgain,traineeName, function (err, results) {
                                        if (!err) {
                                            res.redirect('/jinquan/nurs_service_list?replytype=update');
                                        } else {
                                            next();
                                        }
                                    });
                            } else {
                                storeroomOutService.delOutLog(outLogId);
                                storeroomOutService.delOutLogMX(outLogId);
                                next();
                            }
                        });
                    } else {
                        storeroomOutService.delOutLog(outLogId);
                        next();
                    }
                })
            } else {
                next();
            }
        });

    }
    else
    {
        var outLogId="";
        service.updateNursService(outLogId,id,serviceMeetId,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
            bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
            milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
            diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
            isLeadTrainee,whetherAppointmentAgain,traineeName, function (err, results) {
                if (!err) {
                    res.redirect('/jinquan/nurs_service_list?replytype=update');
                } else {
                    next();
                }
            });
    }
    */

}

/**
 * 删除 show方法 ，查看时进入编辑界面
 */


/**
 * 进入编辑页面
 * @param req
 * @param res
 * @param next
 */
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';
    var show = req.query.show ? req.query.show : '';
    var openWindow = req.query.openWindow ? req.query.openWindow : '';//通过弹出层打开

    service.fetchSingleNursService(id, function(err, results) {
        if (!err) {
            var nursService = results.nursService.length == 0 ? null : results.nursService[0];
            var outLogId =nursService.outLogId;
            var dictData = results;
            storeroomOutService.detail(outLogId,function(err, results) {
                if (!err) {
                    res.render('nursService/nursServiceEdit', {nursService : nursService,data : results,dictData : dictData,show:show,openWindow:openWindow});
                    /*
                    service.getnursserviceClassify(function (err, results1) {
                        if (!err) {
                            //res.render('nursService/nursServiceEdit', {nursService : nursService,data : results,data1 : results1});
                        } else {
                            next();
                        }
                    });
                    */
                } else {
                    next();
                }
            });
        } else {
            next();
        }
    })
}
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delNursService(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/nurs_service_list?replytype=del');
        } else {
            next();
        }
    });
}

/**
 * 生成护理服务单编号
 * @param req
 * @param res
 * @param next
 */
module.exports.createNo = function (req, res, next) {

    var shopId = req.session.user.shopId;

    //根据门店id获取下一个服务单编号信息
    service.createNursNo(shopId,function(err, results){
        if (!err) {
            res.json(JSON.stringify(results));
        } else {
            next();
        }
    });
}