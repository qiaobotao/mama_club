var service = require('../../model/service/nursservice');
var storeroomOutService = require('../../model/service/storeroomOut');
var serviceMeetService = require('../../model/service/serviceMeet');

/**
 * Created by kuanchang on 16/1/18.
 */
/**
 * 获取护理服务列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    //res.render('nursService/nursServiceList');

    var name = req.query.name ? req.query.name : '';
    var principal = req.query.principal ? req.query.principal : '';
    var serviceDate = req.query.serviceDate ? req.query.serviceDate : '';
    var currentPage = req.query.page ? req.query.page : 1;

    service.fetchAllNursService(name,principal,serviceDate,currentPage, function (err, results) {
        if (!err) {
            results.name = name;
            results.principal = principal;
            results.serviceDate = serviceDate;
            res.render('nursService/nursServiceList', {data : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}

/**
 * 增加会员
 * @param req
 * @param res
 */
module.exports.goAdd = function (req, res) {
    //查询页面需要展示的数据库字典表
    //诊断结果
    service.getnursserviceClassify(function (err, results) {
        if (!err) {
            res.render('nursService/nursServiceAdd', {data : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
    //宝宝原因
    //妈妈原因
    //其他原因
}

module.exports.add = function (req, res) {
    var serviceMeetId = req.body.serviceMeetId ? req.body.serviceMeetId : '';
    var serviceDate = req.body.serviceDate ? req.body.serviceDate : '';
    var name = req.body.name ? req.body.name : '';
    var tel = req.body.tel ? req.body.tel : '';
    var startTime = req.body.startTime ? req.body.startTime : '';
    var endTime = req.body.endTime ? req.body.endTime : '';
    var serviceType = req.body.serviceType ? req.body.serviceType : '';
    var address = req.body.address ? req.body.address : '';
    var serviceNeeds = req.body.serviceNeeds ? req.body.serviceNeeds : '';
    var bowelFrequenc = req.body.bowelFrequenc ? req.body.bowelFrequenc : '';
    var deal = req.body.deal ? req.body.deal : '';
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
    var breastpumpBrand = req.body.breastpumpBrand ? req.body.breastpumpBrand : '';
    var isCarefulNurse = req.body.isCarefulNurse ? req.body.isCarefulNurse : '';
    var referralAdvise = req.body.referralAdvise ? req.body.referralAdvise : '';
    var diagnosisTemp = req.body.diagnosis ? req.body.diagnosis : '';
    var diagnosis="" ;
    for(var i=0;i<diagnosisTemp.length;i++){
        diagnosis+=diagnosisTemp[i]+",";
    }
    diagnosis= diagnosis.substr(0,diagnosis.length-1);
    var specialInstructions = req.body.specialInstructions ? req.body.specialInstructions : '';
    var childReasonTemp = req.body.childReason ? req.body.childReason : '';
    var childReason ="" ;
    for(var i=0;i<childReasonTemp.length;i++){
        childReason+=childReasonTemp[i]+",";
    }
    childReason= childReason.substr(0,childReason.length-1);
    var breastExplain = req.body.breastExplain ? req.body.breastExplain : '';
    var motherReasonTemp = req.body.motherReason ? req.body.motherReason : '';
    var motherReason ="" ;
    for(var i=0;i<motherReasonTemp.length;i++){
        motherReason+=motherReasonTemp[i]+",";
    }
    motherReason= motherReason.substr(0,motherReason.length-1);
    var leaveAdvise = req.body.leaveAdvise ? req.body.leaveAdvise : '';
    var otherReasonTemp = req.body.otherReason ? req.body.otherReason : '';
    var otherReason="" ;
    for(var i=0;i<otherReasonTemp.length;i++){
        otherReason+=otherReasonTemp[i]+",";
    }
    otherReason= otherReason.substr(0,otherReason.length-1);
    var isLeadTrainee = req.body.isLeadTrainee ? req.body.isLeadTrainee : '';
    var whetherAppointmentAgain = req.body.whetherAppointmentAgain ? req.body.whetherAppointmentAgain : '';
    var traineeName = req.body.traineeName ? req.body.traineeName : '';

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
    //生成出库单信息
    if(arr.length>0){
        storeroomOutService.insertOutLog(oper,outType,new Date(),storeroom,remarks,function(err, results) {

            if (!err) {

                var outLogId = results.insertId;
                storeroomOutService.insertOutLogMX(outLogId,arr,function (err, results) {

                    if (!err) {
                        //修改物资信息
                        storeroomOutService.updateInventory(storeroom,arr,function(err, results) {
                            if (!err) {
                                //生成护理信息
                                service.insertNursService(outLogId,serviceMeetId,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
                                    bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
                                    milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
                                    diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
                                    isLeadTrainee,whetherAppointmentAgain,traineeName, function (err, results) {
                                        if (!err) {
                                            //修改服务单状态 2，如约
                                            serviceMeetService.setStatus(serviceMeetId,2,function (err, results)
                                                {
                                                    res.redirect('/jinquan/nurs_service_list');
                                                }
                                            );
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
    else{
        var outLogId="";
        service.insertNursService(outLogId,serviceMeetId,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
            bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
            milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
            diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
            isLeadTrainee,whetherAppointmentAgain,traineeName, function (err, results) {
                if (!err) {
                    //修改服务单状态 2，如约
                    serviceMeetService.setStatus(serviceMeetId,2,function (err, results)
                        {
                            res.redirect('/jinquan/nurs_service_list');
                        }
                    );
                } else {
                    next();
                }
            });
    }


}


module.exports.doEdit = function (req, res) {
    var id = req.body.id ? req.body.id : '';
    var serviceMeetId = req.body.serviceMeetId ? req.body.serviceMeetId : '';
    var serviceDate = req.body.serviceDate ? req.body.serviceDate : '';
    var name = req.body.name ? req.body.name : '';
    var tel = req.body.tel ? req.body.tel : '';
    var startTime = req.body.startTime ? req.body.startTime : '';
    var endTime = req.body.endTime ? req.body.endTime : '';
    var serviceType = req.body.serviceType ? req.body.serviceType : '';
    var address = req.body.address ? req.body.address : '';
    var serviceNeeds = req.body.serviceNeeds ? req.body.serviceNeeds : '';
    var bowelFrequenc = req.body.bowelFrequenc ? req.body.bowelFrequenc : '';
    var deal = req.body.deal ? req.body.deal : '';
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
    var breastpumpBrand = req.body.breastpumpBrand ? req.body.breastpumpBrand : '';
    var isCarefulNurse = req.body.isCarefulNurse ? req.body.isCarefulNurse : '';
    var referralAdvise = req.body.referralAdvise ? req.body.referralAdvise : '';
    var diagnosisTemp = req.body.diagnosis ? req.body.diagnosis : '';
    var diagnosis ="" ;
    for(var i=0;i<diagnosisTemp.length;i++){
        diagnosis+=diagnosisTemp[i]+",";
    }
    diagnosis= diagnosis.substr(0,diagnosis.length-1);
    var specialInstructions = req.body.specialInstructions ? req.body.specialInstructions : '';
    var childReasonTemp = req.body.childReason ? req.body.childReason : '';
    var childReason ="" ;
    for(var i=0;i<childReasonTemp.length;i++){
        childReason+=childReasonTemp[i]+",";
    }
    childReason= childReason.substr(0,childReason.length-1);
    var breastExplain = req.body.breastExplain ? req.body.breastExplain : '';
    var motherReasonTemp = req.body.motherReason ? req.body.motherReason : '';
    var motherReason ="" ;
    for(var i=0;i<motherReasonTemp.length;i++){
        motherReason+=motherReasonTemp[i]+",";
    }
    motherReason= motherReason.substr(0,motherReason.length-1);
    var leaveAdvise = req.body.leaveAdvise ? req.body.leaveAdvise : '';
    var otherReasonTemp = req.body.otherReason ? req.body.otherReason : '';
    var otherReason ="" ;
    for(var i=0;i<otherReasonTemp.length;i++){
        otherReason+=otherReasonTemp[i]+",";
    }
    otherReason= otherReason.substr(0,otherReason.length-1);
    var isLeadTrainee = req.body.isLeadTrainee ? req.body.isLeadTrainee : '';
    var whetherAppointmentAgain = req.body.whetherAppointmentAgain ? req.body.whetherAppointmentAgain : '';
    var traineeName = req.body.traineeName ? req.body.traineeName : '';
    var outLogId= req.body.outLogId ? req.body.outLogId : '';

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
    if(outLogId!="")
    {
        storeroomOutService.delOutLog(outLogId);
        storeroomOutService.delOutLogMX(outLogId);
    }
    if(arr.length>0){
        storeroomOutService.insertOutLog(oper,outType,new Date(),storeroom,remarks,function(err, results) {

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
                                            res.redirect('/jinquan/nurs_service_list');
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
                    res.redirect('/jinquan/nurs_service_list');
                } else {
                    next();
                }
            });
    }

}

module.exports.show = function(req, res, next) {
    var id = req.query.id ? req.query.id : '';

    service.fetchSingleNursService(id, function(err, results) {
        if (!err) {

            var nursService = results.length == 0 ? null : results[0];
            var outLogId =nursService.outLogId;
            storeroomOutService.detail(outLogId,function(err, results1) {

                if (!err) {
                    service.getnursserviceClassify(function (err, results2) {
                        if (!err) {
                            res.render('nursService/nursServiceDetail', {nursService : nursService,data : results1,data1 : results2});
                        } else {
                            console.log(err.message);
                            next()
                        }
                    });
                } else {
                    next();
                }
            });

        } else {
            next();
        }
    })
}
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleNursService(id, function(err, results) {
        if (!err) {
            var nursService = results.length == 0 ? null : results[0];
            var outLogId =nursService.outLogId;
            storeroomOutService.detail(outLogId,function(err, results) {
                if (!err) {
                    service.getnursserviceClassify(function (err, results1) {
                        if (!err) {
                            res.render('nursService/nursServiceEdit', {nursService : nursService,data : results,data1 : results1});
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
    })
}
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delNursService(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/nurs_service_list');
        } else {
            next();
        }
    });

}