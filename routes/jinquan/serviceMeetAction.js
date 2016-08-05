
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
//公用方法
var commonUtil = require('../../model/utils/common');

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


module.exports.doEdit = function (req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var id = req.body.id ? req.body.id : '';//预约单id
    var memberId = req.body.memberId ? req.body.memberId : '';//会员id
    var name = req.body.name ? req.body.name : '';//会员名称
    var tel = req.body.tel ? req.body.tel : '';//电话id
    var meetTime = req.body.meetTime ? req.body.meetTime : '';//预约时间
    var specialRemarks = req.body.specialRemarks ? req.body.specialRemarks : '';//特殊备注
    var serviceType = req.body.serviceType ? req.body.serviceType : '';//服务位置：到店、上门
    var province = req.body.province ? req.body.province : '';//市级信息
    var city = req.body.city ? req.body.city : '';//市、县级市、县信息
    var town = req.body.town ? req.body.town : '';//县信息
    var address = req.body.address ? req.body.address : '';//上门时选择的地址
    var price = req.body.price ? req.body.price : '';//报价
    var serverShopId = req.body.serverShopId ? req.body.serverShopId : '';//接受服务的门店id
    var specified = req.body.specified ? req.body.specified : '';//是否指定技师
    var principal = req.body.principal ? req.body.principal : '';//所选技师名称
    var staffId = req.body.staffId ? req.body.staffId : '';//技师ID
    var status = req.body.status ? req.body.status : '';//当前状态
    var nursServiceId = req.body.nursServiceId ? req.body.nursServiceId : '';//护理服务Id
    var nursServiceNo = req.body.nursServiceNo ? req.body.nursServiceNo : '';//护理服务单号
    var serviceTime = req.body.serviceTime ? req.body.serviceTime : '';//服务开始时间
    var createService = req.body.createService ? req.body.createService : '';//是否新增护理服务单数据



    //做过何种处理
    var dealTemp = req.body.deal ? req.body.deal : '';
    var deal = commonUtil.array2Str(dealTemp,",");
    //服务需求
    var serviceNeedsTemp = req.body.serviceNeeds ? req.body.serviceNeeds : '';
    var serviceNeeds = commonUtil.array2Str(serviceNeedsTemp,",");
    //提供服务的技师ID
    var serviceStaffIdsTemp = req.body.serviceStaffId ? req.body.serviceStaffId : '';//护理服务技师ID
    var serviceStaffIds = commonUtil.array2Str(serviceStaffIdsTemp,",");
    //提供服务的技师名称
    var serviceStaffNamesTemp = req.body.serviceStaffName ? req.body.serviceStaffName : '';//护理服务技师名称
    var serviceStaffNames = commonUtil.array2Str(serviceStaffNamesTemp,",");
    if(status < consts.SERVICE_MEET_STATE_3 && specified ==2){//specified:1：未指定；2：指定；3：推荐
        //当状态为：预约成功、上门预约时，默认将指定技师定义为为其服务的服务技师（确认服务时，可以修改）
        serviceStaffIds = staffId;
        serviceStaffNames = principal;
    }
    if(id != ""){
        if(status == 3 && createService == 'Y'){//状态为已接受服务，增加护理服务单
            //根据门店id获取下一个服务单编号信息
            nursservice.createNursNo(shopId,function(err, nursNoResults){
                var nursServiceNo = nursNoResults.nursNo;
                if (!err) {
                    //先获取服务单号，新增记录
                    //服务单状态为：服务中（1）
                    if(serviceType == '2'){//上门
                        serverShopId = shopId;
                    }
                    nursservice.insertNursServiceByServiceMeet(serverShopId,nursServiceNo, id, meetTime.substring(0,10), serviceTime,consts.NURS_STATE_1, function (err, insertResults) {
                        if (!err) {
                            service.updateServiceMeet(id,memberId,name,tel,meetTime,specialRemarks,serviceType,province,city,town,address,price,serverShopId,specified,principal,
                                staffId,status,insertResults.insertId,nursServiceNo,serviceTime,deal,serviceNeeds,serviceStaffIds,serviceStaffNames,function (err, results) {
                                    if (!err) {
                                        res.redirect('/jinquan/service_meet_list?replytype=update');
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
            });
        }else{
            //其他状态，只修改其他字段即可
            service.updateServiceMeet(id,memberId,name,tel,meetTime,specialRemarks,serviceType,province,city,town,address,price,serverShopId,specified,principal,
                staffId,status,nursServiceId,nursServiceNo,serviceTime,deal,serviceNeeds,serviceStaffIds,serviceStaffNames,function (err, results) {
                if (!err) {
                    res.redirect('/jinquan/service_meet_list?replytype=update');
                } else {
                    next();
                }
            });
        }

    }else{
        service.insertServiceMeet(shopId,memberId,name,tel,meetTime ,specialRemarks ,serviceType,province,city,town,address ,price ,serverShopId ,
            specified,principal,staffId ,status,nursServiceId,serviceTime,deal,serviceNeeds,serviceStaffIds, serviceStaffNames,function (err, results) {
                if (!err) {
                    res.redirect('/jinquan/service_meet_list?replytype=add');
                } else {
                    next();
                }
            });
    }
}


module.exports.preEdit = function(req, res, next) {
    var shopId = req.session.user.shopId;
    var id = req.query.id ? req.query.id : '';
    var show = req.query.show ? req.query.show : '';
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
                        res.render('serviceMeet/serviceMeetEdit', {
                            service_meet : service_meet,
                            show:show,
                            datas:{},
                            treatmentMethodArr:treatmentMethodArr,
                            serverDemandArr:serverDemandArr,
                            shopArr:shopArr});
                    }else{

                        result.member=member;
                        //预约服务单
                        servicemeet.getTop3ServiceMeet(member.id,function(err, services) {
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
                                    res.render('serviceMeet/serviceMeetEdit', {
                                        service_meet : service_meet,
                                        show:show,
                                        datas:datas,
                                        treatmentMethodArr:treatmentMethodArr,
                                        serverDemandArr:serverDemandArr,
                                        shopArr:shopArr});
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
    var status = req.query.status ? req.query.status : "1,2";
    currentPage =currentPage<1?1:currentPage;
    var url = '/jinquan'+req.url;

    //根据条件查询所有预约单信息，其中状态必须是预约成功的状态：1：已预约；2：上门预约
    service.fetchAllServiceMeet(shopId,tel,name,meetTime,status,currentPage, function (err, results) {
        if (!err) {
            results.phone = tel;
            results.name = name;
            results.meetTime = meetTime;
            results.currentPage = currentPage;
            res.render('serviceMeet/serviceMeetSelect', {data : results, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages})});

        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}