/**
 * Created by kuanchang on 16/1/17.
 */
/**
 * 获取预约课程列表
 * @param req
 * @param res
 */

var laypage = require('laypage');
var service = require('../../model/service/classMeet');
var consts = require('../../model/utils/consts');

module.exports.list = function (req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var memberName = req.query.memberName ? req.query.memberName : '';
    var courseName = req.query.courseName ? req.query.courseName : '';
    var courseTimeStart = req.query.courseTimeStart ? req.query.courseTimeStart : '';
    var currentPage = req.query.page ? req.query.page : 1;
    currentPage =currentPage<1?1:currentPage;
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;
    service.fetchAllClassMeet(shopId,memberName,courseName,courseTimeStart,currentPage, function (err, results) {
        if (!err) {
            results.memberName = memberName;
            results.courseName = courseName;
            results.courseTimeStart = courseTimeStart;
            results.currentPage=currentPage;
            res.render('classMeet/classMeetList', {data : results, replytype : replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
            });
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
module.exports.goAdd = function (req, res,next) {
    res.render('classMeet/classMeetAdd');
}

module.exports.add = function (req, res) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    var memberId = req.body.memberId ? req.body.memberId : '';
    var courseId = req.body.courseId ? req.body.courseId : '';
    var childMonths = req.body.childMonths ? req.body.childMonths : '';
    var externPersons = req.body.externPersons ? req.body.externPersons : '';
    var weatherLeadBaby = req.body.weatherLeadBaby ? req.body.weatherLeadBaby : '';
    var remark = req.body.remark ? req.body.remark : '';
    var isRegisterSuccess = req.body.isRegisterSuccess ? req.body.isRegisterSuccess : 'true';
    var isPhoneConfirm = req.body.isPhoneConfirm ? req.body.isPhoneConfirm : '未确认';
    var isSmConfirm = req.body.isSmConfirm ? req.body.isSmConfirm : '未确认';
    var courseConfirm = req.body.courseConfirm ? req.body.courseConfirm : 'no';
    var ReasonForNotCome = req.body.ReasonForNotCome ? req.body.ReasonForNotCome : '0';
    service.check(courseId ,function(err, results) {
        if (!err) {
            isRegisterSuccess = results;
            service.insertClassMeet(shopId,memberId,courseId,childMonths,externPersons,weatherLeadBaby,remark,
                isRegisterSuccess,isPhoneConfirm,isSmConfirm,courseConfirm,ReasonForNotCome, function (err, results) {
                    if (!err) {
                        res.redirect('/jinquan/class_meet_list?replytype=add');
                    } else {
                        next();
                    }
                });
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
   service.check(courseId ,function(err, results) {
        isRegisterSuccess=results[0];
    });

    service.updateClassMeet(id,memberId,courseId,childMonths,externPersons,weatherLeadBaby,remark,
        isRegisterSuccess,isPhoneConfirm,isSmConfirm,courseConfirm,ReasonForNotCome, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/class_meet_list?replytype=update');
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
            if(classMeet != null){
                classMeet.courseTimeStart = consts.COURSE_DATE[classMeet.courseTimeStart] + "~" +consts.COURSE_DATE[classMeet.courseTimeEnd];
            }
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
            if(classMeet != null){
                classMeet.courseTimeStart = consts.COURSE_DATE[classMeet.courseTimeStart] + "~" +consts.COURSE_DATE[classMeet.courseTimeEnd];
            }
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
            res.redirect('/jinquan/class_meet_list?replytype=del');
        } else {
            next();
        }
    });

}

/**
 * 根据会员编码和课程id判断是否可选
 * @param req
 * @param res
 * @param next
 */
module.exports.checkIsSelectCourse = function (req, res, next) {

    var memberId = req.body.memberId ? req.body.memberId : '';
    var courseId = req.body.courseId ? req.body.courseId : '';

    service.checkIsSelectCourse(memberId,courseId,function (err, flag) {
        if (!err) {
            res.json({flag : flag});
        } else {
            next();
        }
    });
}


/**
 * 获取预约课程列表
 * @param req
 * @param res
 */
module.exports.classMeetSelectList = function (req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var memberName = req.query.memberName ? req.query.memberName : '';
    var courseName = req.query.courseName ? req.query.courseName : '';
    var courseTimeStart = req.query.courseTimeStart ? req.query.courseTimeStart : '';
    var currentPage = req.query.page ? req.query.page : 1;
    var index = req.query.index ? req.query.index : "";
    currentPage =currentPage<1?1:currentPage;
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    service.fetchAllClassMeet(shopId,memberName,courseName,courseTimeStart,currentPage, function (err, results) {
        if (!err) {
            results.memberName = memberName;
            results.courseName = courseName;
            results.courseTimeStart = courseTimeStart;
            results.currentPage=currentPage;
            res.render('classMeet/classMeetSelectList', {data : results, replytype : replytype, index:index,laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages})
            });
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}
