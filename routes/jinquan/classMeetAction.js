/**
 * Created by kuanchang on 16/1/17.
 */
/**
 * 获取预约课程列表
 * @param req
 * @param res
 */

var service = require('../../model/service/classMeet');

module.exports.list = function (req, res) {
    var memberName = req.query.memberName ? req.query.memberName : '';
    var courseName = req.query.courseName ? req.query.courseName : '';
    var courseTimeStart = req.query.courseTimeStart ? req.query.courseTimeStart : '';
    var currentPage = req.query.page ? req.query.page : 1;

    service.fetchAllClassMeet(memberName,courseName,courseTimeStart,currentPage, function (err, results) {
        if (!err) {
            results.memberName = memberName;
            results.courseName = courseName;
            results.courseTimeStart = courseTimeStart;
            res.render('classMeet/classMeetList', {data : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}

/**
 * 增加预约课程
 * @param req
 * @param res
 */
module.exports.goAdd = function (req, res) {
    res.render('classMeet/classMeetAdd');
}

module.exports.add = function (req, res) {
    var memberId = req.body.memberId ? req.body.memberId : '';
    var courseId = req.body.courseId ? req.body.courseId : '';
    var childMonths = req.body.childMonths ? req.body.childMonths : '';
    var externPersons = req.body.externPersons ? req.body.externPersons : '';
    var weatherLeadBaby = req.body.weatherLeadBaby ? req.body.weatherLeadBaby : '';
    var remark = req.body.remark ? req.body.remark : '';
    var isRegisterSuccess = req.body.isRegisterSuccess ? req.body.isRegisterSuccess : '';
    var isPhoneConfirm = req.body.isPhoneConfirm ? req.body.isPhoneConfirm : '';
    var isSmConfirm = req.body.isSmConfirm ? req.body.isSmConfirm : '';
    var courseConfirm = req.body.courseConfirm ? req.body.courseConfirm : '';
    var ReasonForNotCome = req.body.ReasonForNotCome ? req.body.ReasonForNotCome : '';


    service.insertClassMeet(memberId,courseId,childMonths,externPersons,weatherLeadBaby,remark,
        isRegisterSuccess,isPhoneConfirm,isSmConfirm,courseConfirm,ReasonForNotCome, function (err, results) {
        if (!err) {
            res.redirect('/jinquan/class_meet_list');
        } else {
            next();
        }
    });
}


module.exports.doEdit = function (req, res, next) {
    var id = req.body.id ? req.body.id : '';
    var memberId = req.body.memberId ? req.body.memberId : '';
    var courseId = req.body.courseId ? req.body.courseId : '';
    var childMonths = req.body.childMonths ? req.body.childMonths : '';
    var externPersons = req.body.externPersons ? req.body.externPersons : '';
    var weatherLeadBaby = req.body.weatherLeadBaby ? req.body.weatherLeadBaby : '';
    var remark = req.body.remark ? req.body.remark : '';
    var isRegisterSuccess = req.body.isRegisterSuccess ? req.body.isRegisterSuccess : '';
    var isPhoneConfirm = req.body.isPhoneConfirm ? req.body.isPhoneConfirm : '';
    var isSmConfirm = req.body.isSmConfirm ? req.body.isSmConfirm : '';
    var courseConfirm = req.body.courseConfirm ? req.body.courseConfirm : '';
    var ReasonForNotCome = req.body.ReasonForNotCome ? req.body.ReasonForNotCome : '';


    service.updateClassMeet(id,memberId,courseId,childMonths,externPersons,weatherLeadBaby,remark,
        isRegisterSuccess,isPhoneConfirm,isSmConfirm,courseConfirm,ReasonForNotCome, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/class_meet_list');
            } else {
                next();
            }
        });
}

module.exports.show = function(req, res, next) {
    var id = req.query.id ? req.query.id : '';

    service.fetchSingleClassMeet(id, function(err, results) {
        if (!err) {
            var classMeet = results.length == 0 ? null : results[0];
            res.render('classMeet/classMeetDetail', {classMeet : classMeet});
        } else {
            next();
        }
    })
}
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleClassMeet(id, function(err, results) {
        if (!err) {
            var classMeet = results.length == 0 ? null : results[0];
            res.render('classMeet/classMeetEdit', {classMeet : classMeet});
        } else {
            next();
        }
    })
}
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delClassMeet(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/class_meet_list');
        } else {
            next();
        }
    });

}