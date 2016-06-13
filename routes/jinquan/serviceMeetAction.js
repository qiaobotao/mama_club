
var laypage = require('laypage');
var service = require('../../model/service/servicemeet');
var memberService = require('../../model/service/member');

//预约服务单
var servicemeet = require('../../model/service/servicemeet');
//护理服务
var nursservice = require('../../model/service/nursservice');
//投诉
var complain = require('../../model/service/complain');
//公用数据
var consts = require('../../model/utils/consts');
/**
 * Created by kuanchang on 16/1/17.
 */
/**
 * 获取预约服务列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var tel = req.query.phone ? req.query.phone : '';
    var name = req.query.name ? req.query.name : '';
    var meetTime = req.query.meetTime ? req.query.meetTime : '';
    var status = req.query.status ? req.query.status : '';
    if('-1'==status)
    {
        status='';
    }
    var currentPage = req.query.page ? req.query.page : 1;
    currentPage =currentPage<1?1:currentPage;
// 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;
    service.fetchAllServiceMeet(shopId,tel,name,meetTime,status,currentPage, function (err, results) {
        if (!err) {
            results.phone = tel;
            results.name = name;
            results.meetTime = meetTime;
            results.status = status;
            results.currentPage = currentPage;
            res.render('serviceMeet/serviceMeetList', {data : results, replytype : replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
            });
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
/*
module.exports.goAdd = function (req, res,next) {

    res.render('serviceMeet/serviceMeetAdd');
}
*/

module.exports.add = function (req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var tel = req.body.tel ? req.body.tel : '';
    var name = req.body.name ? req.body.name : '';
    var memberId = req.body.memberId ? req.body.memberId : '';
    var age = req.body.age ? req.body.age : '';
    var principal = req.body.principal ? req.body.principal : '';
    var meetTime = req.body.meetTime ? req.body.meetTime : '';
    var problemDescription = req.body.problemDescription ? req.body.problemDescription : '';
    var serviceType = req.body.serviceType ? req.body.serviceType : '';
    var address = req.body.address ? req.body.address : '';
    var price = req.body.price ? req.body.price : '';
    var serviceId = req.body.serviceId ? req.body.serviceId : '';
    var staffId = req.body.staffId ? req.body.staffId : '';
    var specified = req.body.specified ? req.body.specified : '';

    service.insertServiceMeet(shopId,specified,staffId,tel,name,age,principal,meetTime,problemDescription,serviceType,address,price,memberId,serviceId, function (err, results) {
        if (!err) {
            res.redirect('/jinquan/service_meet_list?replytype=add');
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
    var memberId = req.body.memberId ? req.body.memberId : '';
    var serviceId = req.body.serviceId ? req.body.serviceId : '';

    var staffId = req.body.staffId ? req.body.staffId : '';

    var specified = req.body.specified ? req.body.specified : '';
    service.updateServiceMeet(specified,staffId,id,tel,name,age,principal,meetTime,problemDescription,serviceType,address,price,memberId,serviceId, function (err, results) {
        if (!err) {
            res.redirect('/jinquan/service_meet_list?replytype=update');
        } else {
            next();
        }
    });
}

module.exports.show = function(req, res, next) {
    var id = req.query.id ? req.query.id : '';
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    service.fetchSingleServiceMeet(id, function(err, results) {
        if (!err) {
            var service_meet = results.length == 0 ? null : results[0];
            var tel =service_meet.tel;
            var result={};
            memberService.getMemberByNameTel( tel ,shopId,function(err, results) {
                if (!err) {
                    var member = results.length == 0 ? null : results[0];
                    if(member!=null)
                    {
                        result.member=member;
                        //预约服务单
                        servicemeet.getTop3ServiceMeet(member.id,tel,function(err, services) {
                            result.serviceMeets=services;

                            var serviceMeetIds="";
                            for(var i=0;i<services.length;i++)
                            {
                                serviceMeetIds+="'"+services[i].id+"',";
                            }
                            serviceMeetIds= serviceMeetIds.substr(0,serviceMeetIds.length-1);
                            //护理服务
                            nursservice.getTop3NursService(serviceMeetIds,function(err, nursServices) {
                                result.nursServices=nursServices;
                                complain.getTop3Complain(serviceMeetIds,function(err, complains) {
                                    result.complains=complains;
                                    var datas = JSON.stringify(result);
                                    res.render('servicemeet/serviceMeetDetail', {service_meet : service_meet,datas:datas});
                                });
                            })
                        });
                    }
                    else{
                        res.render('servicemeet/serviceMeetDetail', {service_meet : service_meet,datas:null});

                    }
                }else{
                    next();
                }
            })
        } else {
            next();
        }
    })
}
module.exports.preEdit = function(req, res, next) {
    var shopId = req.session.user.shopId;
    var id = req.query.id ? req.query.id : '';
    var userId = req.session.user.id;//用户id

    service.fetchSingleServiceMeet(userId,id, function(err, results) {
        if (!err) {
            var service_meet = results.serviceMeetService.length == 0 ? {} : results.serviceMeetService[0];
            var memberName =service_meet.name;
            var tel =service_meet.tel;
            var treatmentMethodArr = results.treatmentMethodArr;
            var serverDemandArr = results.serverDemandArr;
            var shopArr = results.shopsByUserIdData;
            var result={};
            memberService.getMemberByNameTel(tel ,shopId ,function(err, results) {
                if (!err) {
                    var member = results.length == 0 ? null : results[0];
                    member == null ? {} : member;
                    if(1==1){
                        res.render('servicemeet/serviceMeetEdit', {
                            service_meet : service_meet,
                            datas:{},
                            treatmentMethodArr:treatmentMethodArr,
                            serverDemandArr:serverDemandArr,
                            shopArr:shopArr,
                            areaNames:consts.AREA_NAMES,
                            areaCodes:consts.AREA_CODES});
                    }else{

                        result.member=member;
                        //预约服务单
                        servicemeet.getTop3ServiceMeet(member.id,tel,function(err, services) {
                            result.serviceMeets=services;

                            var serviceMeetIds="";
                            for(var i=0;i<services.length;i++)
                            {
                                serviceMeetIds+="'"+services[i].id+"',";
                            }
                            serviceMeetIds= serviceMeetIds.substr(0,serviceMeetIds.length-1);
                            //护理服务
                            nursservice.getTop3NursService(serviceMeetIds,function(err, nursServices) {
                                result.nursServices=nursServices;
                                complain.getTop3Complain(serviceMeetIds,function(err, complains) {
                                    result.complains=complains;
                                    var datas = JSON.stringify(result);
                                    res.render('servicemeet/serviceMeetEdit', {
                                        service_meet : service_meet,
                                        datas:datas,
                                        treatmentMethodArr:treatmentMethodArr,
                                        serverDemandArr:serverDemandArr,
                                        shopArr:shopArr,
                                        areaNames:consts.AREA_NAMES,
                                        areaCodes:consts.AREA_CODES});
                                });
                            })
                        });
                    }
                }else{
                    next();
                }
                })
        } else {
            next();
        }
    })
}
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delServiceMeet(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/service_meet_list?replytype=del');
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
    var shopId = req.session.user.shopId;
    var tel = req.query.phone ? req.query.phone : '';
    var name = req.query.name ? req.query.name : '';
    var meetTime = req.query.meetTime ? req.query.meetTime : '';
    var currentPage = req.query.page ? req.query.page : 1;
    currentPage =currentPage<1?1:currentPage;

    service.fetchAllServiceMeet(shopId,tel,name,meetTime,1,currentPage, function (err, results) {
        if (!err) {
            results.phone = tel;
            results.name = name;
            results.meetTime = meetTime;
            results.currentPage = currentPage;
            res.render('serviceMeet/serviceMeetSelect', {data : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}