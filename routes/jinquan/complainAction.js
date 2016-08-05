/**
 * Created by kuanchang on 16/1/18.
 */

/**
 * 获取投诉列表
 * @param req
 * @param res
 */

var laypage = require('laypage');
var service = require('../../model/service/complain');
var serviceMeetService = require('../../model/service/servicemeet');
module.exports.list = function (req, res,next) {
// 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var complainType = req.query.complainType ? req.query.complainType : '';//投诉类型
    var complainTimeStart = req.query.complainTimeStart ? req.query.complainTimeStart : '';//投诉开始时间
    var complainTimeEnd = req.query.complainTimeEnd ? req.query.complainTimeEnd : '';//投诉截止时间
    var currentPage = req.query.page ? req.query.page : 1;
    currentPage =currentPage<1?1:currentPage;
  // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;
    service.fetchAllComplain(shopId,complainType,complainTimeStart,complainTimeEnd,currentPage, function (err, results) {
        if (!err) {
            results.complainTimeStart = complainTimeStart;
            results.complainTimeEnd = complainTimeEnd;
            results.complainType = complainType;
            results.currentPage = currentPage;
            res.render('complain/complainList', {data : results, replytype : replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
            });
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}

//保存——添加投诉单
module.exports.save = function (req, res, next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var complainId = req.body.complainId ? req.body.complainId : '';//投诉单id
    var nursServiceId = req.body.nursServiceId ? req.body.nursServiceId : '';//服务单id
    var complainStaffId = req.body.complainPrincipal ? req.body.complainPrincipal : '';//投诉技师id
    var complainType = req.body.complainType ? req.body.complainType : '';//投诉类型
    var solveStaffId = req.body.staffId ? req.body.staffId : '';//解决技师id
    var complainDetail = req.body.complainDetail ? req.body.complainDetail : '';//投诉详情
    if(complainId == ''){
        service.insertComplain(shopId,nursServiceId,complainStaffId,complainType,solveStaffId,complainDetail, function (err, results) {
            if (!err) {
                if (!err) {
                    res.redirect('/jinquan/complain_list?replytype=add');
                } else {
                    next();
                }
            } else {
                next();
            }
        });
    }else{
        service.updateComplain(complainId,complainType,complainDetail, function (err, results) {
            if (!err) {
                if (!err) {
                    res.redirect('/jinquan/complain_list?replytype=update');
                } else {
                    next();
                }
            } else {
                next();
            }
        });
    }

}
/**
 * 进入编辑界面（新增、修改）
 * @param req
 * @param res
 * @param next
 */
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';
    var show = req.query.show ? req.query.show : '';

    service.fetchSingleComplain(id, function(err, results) {
        if (!err) {
            var complain = results.length == 0 ? {} : results[0];
            res.render('complain/complainEdit', {complain : complain,show:show});
        } else {
            next();
        }
    })
}
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delComplaint(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/complain_list?replytype=del');
        } else {
            next();
        }
    });

}
module.exports.select = function (req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var tel = req.query.phone ? req.query.phone : '';
    var name = req.query.name ? req.query.name : '';
    var meetTime = req.query.meetTime ? req.query.meetTime : '';
    var currentPage = req.query.page ? req.query.page : 1;
    currentPage =currentPage<1?1:currentPage;

    serviceMeetService.getByStatuServiceMeet(shopId,tel,name,meetTime,1,currentPage, function (err, results) {
        if (!err) {
            results.phone = tel;
            results.name = name;
            results.meetTime = meetTime;
            results.currentPage = currentPage;
            res.render('complain/serviceMeetSelect', {data : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}