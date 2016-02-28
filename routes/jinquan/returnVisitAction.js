var service = require('../../model/service/returnvisit');
module.exports.list = function (req, res) {
    //res.render('returnVisit/returnVisitList');

    var serialNumber = req.query.serialNumber ? req.query.serialNumber : '';
    var returnVisitDate = req.query.returnVisitDate ? req.query.returnVisitDate : '';
    var returnVisitType = req.query.returnVisitType ? req.query.returnVisitType : '';
    var currentPage = req.query.page ? req.query.page : 1;

    service.fetchAllReturnVisit(serialNumber,returnVisitDate,returnVisitType,currentPage, function (err, results) {
        if (!err) {
            results.serialNumber = serialNumber;
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
    var serialNumber = req.body.serialNumber ? req.body.serialNumber : '';
    var name = req.body.name ? req.body.name : '';
    var tel = req.body.tel ? req.body.tel : '';
    var returnVisitDate = req.body.returnVisitDate ? req.body.returnVisitDate : '';
    var returnVisitType = req.body.returnVisitType ? req.body.returnVisitType : '';
    var returnVisitResult = req.body.returnVisitResult ? req.body.returnVisitResult : '';
    var serviceComment = req.body.serviceComment ? req.body.serviceComment : '';
    var advice = req.body.advice ? req.body.advice : '';
    var isReturnVisit = req.body.isReturnVisit ? req.body.isReturnVisit : '';
    var returnVisitReason = req.body.returnVisitReason ? req.body.returnVisitReason : '';

    service.insertReturnVisit(serialNumber,name,tel,returnVisitDate,returnVisitType,returnVisitResult,serviceComment,advice,
        isReturnVisit,returnVisitReason, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/return_visit_list');
            } else {
                next();
            }
        });

}


module.exports.doEdit = function (req, res) {
    var id = req.body.id ? req.body.id : '';
    var serialNumber = req.body.serialNumber ? req.body.serialNumber : '';
    var name = req.body.name ? req.body.name : '';
    var tel = req.body.tel ? req.body.tel : '';
    var returnVisitDate = req.body.returnVisitDate ? req.body.returnVisitDate : '';
    var returnVisitType = req.body.returnVisitType ? req.body.returnVisitType : '';
    var returnVisitResult = req.body.returnVisitResult ? req.body.returnVisitResult : '';
    var serviceComment = req.body.serviceComment ? req.body.serviceComment : '';
    var advice = req.body.advice ? req.body.advice : '';
    var isReturnVisit = req.body.isReturnVisit ? req.body.isReturnVisit : '';
    var returnVisitReason = req.body.returnVisitReason ? req.body.returnVisitReason : '';

    service.updateReturnVisit(id,serialNumber,name,tel,returnVisitDate,returnVisitType,returnVisitResult,serviceComment,advice,
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