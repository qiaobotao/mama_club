/**
 * Created by kuanchang on 16/1/13.
 */

/**
 * 获取活动列表
 * @param req
 * @param res
 */

var service = require('../../model/service/activityManage');
var courseService = require('../../model/service/course');

module.exports.list = function (req, res) {
    var activityName = req.query.activityName ? req.query.activityName : '';
    var activityType = req.query.activityType ? req.query.activityType : '';
    var effectiveTimeStart = req.query.effectiveTimeStart ? req.query.effectiveTimeStart : '';
    var effectiveTimeEnd = req.query.effectiveTimeEnd ? req.query.effectiveTimeEnd : '';
    var status = req.query.status ? req.query.status : '';
    var currentPage = req.query.page ? req.query.page : 1;

    service.fetchAllActivityManage(activityName,activityType,effectiveTimeStart,effectiveTimeEnd,status,currentPage, function (err, results) {
        if (!err) {
            results.activityName = activityName;
            results.activityType = activityType;
            results.effectiveTimeStart = effectiveTimeStart;
            results.effectiveTimeEnd = effectiveTimeEnd;
            results.status = status;
            res.render('activityManage/activityManageList', {data : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}
/**
 * 编辑活动
 * @param req
 * @param res
 */
module.exports.goAdd = function (req, res) {
    res.render('activityManage/activityManageAdd');
}


module.exports.add = function (req, res,next) {
    var activityName = req.body.activityName ? req.body.activityName : '';
    var activityType = req.body.activityType ? req.body.activityType : '';
    var memberCardTypeArray = req.body.memberCardType ? req.body.memberCardType : '';
    var memberCardType = '';
    if (memberCardTypeArray.length > 0)
    {
        for (x in memberCardTypeArray)
        {
            memberCardType += x + ',';
        }
    }
    var effectiveTimeStart = req.body.effectiveTimeStart ? req.body.effectiveTimeStart : '';
    var effectiveTimeEnd = req.body.effectiveTimeEnd ? req.body.effectiveTimeEnd : '';
    var describe = req.body.describe ? req.body.describe : '';
    var status = req.body.status ? req.body.status : '';
    //折扣信息
    var arr_activityDynamics = req.body.activityDynamics ? req.body.activityDynamics : '';
    var arr_totalCount = req.body.totalCount ? req.body.totalCount :'';
    var arr_usedCount = req.body.usedCount ? req.body.usedCount : '';

    var arr = new Array();

    if (arr_activityDynamics instanceof Array) {
        for (var i=0;i<arr_activityDynamics.length;i++) {
            var obj = {};
            obj.activityDynamics = arr_activityDynamics[i];
            obj.totalCount = arr_totalCount[i];
            obj.usedCount = arr_usedCount[i];
            arr.push(obj);
        }
    } else {
        var obj = {};
        obj.activityDynamics = arr_activityDynamics ;
        obj.totalCount = arr_totalCount ;
        obj.usedCount = arr_usedCount ;
        arr.push(obj);
    }
    //可选择的产品
    var proIdArray = req.body.proId ? req.body.proId : '';
    var proIds = '';
    if (proIdArray.length > 0)
    {
        for (x in proIdArray)
        {
            proIds += x + ',';
        }
    }
    //可选择的课程
    var courseIdArray = req.body.courseId ? req.body.courseId : '';
    var courseIds = '';
    if (courseIdArray.length > 0)
    {
        for (x in courseIdArray)
        {
            courseIds += x + ',';
        }
    }
    //可参与活动的会员
    var memberIdArray = req.body.memberId ? req.body.memberId : '';
    var memberIds = '';
    if (memberIdArray.length > 0)
    {
        for (x in memberIdArray)
        {
            memberIds += x + ',';
        }
    }
    //可选择的服务
    var serviceIdArray = req.body.serviceId ? req.body.serviceId : '';
    var serviceIds = '';
    if (serviceIdArray.length > 0)
    {
        for (x in serviceIdArray)
        {
            serviceIds += x + ',';
        }
    }
    service.insertActivityManage(proIds,courseIds,memberIds,serviceIds,activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,describe,status, function (err, results) {
            if (!err) {
                var activityId = results.insertId;
                service.insertActivityMX(activityId,arr,function (err, results) {
                  if (!err) {
                      res.redirect('/jinquan/activity_manage_list?replytype=add');
                    } else {
                        service.delActivityManage(activityId);
                        next();
                    }
                })
            } else {
                next();
            }
        });
}


module.exports.doEdit = function (req, res,next) {
    var id = req.body.id ? req.body.id : '';
    var activityName = req.body.activityName ? req.body.activityName : '';
    var activityType = req.body.activityType ? req.body.activityType : '';
    var memberCardTypeArray = req.body.memberCardType ? req.body.memberCardType : '';
    var memberCardType = '';
    if (memberCardTypeArray.length > 0)
    {
        for (x in memberCardTypeArray)
        {
            memberCardType += x + ',';
        }
    }
    var effectiveTimeStart = req.body.effectiveTimeStart ? req.body.effectiveTimeStart : '';
    var effectiveTimeEnd = req.body.effectiveTimeEnd ? req.body.effectiveTimeEnd : '';
    var describe = req.body.describe ? req.body.describe : '';
    var status = req.body.status ? req.body.status : '';
    //折扣信息
    //可选择的产品
    var proIdArray = req.body.proId ? req.body.proId : '';
    var proIds = '';
    if (proIdArray.length > 0)
    {
        for (x in proIdArray)
        {
            proIds += x + ',';
        }
    }
    //可选择的课程
    var courseIdArray = req.body.courseId ? req.body.courseId : '';
    var courseIds = '';
    if (courseIdArray.length > 0)
    {
        for (x in courseIdArray)
        {
            courseIds += x + ',';
        }
    }
    //可参与活动的会员
    var memberIdArray = req.body.memberId ? req.body.memberId : '';
    var memberIds = '';
    if (memberIdArray.length > 0)
    {
        for (x in memberIdArray)
        {
            memberIds += x + ',';
        }
    }
    //可选择的服务
    var serviceIdArray = req.body.serviceId ? req.body.serviceId : '';
    var serviceIds = '';
    if (serviceIdArray.length > 0)
    {
        for (x in serviceIdArray)
        {
            serviceIds += x + ',';
        }
    }

    service.updateActivityManage(id,activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,describe,status,proIds,courseIds,memberIds,serviceIds, function (err, results) {
        if (!err) {
            service.delActivityManageMX(id);
            service.insertActivityMX(id,arr,function (err, results) {
                if (!err) {
                    res.redirect('/jinquan/activity_manage_list?replytype=Edit');
                } else {
                    service.delActivityManage(activityId);
                    next();
                }
            })
        } else {
            next();
        }
    });
}

module.exports.show = function(req, res, next) {
    var id = req.query.id ? req.query.id : '';
    service.fetchSingleActivityManage(id, function(err, results) {
        if (!err) {
            var activityManage = results.length == 0 ? null : results[0];
            var proIds =activityManage.proIds;
            var courseIds =activityManage.courseIds;
            var memberIds =activityManage.memberIds;
            var serviceIds =activityManage.serviceIds;
            res.render('activityManage/activityManageDetail', {activityManage : activityManage});
        } else {
            next();
        }
    })
}
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleActivityManage(id, function(err, results) {
        if (!err) {
            var activityManage = results.length == 0 ? null : results[0];
            res.render('activityManage/activityManageEdit', {activityManage : activityManage});
        } else {
            next();
        }
    })
}
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delActivityManage(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/activity_manage_list');
        } else {
            next();
        }
    });

}