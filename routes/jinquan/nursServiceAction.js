var service = require('../../model/service/nursservice');
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
    res.render('nursService/nursServiceAdd');
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
    var diagnosis = req.body.diagnosis ? req.body.diagnosis : '';
    var specialInstructions = req.body.specialInstructions ? req.body.specialInstructions : '';
    var childReason = req.body.childReason ? req.body.childReason : '';
    var breastExplain = req.body.breastExplain ? req.body.breastExplain : '';
    var motherReason = req.body.motherReason ? req.body.motherReason : '';
    var leaveAdvise = req.body.leaveAdvise ? req.body.leaveAdvise : '';
    var otherReason = req.body.otherReason ? req.body.otherReason : '';
    var isLeadTrainee = req.body.isLeadTrainee ? req.body.isLeadTrainee : '';
    var whetherAppointmentAgain = req.body.whetherAppointmentAgain ? req.body.whetherAppointmentAgain : '';
    var traineeName = req.body.traineeName ? req.body.traineeName : '';

    service.insertNursService(serviceMeetId,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
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
    var diagnosis = req.body.diagnosis ? req.body.diagnosis : '';
    var specialInstructions = req.body.specialInstructions ? req.body.specialInstructions : '';
    var childReason = req.body.childReason ? req.body.childReason : '';
    var breastExplain = req.body.breastExplain ? req.body.breastExplain : '';
    var motherReason = req.body.motherReason ? req.body.motherReason : '';
    var leaveAdvise = req.body.leaveAdvise ? req.body.leaveAdvise : '';
    var otherReason = req.body.otherReason ? req.body.otherReason : '';
    var isLeadTrainee = req.body.isLeadTrainee ? req.body.isLeadTrainee : '';
    var whetherAppointmentAgain = req.body.whetherAppointmentAgain ? req.body.whetherAppointmentAgain : '';
    var traineeName = req.body.traineeName ? req.body.traineeName : '';

    service.updateNursService(id,serviceMeetId,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
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

module.exports.show = function(req, res, next) {
    var id = req.query.id ? req.query.id : '';

    service.fetchSingleNursService(id, function(err, results) {
        if (!err) {
            var nursService = results.length == 0 ? null : results[0];
            res.render('nursService/nursServiceDetail', {nursService : nursService});
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
            res.render('nursService/nursServiceEdit', {nursService : nursService});
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