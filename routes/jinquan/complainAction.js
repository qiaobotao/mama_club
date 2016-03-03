/**
 * Created by kuanchang on 16/1/18.
 */

/**
 * 获取投诉列表
 * @param req
 * @param res
 */

var service = require('../../model/service/complain');

module.exports.list = function (req, res) {
   // res.render('complain/complainList');

    var name = req.query.name ? req.query.name : '';
    var complainPrincipal = req.query.complainPrincipal ? req.query.complainPrincipal : '';
    var complainTimeStart = req.query.complainTimeStart ? req.query.complainTimeStart : '';
    var complainTimeEnd = req.query.complainTimeEnd ? req.query.complainTimeEnd : '';
    var dealPrincipal = req.query.dealPrincipal ? req.query.dealPrincipal : '';
    var currentPage = req.query.page ? req.query.page : 1;

    service.fetchAllComplain(name,complainPrincipal,complainTimeStart,complainTimeEnd,dealPrincipal,currentPage, function (err, results) {
        if (!err) {
            results.name = name;
            results.complainPrincipal = complainPrincipal;
            results.complainTimeStart = complainTimeStart;
            results.complainTimeEnd = complainTimeEnd;
            results.dealPrincipal = dealPrincipal;
            res.render('complain/complainList', {data : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}
/**
 * 增加投诉
 * @param req
 * @param res
 */
module.exports.goAdd = function (req, res) {
    res.render('complain/complainAdd');
}


module.exports.add = function (req, res, next) {
    var serviceMeetId = req.body.serviceMeetId ? req.body.serviceMeetId : '';
    var name = req.body.name ? req.body.name : '';
    var tel = req.body.tel ? req.body.tel : '';
    var complainPrincipal = req.body.complainPrincipal ? req.body.complainPrincipal : '';
    var complainType = req.body.complainType ? req.body.complainType : '';
    var dealPrincipal = req.body.dealPrincipal ? req.body.dealPrincipal : '';
    var complainDetail = req.body.complainDetail ? req.body.complainDetail : '';

    service.insertComplain(serviceMeetId,name,tel,complainPrincipal,complainType,dealPrincipal,complainDetail, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/complain_list');
            } else {
                next();
            }
        });

}


module.exports.doEdit = function (req, res, next) {
    var id = req.body.id ? req.body.id : '';
    var serviceMeetId = req.body.serviceMeetId ? req.body.serviceMeetId : '';
    var name = req.body.name ? req.body.name : '';
    var tel = req.body.tel ? req.body.tel : '';
    var complainPrincipal = req.body.complainPrincipal ? req.body.complainPrincipal : '';
    var complainType = req.body.complainType ? req.body.complainType : '';
    var dealPrincipal = req.body.dealPrincipal ? req.body.dealPrincipal : '';
    var complainDetail = req.body.complainDetail ? req.body.complainDetail : '';

    service.updateComplain(id,serviceMeetId,name,tel,complainPrincipal,complainType,dealPrincipal,complainDetail, function (err, results) {
        if (!err) {
            res.redirect('/jinquan/complain_list');
        } else {
            next();
        }
    });
}

module.exports.show = function(req, res, next) {
    var id = req.query.id ? req.query.id : '';

    service.fetchSingleComplain(id, function(err, results) {
        if (!err) {
            var complain = results.length == 0 ? null : results[0];
            res.render('complain/complainDetail', {complain : complain});
        } else {
            next();
        }
    })
}
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleComplain(id, function(err, results) {
        if (!err) {
            var complain = results.length == 0 ? null : results[0];
            res.render('complain/complainEdit', {complain : complain});
        } else {
            next();
        }
    })
}
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delComplaint(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/complain_list');
        } else {
            next();
        }
    });

}