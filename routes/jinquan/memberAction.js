/**
 * Created by kuanchang on 16/1/17.
 */
/**
 * 获取会员列表
 * @param req
 * @param res
 */

var laypage = require('laypage');
var service = require('../../model/service/member');
//预约服务单
var servicemeet = require('../../model/service/servicemeet');
//护理服务
var nursservice = require('../../model/service/nursservice');
//投诉
var complain = require('../../model/service/complain');
//公用数据
var consts = require('../../model/utils/consts');

var commonUtil = require('../../model/utils/common');//公共类

module.exports.list = function (req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    //res.render('member/memberList');
    //var memberNo = req.query.memberNo ? req.query.memberNo : '';//会员编号
    var serialNumber = req.query.serialNumber ? req.query.serialNumber : '';
    var memberName = req.query.memberName ? req.query.memberName : '';
    var tel = req.query.tel ? req.query.tel : '';
    var currentPage = req.query.page ? req.query.page : 1;
 // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;
    service.fetchAllMember(shopId,serialNumber,memberName,tel,currentPage, function (err, results) {
        if (!err) {
            //results.memberNo = memberNo;
            results.serialNumber = serialNumber;
            results.memberName = memberName;
            results.tel = tel;
            results.currentPage = currentPage;
            res.render('member/memberList', {data : results, replytype : replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
            });
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
module.exports.goAdd = function (req, res,next) {
    res.render('member/memberAdd');
}

module.exports.add = function (req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var memberCardType = req.body.memberCardType ? req.body.memberCardType : '';
    var birthYearMonth = req.body.birthYearMonth ? req.body.birthYearMonth : '';//去掉年龄，增加出生年月
    var memberName = req.body.memberName ? req.body.memberName : '';
    var tel = req.body.tel ? req.body.tel : '';
    var contact = req.body.contact ? req.body.contact : '';
    var address = req.body.address ? req.body.address : '';
    var workStatus = req.body.workStatus ? req.body.workStatus : '';
    var motherEducation = req.body.motherEducation ? req.body.motherEducation : '';
    var fatherEducation = req.body.fatherEducation ? req.body.fatherEducation : '';
    var deliveryMode = req.body.deliveryMode ? req.body.deliveryMode : '';
    var deliveryWeeks = req.body.deliveryWeeks ? req.body.deliveryWeeks : '';
    var deliveryHospital = req.body.deliveryHospital ? req.body.deliveryHospital : '';
    var parentTraining = req.body.parentTraining ? req.body.parentTraining : '';
    var secondChildExperience = req.body.secondChildExperience ? req.body.secondChildExperience : '';
    var secondChildExperienceRemark = req.body.secondChildExperienceRemark ? req.body.secondChildExperienceRemark : '';
    var wifeBreastfeedTime = req.body.wifeBreastfeedTime ? req.body.wifeBreastfeedTime : '';
    var husbandBreastfeedTime = req.body.husbandBreastfeedTime ? req.body.husbandBreastfeedTime : '';
    var breastfeedReason = req.body.breastfeedReason ? req.body.breastfeedReason : '';
    var childName = req.body.childName ? req.body.childName : '';
    var childSex = req.body.childSex ? req.body.childSex : '';
    var childHeight = req.body.childHeight ? req.body.childHeight : '';
    var childWeight = req.body.childWeight ? req.body.childWeight : '';
    var childBirthday = req.body.childBirthday ? req.body.childBirthday : '';
    var hospitalization = req.body.hospitalization ? req.body.hospitalization : '';
    var hospitalizationReason = req.body.hospitalizationReason ? req.body.hospitalizationReason : '';
    var assistantTool = req.body.assistantTool ? req.body.assistantTool : '';
    var useToolReason = req.body.useToolReason ? req.body.useToolReason : '';
    var specialInstructions = req.body.specialInstructions ? req.body.specialInstructions : '';

    //如果understandJinQuanChannel为多选，将多选的值用逗号隔开
    var understandJinQuanChannel = req.body.understandJinQuanChannel ? req.body.understandJinQuanChannel : '';
    var understandJinQuanChannelVal = commonUtil.array2Str(understandJinQuanChannel,",");

    service.insertMember(shopId,birthYearMonth,memberCardType,memberName,tel,contact,address,workStatus,motherEducation,fatherEducation,deliveryMode,
        deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
        husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannelVal,
        hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions, function (err, results) {
        if (!err) {
            res.redirect('/jinquan/member_list?replytype=add');
        } else {
            next();
        }
    });

}

/**
 * 一键新增会员
 *
 */


module.exports.addMemberByTel = function (req, res,next) {
    var shopId = req.session.user.shopId;
    var tel = req.query.tel?req.query.tel:'';
    var customerName = req.query.customerName?req.query.customerName:'';

    service.getMemberByNameTel(tel,shopId,function (err, results) {
        if (!err) {
            var resObj = new Object();
            if(results.length > 0){
                resObj.id = results[0].id;
                resObj.isAdd = 0;
                res.json(JSON.stringify(resObj));
            }else{
                service.insertMemberByTel(shopId,customerName,tel, function (err, insertResults) {
                    if (!err) {
                        resObj.id = insertResults.insertId;
                        resObj.isAdd = 1;
                        res.json(JSON.stringify(resObj));
                    } else {
                        next();
                    }
                });
            }
        } else {
            next();
        }
    });

}

/**
 * 新增或修改会员信息
 * @param req
 * @param res
 * @param next
 */
module.exports.doEdit = function (req, res,next) {
    var id = req.body.id ? req.body.id : '';
    var birthYearMonth = req.body.birthYearMonth ? req.body.birthYearMonth : '';//去掉年龄字段，增加出生年月字段
    var memberCardType = req.body.memberCardType ? req.body.memberCardType : '';
    var memberName = req.body.memberName ? req.body.memberName : '';
    var contact = req.body.contact ? req.body.contact : '';
    var address = req.body.address ? req.body.address : '';
    var province = req.body.province ? req.body.province : '';//所属省份
    var city = req.body.city ? req.body.city : '';//所属区县
    var town = req.body.town ? req.body.town : '';//所属乡镇
    var workStatus = req.body.workStatus ? req.body.workStatus : '';
    var motherEducation = req.body.motherEducation ? req.body.motherEducation : '';
    var fatherEducation = req.body.fatherEducation ? req.body.fatherEducation : '';
    var deliveryMode = req.body.deliveryMode ? req.body.deliveryMode : '';
    var deliveryWeeks = req.body.deliveryWeeks ? req.body.deliveryWeeks : '';
    var deliveryHospital = req.body.deliveryHospital ? req.body.deliveryHospital : '';
    var parentTrainingStr = req.body.parentTraining ? req.body.parentTraining : '';
    var parentTraining = commonUtil.array2Str(parentTrainingStr,";");
    var secondChildExperience = req.body.secondChildExperience ? req.body.secondChildExperience : '';
    var secondChildExperienceRemark = req.body.secondChildExperienceRemark ? req.body.secondChildExperienceRemark : '';
    var wifeBreastfeedTime = req.body.wifeBreastfeedTime ? req.body.wifeBreastfeedTime : '';
    var husbandBreastfeedTime = req.body.husbandBreastfeedTime ? req.body.husbandBreastfeedTime : '';
    var breastfeedReason = req.body.breastfeedReason ? req.body.breastfeedReason : '';
    var childName = req.body.childName ? req.body.childName : '';
    var childSex = req.body.childSex ? req.body.childSex : '';
    var childHeight = req.body.childHeight ? req.body.childHeight : '';
    var childWeight = req.body.childWeight ? req.body.childWeight : '';
    var childBirthday = req.body.childBirthday ? req.body.childBirthday : '';
    var understandJinQuanChannelDes = req.body.understandJinQuanChannelDes ? req.body.understandJinQuanChannelDes : '';//如何知道金泉， 备注
    var hospitalization = req.body.hospitalization ? req.body.hospitalization : '';
    var hospitalizationReason = req.body.hospitalizationReason ? req.body.hospitalizationReason : '';
    var assistantTool = req.body.assistantTool ? req.body.assistantTool : '';
    var useToolReason = req.body.useToolReason ? req.body.useToolReason : '';
    var specialInstructions = req.body.specialInstructions ? req.body.specialInstructions : '';

    //如果understandJinQuanChannel为多选，将多选的值用逗号隔开
    var understandJinQuanChannel = req.body.understandJinQuanChannel ? req.body.understandJinQuanChannel : '';
    var understandJinQuanChannelVal = commonUtil.array2Str(understandJinQuanChannel,",");
    //如果tel为多个，将多选的值用分号隔开
    var tel = req.body.tel ? req.body.tel : '';
    var telVal = commonUtil.array2Str(tel,";");
    if(id != ""){
        service.updateMember(id,birthYearMonth,memberCardType,memberName,telVal,contact,province,city,town,address,workStatus,motherEducation,fatherEducation,deliveryMode,
            deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
            husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannelVal,understandJinQuanChannelDes,
            hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions, function (err, results) {
                if (!err) {
                    res.redirect('/jinquan/member_list?replytype=update');
                } else {
                    next();
                }
            });
    }else{
        var shopId = req.session.user.shopId;
        //获取会员原始卡号
        //(2016年12月20日和姚雨辰确认：会员编号用门店编码+第几个会员)当前月份第几个员工：201609003（2016年9月第三个会员）
        service.createMemberNoByShopId(shopId,function (err, results) {
            if (!err) {
                var count = results[0].count;
                var shopCode = results[0].shopCode;
                var memberNo = "";
                if(count < 10){
                    memberNo = shopCode+"0000"+count;
                }else if(count < 100){
                    memberNo = shopCode+"000"+count;
                }else if(count < 1000){
                    memberNo = shopCode+"00"+count;
                }else if(count < 10000){
                    memberNo = shopCode+"0"+count;
                }else{
                    memberNo = shopCode+""+count;
                }
                service.insertMember(shopId,memberNo,birthYearMonth,memberCardType,memberName,telVal,contact,province,city,town,address,workStatus,motherEducation,fatherEducation,deliveryMode,
                    deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
                    husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannelVal,
                    hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions, function (err, results) {
                        if (!err) {
                            res.redirect('/jinquan/member_list?replytype=add');
                        } else {
                            next();
                        }
                    });
            } else {
                next();
            }
        });

    }
}

module.exports.show = function(req, res, next) {
    var id = req.query.id ? req.query.id : '';
    service.fetchSingleMember(id, function(err, results) {
        if (!err) {
            var member = results.fetchSingData.length == 0 ? null : results.fetchSingData[0];
            res.render('member/memberDetail', {member : member,data:results});
        } else {
            next();
        }
    })
}

module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';
    var show = req.query.show ? req.query.show : '';

    service.fetchSingleMember(id, function(err, results) {
        if (!err) {
            var member = results.fetchSingData.length == 0 ? null : results.fetchSingData[0];
            if(member == null){
                member = {};
            }
            res.render('member/memberEdit', {
                member : member,
                data:results,
                show:show,
                areaNames:consts.AREA_NAMES,
                areaCodes:consts.AREA_CODES
            });
        } else {
            next();
        }
    })
}

module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delMember(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/member_list?replytype=del');
        } else {
            next();
        }
    });

}
module.exports.select = function (req, res, next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var serialNumber = req.query.serialNumber ? req.query.serialNumber : '';
    var memberName = req.query.memberName ? req.query.memberName : '';
    var tel = req.query.tel ? req.query.tel : '';
    var currentPage = req.query.page ? req.query.page : 1;

    service.fetchAllMemberByCard(shopId,serialNumber,memberName,tel,currentPage, function (err, results) {
        if (!err) {
            results.serialNumber = serialNumber;
            results.memberName = memberName;
            results.tel = tel;
            results.currentPage = currentPage;
            res.render('member/memberSelect',  {data : results});
        } else {
            next();
        }
    });

}
module.exports.selectAll = function (req, res, next) {
    //res.render('member/memberList');
    var serialNumber = req.query.serialNumber ? req.query.serialNumber : '';
    var memberName = req.query.memberName ? req.query.memberName : '';
    //var tel = req.query.tel ? req.query.tel : '';
    var tel = req.query.tel ? req.query.tel : '';
    var currentPage = req.query.page ? req.query.page : 1;
    currentPage =currentPage<1?1:currentPage;
    var url = '/jinquan'+req.url;
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    service.fetchAllMember(shopId,serialNumber,memberName,tel,currentPage, function (err, results) {
        if (!err) {
            results.serialNumber = serialNumber;
            results.memberName = memberName;
            results.tel = tel;
            results.currentPage = currentPage;
            res.render('member/memberSelect', {data : results,laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages})});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });

}

/**
 * 根据会员id查询预约、服务、投诉信息
 * @param req
 * @param res
 * @param next
 */
module.exports.getMemberByMemberId = function(req, res, next) {

    var memberId = req.body.memberId ? req.body.memberId : '';
    var result={} ;
    result.flag= false;
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    //根据会员id获取预约单信息
    servicemeet.getTop3ServiceMeet(memberId,function(err, services) {
        if (!err) {
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
                    console.log(JSON.stringify(result));
                    res.json(JSON.stringify(result));
                });
            })
        } else {
            next();
        }
    });
}


module.exports.selectForActivity = function (req, res, next) {
    //res.render('member/memberList');
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var serialNumber = req.query.serialNumber ? req.query.serialNumber : '';
    var memberName = req.query.memberName ? req.query.memberName : '';
    var tel = req.query.tel ? req.query.tel : '';
    var currentPage = req.query.page ? req.query.page : 1;
    var index = req.query.index ? req.query.index : '';

    service.fetchAllMember(shopId,serialNumber,memberName,tel,currentPage, function (err, results) {
        if (!err) {
            results.serialNumber = serialNumber;
            results.memberName = memberName;
            results.tel = tel;
            res.render('member/memberSelectActivity', {data : results,index:index});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });

}