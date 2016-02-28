var service = require('../../model/service/servicemeet');
/**
 * Created by kuanchang on 16/1/17.
 */
/**
 * 获取预约服务列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res,next) {
    var tel = req.query.phone ? req.query.phone : '';
    var name = req.query.name ? req.query.name : '';
    var meetTime = req.query.meetTime ? req.query.meetTime : '';
    var status = req.query.status ? req.query.status : '';
    var currentPage = req.query.page ? req.query.page : 1;

    service.fetchAllServiceMeet(tel,name,meetTime,status,currentPage, function (err, results) {
        if (!err) {
            results.tel = tel;
            results.name = name;
            results.meetTime = meetTime;
            results.status = status;
            res.render('serviceMeet/serviceMeetList', {data : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}

/**
 * 增加预约服务
 * @param req
 * @param res
 */
module.exports.goAdd = function (req, res,next) {

    res.render('serviceMeet/serviceMeetAdd');
}

module.exports.add = function (req, res) {
    var tel = req.body.tel ? req.body.tel : '';
    var name = req.body.name ? req.body.name : '';
    var age = req.body.age ? req.body.age : '';
    var principal = req.body.principal ? req.body.principal : '';
    var meetTime = req.body.meetTime ? req.body.meetTime : '';
    var problemDescription = req.body.problemDescription ? req.body.problemDescription : '';
    var serviceType = req.body.serviceType ? req.body.serviceType : '';
    var address = req.body.address ? req.body.address : '';
    var price = req.body.price ? req.body.price : '';

    service.insertServiceMeet(tel,name,age,principal,meetTime,problemDescription,serviceType,address,price, function (err, results) {
        if (!err) {
            res.redirect('/jinquan/service_meet_list');
        } else {
            next();
        }
    });
}


module.exports.doEdit = function (req, res,next) {
    var id = req.body.id ? req.body.id : '';
    var tel = req.body.tel ? req.body.tel : '';
    var name = req.body.name ? req.body.name : '';
    var age = req.body.age ? req.body.age : '';
    var principal = req.body.principal ? req.body.principal : '';
    var meetTime = req.body.meetTime ? req.body.meetTime : '';
    var problemDescription = req.body.problemDescription ? req.body.problemDescription : '';
    var serviceType = req.body.serviceType ? req.body.serviceType : '';
    var address = req.body.address ? req.body.address : '';
    var price = req.body.price ? req.body.price : '';

    service.updateServiceMeet(id,tel,name,age,principal,meetTime,problemDescription,serviceType,address,price, function (err, results) {
        if (!err) {
            res.redirect('/jinquan/service_meet_list');
        } else {
            next();
        }
    });
}

module.exports.show = function(req, res, next) {
    var id = req.query.id ? req.query.id : '';
    service.fetchSingleServiceMeet(id, function(err, results) {
        if (!err) {
            var service_meet = results.length == 0 ? null : results[0];
            res.render('servicemeet/serviceMeetDetail', {service_meet : service_meet});
        } else {
            next();
        }
    })
}
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleServiceMeet(id, function(err, results) {
        if (!err) {
            var service_meet = results.length == 0 ? null : results[0];
            res.render('servicemeet/serviceMeetEdit', {service_meet : service_meet});
        } else {
            next();
        }
    })
}
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delServiceMeet(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/service_meet_list');
        } else {
            next();
        }
    });

}