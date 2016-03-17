/**
 * Created by kuanchang on 16/1/17.
 */
/**
 * 获取会员列表
 * @param req
 * @param res
 */

var service = require('../../model/service/member');
//预约服务单
var servicemeet = require('../../model/service/servicemeet');
//护理服务
var nursservice = require('../../model/service/nursservice');
//投诉
var complain = require('../../model/service/complain');
module.exports.list = function (req, res,next) {
    //res.render('member/memberList');
    var serialNumber = req.query.serialNumber ? req.query.serialNumber : '';
    var memberName = req.query.memberName ? req.query.memberName : '';
    var tel = req.query.tel ? req.query.tel : '';
    var currentPage = req.query.page ? req.query.page : 1;

    service.fetchAllMember(serialNumber,memberName,tel,currentPage, function (err, results) {
        if (!err) {
            results.serialNumber = serialNumber;
            results.memberName = memberName;
            results.tel = tel;
            res.render('member/memberList', {data : results});
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
    res.render('member/memberAdd');
}

module.exports.add = function (req, res,next) {
    var memberCardType = req.body.memberCardType ? req.body.memberCardType : '';
    var age = req.body.age ? req.body.age : 0;
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
    var understandJinQuanChannel = req.body.understandJinQuanChannel ? req.body.understandJinQuanChannel : '';
    var hospitalization = req.body.hospitalization ? req.body.hospitalization : '';
    var hospitalizationReason = req.body.hospitalizationReason ? req.body.hospitalizationReason : '';
    var assistantTool = req.body.assistantTool ? req.body.assistantTool : '';
    var useToolReason = req.body.useToolReason ? req.body.useToolReason : '';
    var specialInstructions = req.body.specialInstructions ? req.body.specialInstructions : '';

    service.insertMember(age,memberCardType,memberName,tel,contact,address,workStatus,motherEducation,fatherEducation,deliveryMode,
        deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
        husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,
        hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions, function (err, results) {
        if (!err) {
            res.redirect('/jinquan/member_list');
        } else {
            next();
        }
    });

}


module.exports.doEdit = function (req, res,next) {
    var id = req.body.id ? req.body.id : '';
    var age = req.body.age ? req.body.age : 0;
    var memberCardType = req.body.memberCardType ? req.body.memberCardType : '';
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
    var understandJinQuanChannel = req.body.understandJinQuanChannel ? req.body.understandJinQuanChannel : '';
    var hospitalization = req.body.hospitalization ? req.body.hospitalization : '';
    var hospitalizationReason = req.body.hospitalizationReason ? req.body.hospitalizationReason : '';
    var assistantTool = req.body.assistantTool ? req.body.assistantTool : '';
    var useToolReason = req.body.useToolReason ? req.body.useToolReason : '';
    var specialInstructions = req.body.specialInstructions ? req.body.specialInstructions : '';

    service.updateMember(id,age,memberCardType,memberName,tel,contact,address,workStatus,motherEducation,fatherEducation,deliveryMode,
        deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
        husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,
        hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/member_list');
            } else {
                next();
            }
        });
}

module.exports.show = function(req, res, next) {
    var id = req.query.id ? req.query.id : '';
    service.fetchSingleMember(id, function(err, results) {
        if (!err) {
            var member = results.length == 0 ? null : results[0];
            res.render('member/memberDetail', {member : member});
        } else {
            next();
        }
    })
}

module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleMember(id, function(err, results) {
        if (!err) {
            var member = results.length == 0 ? null : results[0];
            res.render('member/memberEdit', {member : member});
        } else {
            next();
        }
    })
}

module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delMember(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/member_list');
        } else {
            next();
        }
    });

}
module.exports.select = function (req, res, next) {
    var serialNumber = req.query.serialNumber ? req.query.serialNumber : '';
    var memberName = req.query.memberName ? req.query.memberName : '';
    var tel = req.query.tel ? req.query.tel : '';
    var currentPage = req.query.page ? req.query.page : 1;

    service.fetchAllMemberByCard(serialNumber,memberName,tel,currentPage, function (err, results) {
        if (!err) {
            results.serialNumber = serialNumber;
            results.memberName = memberName;
            results.tel = tel;
            res.render('member/memberSelect', {data : results});
        } else {
            next();
        }
    });

}
module.exports.selectAll = function (req, res, next) {
    //res.render('member/memberList');
    var serialNumber = req.query.serialNumber ? req.query.serialNumber : '';
    var memberName = req.query.memberName ? req.query.memberName : '';
    var tel = req.query.tel ? req.query.tel : '';
    var currentPage = req.query.page ? req.query.page : 1;

    service.fetchAllMember(serialNumber,memberName,tel,currentPage, function (err, results) {
        if (!err) {
            results.serialNumber = serialNumber;
            results.memberName = memberName;
            results.tel = tel;
            res.render('member/memberSelect', {data : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });

}
module.exports.getMemberByNameTel = function(req, res, next) {

    var memberName = req.body.memberName ? req.body.memberName : '';
    var tel = req.body.memberTel ? req.body.memberTel : '';
    var result={} ;
    result.flag= false;

    service.getMemberByNameTel(memberName,tel ,function(err, results) {
        if (!err) {
                var member = results.length == 0 ? null : results[0];
                if(member!=null)
                {
                    result.member=member;
                    //预约服务单
                      servicemeet.getTop3ServiceMeet(member.id,memberName,tel,function(err, services) {
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
                                      result.flag= true;
                                      console.log(JSON.stringify(result));
                                      res.json(JSON.stringify(result));
                                 });
                              })
                          });
                }else
                {
                    console.log(JSON.stringify(result));
                    res.json(JSON.stringify(result));
                }

        } else {
            next();
        }
    }
    )
}


module.exports.selectForActivity = function (req, res, next) {
    //res.render('member/memberList');
    var serialNumber = req.query.serialNumber ? req.query.serialNumber : '';
    var memberName = req.query.memberName ? req.query.memberName : '';
    var tel = req.query.tel ? req.query.tel : '';
    var currentPage = req.query.page ? req.query.page : 1;
    var index = req.query.index ? req.query.index : '';

    service.fetchAllMember(serialNumber,memberName,tel,currentPage, function (err, results) {
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