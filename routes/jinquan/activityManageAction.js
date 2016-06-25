/**
 * Created by kuanchang on 16/1/13.
 */

/**
 * 获取活动列表
 * @param req
 * @param res
 */

var laypage = require('laypage');
var service = require('../../model/service/activityManage');
var consts = require('../../model/utils/consts');
var commonUtil = require('../../model/utils/common');//公共类


module.exports.list = function (req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var activityName = req.query.activityName ? req.query.activityName : '';
    var activityType = req.query.activityType ? req.query.activityType : '';
    var effectiveTimeStart = req.query.effectiveTimeStart ? req.query.effectiveTimeStart : '';
    var effectiveTimeEnd = req.query.effectiveTimeEnd ? req.query.effectiveTimeEnd : '';
    var status = req.query.status ? req.query.status : '';
    var currentPage = req.query.page ? req.query.page : 1;
    currentPage =currentPage<1?1:currentPage;
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    service.fetchAllActivityManage(shopId,activityName,activityType,effectiveTimeStart,effectiveTimeEnd,status,currentPage, function (err, results) {
        if (!err) {
            results.activityName = activityName;
            results.activityType = activityType;
            results.effectiveTimeStart = effectiveTimeStart;
            results.effectiveTimeEnd = effectiveTimeEnd;
            results.status = status;
            results.currentPage = currentPage;
            res.render('activityManage/activityManageList', {data : results, replytype : replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
            });
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
module.exports.goAdd = function (req, res,next) {
    res.render('activityManage/activityManageAdd',{"discountNames":consts.DISCOUNT_NAMES,"discountValues":consts.DISCOUNT_VALUES});
}


module.exports.add = function (req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    var activityName = req.body.activityName ? req.body.activityName : '';
    var activityType = req.body.activityType ? req.body.activityType : '';
    var memberCardTypeArray = req.body.memberCardType ? req.body.memberCardType : '';
    var memberCardType = commonUtil.array2Str(memberCardTypeArray,",");

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
    var proIds = commonUtil.array2Str(proIdArray,",");
    //可选择的课程
    var courseIdArray = req.body.courseId ? req.body.courseId : '';
    var courseIds = commonUtil.array2Str(courseIdArray,",");
    //可参与活动的会员
    var memberIdArray = req.body.memberId ? req.body.memberId : '';
    var memberIds = commonUtil.array2Str(memberIdArray,",");
    //可选择的服务
    var serviceIdArray = req.body.serviceId ? req.body.serviceId : '';
    var serviceIds = commonUtil.array2Str(serviceIdArray,",");

    service.insertActivityManage(shopId,proIds,courseIds,memberIds,serviceIds,activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,describe,status, function (err, results) {
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
    var memberCardType = commonUtil.array2Str(memberCardTypeArray,",");

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
    var proIds = commonUtil.array2Str(proIdArray,",");
    //可选择的课程
    var courseIdArray = req.body.courseId ? req.body.courseId : '';
    var courseIds = commonUtil.array2Str(courseIdArray,",");
    //可参与活动的会员
    var memberIdArray = req.body.memberId ? req.body.memberId : '';
    var memberIds = commonUtil.array2Str(memberIdArray,",");
    //可选择的服务
    var serviceIdArray = req.body.serviceId ? req.body.serviceId : '';
    var serviceIds = commonUtil.array2Str(serviceIdArray,",");
    service.updateActivityManage(id,activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,describe,status,proIds,courseIds,memberIds,serviceIds, function (err, results) {
        if (!err) {
            service.delActivityManageMX(id);
            service.insertActivityMX(id,arr,function (err, results) {
                if (!err) {
                    res.redirect('/jinquan/activity_manage_list?replytype=update');
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
            res.render('activityManage/activityManageDetail', {data : results});

        } else {
            next();
        }
    })
}
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';
    service.fetchSingleActivityManage(id, function(err, results) {
        if (!err) {
            res.render('activityManage/activityManageEdit', {data : results,"discountNames":consts.DISCOUNT_NAMES,"discountValues":consts.DISCOUNT_VALUES});

        } else {
            next();
        }
    })
}
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delActivityManage(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/activity_manage_list?replytype=del');
        } else {
            next();
        }
    });

}


/**
 * 根据活动id，获取活动子表详情集合记录
 * @param req
 * @param res
 * @param next
 */
module.exports.fetchActivityManageById = function (req, res, next) {
    var activityId = req.body.activityId ? req.body.activityId : '';
    service.fetchActivityManageById(activityId,function(err, results) {
        if (!err) {
            var activity = results.activityData == null? {}:results.activityData[0];
            res.json({"activityManageMx":results.activityMxData,"activity":activity});
        } else {
            next();
        }
    });
}
