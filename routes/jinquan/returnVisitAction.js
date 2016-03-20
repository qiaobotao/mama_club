var service = require('../../model/service/returnvisit');
var serviceMeetService = require('../../model/service/servicemeet');
module.exports.list = function (req, res) {
    //res.render('returnVisit/returnVisitList');

    var serviceMeetId = req.query.serviceMeetId ? req.query.serviceMeetId : '';
    var returnVisitDate = req.query.returnVisitDate ? req.query.returnVisitDate : '';
    var returnVisitType = req.query.returnVisitType ? req.query.returnVisitType : '';
    var currentPage = req.query.page ? req.query.page : 1;

    service.fetchAllReturnVisit(serviceMeetId,returnVisitDate,returnVisitType,currentPage, function (err, results) {
        if (!err) {
            results.serviceMeetId = serviceMeetId;
            results.returnVisitDate = returnVisitDate;
            results.returnVisitType = returnVisitType;
            res.render('returnVisit/returnVisitList', {data : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}

module.exports.goAdd = function (req, res) {
    res.render('returnVisit/returnVisitAdd');
}

module.exports.add = function (req, res) {
    var serviceMeetId = req.body.serviceMeetId ? req.body.serviceMeetId : '';
    var name = req.body.name ? req.body.name : '';
    var tel = req.body.tel ? req.body.tel : '';
    var returnVisitDate = req.body.returnVisitDate ? req.body.returnVisitDate : '';
    var returnVisitType = req.body.returnVisitType ? req.body.returnVisitType : '';
    var returnVisitResult = req.body.returnVisitResult ? req.body.returnVisitResult : '';
    var serviceComment = req.body.serviceComment ? req.body.serviceComment : '';
    var advice = req.body.advice ? req.body.advice : '';
    var isReturnVisit = req.body.isReturnVisit ? req.body.isReturnVisit : '';
    var returnVisitReason = req.body.returnVisitReason ? req.body.returnVisitReason : '';

    service.insertReturnVisit(serviceMeetId,name,tel,returnVisitDate,returnVisitType,returnVisitResult,serviceComment,advice,
        isReturnVisit,returnVisitReason, function (err, results) {
                if (!err) {
                    //修改服务单状态 4，已做回访
                    serviceMeetService.setStatus(serviceMeetId,4,function (err, results)
                        {
                            res.redirect('/jinquan/return_visit_list');
                        }
                    );
                } else {
                    next();
                }
        });

}


module.exports.doEdit = function (req, res) {
    var id = req.body.id ? req.body.id : '';
    var serviceMeetId = req.body.serviceMeetId ? req.body.serviceMeetId : '';
    var name = req.body.name ? req.body.name : '';
    var tel = req.body.tel ? req.body.tel : '';
    var returnVisitDate = req.body.returnVisitDate ? req.body.returnVisitDate : '';
    var returnVisitType = req.body.returnVisitType ? req.body.returnVisitType : '';
    var returnVisitResult = req.body.returnVisitResult ? req.body.returnVisitResult : '';
    var serviceComment = req.body.serviceComment ? req.body.serviceComment : '';
    var advice = req.body.advice ? req.body.advice : '';
    var isReturnVisit = req.body.isReturnVisit ? req.body.isReturnVisit : '';
    var returnVisitReason = req.body.returnVisitReason ? req.body.returnVisitReason : '';

    service.updateReturnVisit(id,serviceMeetId,name,tel,returnVisitDate,returnVisitType,returnVisitResult,serviceComment,advice,
        isReturnVisit,returnVisitReason, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/return_visit_list');
            } else {
                next();
            }
        });
}

module.exports.show = function(req, res, next) {
    var id = req.query.id ? req.query.id : '';

    service.fetchSingleReturnVisit(id, function(err, results) {
        if (!err) {
            var returnVisit = results.length == 0 ? null : results[0];
            res.render('returnVisit/returnVisitDetail', {returnVisit : returnVisit});
        } else {
            next();
        }
    })
}
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleReturnVisit(id, function(err, results) {
        if (!err) {
            var returnVisit = results.length == 0 ? null : results[0];
            res.render('returnVisit/returnVisitEdit', {returnVisit : returnVisit});
        } else {
            next();
        }
    })
}
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delReturnVisit(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/return_visit_list');
        } else {
            next();
        }
    });

}
/**
 * 获取预约服务列表
 * @param req
 * @param res
 */
module.exports.select = function (req, res,next) {
    var tel = req.query.phone ? req.query.phone : '';
    var name = req.query.name ? req.query.name : '';
    var meetTime = req.query.meetTime ? req.query.meetTime : '';
    var currentPage = req.query.page ? req.query.page : 1;
    serviceMeetService.getByStatuServiceMeet(tel,name,meetTime,3,currentPage, function (err, results) {
        if (!err) {
            results.phone = tel;
            results.name = name;
            results.meetTime = meetTime;
            res.render('returnVisit/serviceMeetSelect', {data : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}