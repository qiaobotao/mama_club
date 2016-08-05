
var laypage = require('laypage');
var service = require('../../model/service/nursservice');
var storeroomOutService = require('../../model/service/storeroomOut');
var serviceMeetService = require('../../model/service/servicemeet');
var commonUtil = require('../../model/utils/common');//公共类
var multiparty = require('multiparty');//上传文件使用
var consts = require('../../model/utils/consts');

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
/**
 * 获取护理服务列表，用于选择某条服务单(如投诉单中选择护理服务单)
 * @param req
 * @param res
 */
module.exports.select = function (req, res,next) {
    var shopId = req.session.user.shopId;
    var name = req.query.name ? req.query.name : '';
    var principal = req.query.principal ? req.query.principal : '';
    var serviceDate = req.query.serviceDate ? req.query.serviceDate : '';
    var currentPage = req.query.page ? req.query.page : 1;
    currentPage =currentPage<1?1:currentPage;
// 接收操作参数
    var url = '/jinquan'+req.url;
    //根据状态查询符合条件的的护理服务单
    service.fetchNursByStatue_1(shopId,name,principal,serviceDate,currentPage, function (err, results) {
        if (!err) {
            results.name = name;
            results.principal = principal;
            results.serviceDate = serviceDate;
            results.currentPage = currentPage;
            res.render('nursService/nursServiceSelectList', {data : results,laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages})
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
    //var breastExplain = req.body.breastExplain ? req.body.breastExplain : '';
    var leaveAdvise = req.body.leaveAdvise ? req.body.leaveAdvise : '';
    var isLeadTrainee = req.body.isLeadTrainee ? req.body.isLeadTrainee : '';
    var whetherAppointmentAgain = req.body.whetherAppointmentAgain ? req.body.whetherAppointmentAgain : '';
    var traineeName = req.body.traineeName ? req.body.traineeName : '';
    var noNeedVisit = req.body.noNeedVisit ? req.body.noNeedVisit : '';//不必回访
    var evaluateTemp = req.body.evaluate ? req.body.evaluate : '';//服务评价
    var evaluate = commonUtil.array2Str(evaluateTemp,",");
    var proposal = req.body.proposal ? req.body.proposal : '';//建议信息

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
    var state = consts.NURS_STATE_3;
    if(noNeedVisit == 'Y'){
        state = consts.NURS_STATE_5;
    }
    service.updateNursService(id,serviceMeetId,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
        bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
        milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
        diagnosis,specialInstructions,childReason,motherReason,leaveAdvise,otherReason,
        isLeadTrainee,whetherAppointmentAgain,traineeName,noNeedVisit,evaluate,proposal,state, function (err, results) {
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
            var serviceArr = results.moneyManageServicesData.length > 0 ? results.moneyManageServicesData:{};//收费单（服务子表）单独处理
            var proArr = results.moneyManageWaresData.length > 0 ? results.moneyManageWaresData:{};//收费单（商品子表）单独处理
            storeroomOutService.detail(outLogId,function(err, results) {
                if (!err) {
                    res.render('nursService/nursServiceEdit', {
                        nursService : nursService,
                        data : results,
                        dictData : dictData,
                        show:show,
                        openWindow:openWindow,
                        serviceArr:serviceArr,
                        proArr:proArr
                    });
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
    var createNoByShopId = req.query.createNoByShopId ? req.query.createNoByShopId :shopId;

    //根据门店id获取下一个服务单编号信息
    service.createNursNo(createNoByShopId,function(err, results){
        if (!err) {
            res.json(JSON.stringify(results));
        } else {
            next();
        }
    });
}
/**
 * 根据护理服务单id获取参与服务的技师人员信息
 * @param req
 * @param res
 * @param next
 */
module.exports.getPrincipalsByServiceId = function (req, res, next) {

    var serviceId = req.body.serviceId?req.body.serviceId:'';//护理服务单id

    //根据门店id获取下一个服务单编号信息
    service.getPrincipalsServiceById(serviceId,function(err, results){
        if (!err) {
            res.json(JSON.stringify(results));
        } else {
            next();
        }
    });
}
/**
 * 打开上传乳房图片页面
 * @param req
 * @param res
 * @param next
 */
module.exports.openUploadBreastImage = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';//服务单id
    res.render('nursService/uploadBreastImage', {id : id});
}
/**
 * 保存上传乳房图片页面
 * @param req
 * @param res
 * @param next
 */
module.exports.saveUploadBreastImage = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';//护理服务单id

    var form = new multiparty.Form({uploadDir: './public/files/breastImage/'});//将突破上传到”./public/files/staffQualifications“目录下

    form.parse(req, function(err, fields, files) {
        if (!err) {
            if(files.recordfile.length > 0){
                var inputFile = files.recordfile[0];
                var breastImageSrc = inputFile.path.substr(inputFile.path.indexOf('/'),inputFile.path.length);
                var breastImage = inputFile.originalFilename+";"+inputFile.path.substr(inputFile.path.indexOf('/'),inputFile.path.length);
                service.updateBreastImage(id,breastImage,function(err, results) {
                    if(!err) {
                        res.render('welcome/successByUpLoadBreasImage',{breastImageSrc:breastImageSrc});
                    } else {
                        console.log(err.message);
                        res.render('error');
                    }
                })
            }
        } else {
            console.log('parse error: ' + err);
            next();
        }
    });
}