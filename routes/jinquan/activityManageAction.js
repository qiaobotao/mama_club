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


module.exports.list = function (req, res,next) {
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
    service.fetchAllActivityManage(activityName,activityType,effectiveTimeStart,effectiveTimeEnd,status,currentPage, function (err, results) {
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
    var activityName = req.body.activityName ? req.body.activityName : '';
    var activityType = req.body.activityType ? req.body.activityType : '';
    var memberCardTypeArray = req.body.memberCardType ? req.body.memberCardType : '';
    var memberCardType = '';
    if (memberCardTypeArray instanceof Array) {
        for (var i=0;i<memberCardTypeArray.length;i++)
        {
            memberCardType +=memberCardTypeArray[i]+',';
        }
        memberCardType =memberCardType.substr(0,memberCardType.length-1);
    }else{
        memberCardType=  memberCardTypeArray;

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
    if (proIdArray instanceof Array) {
        for (var i=0;i<proIdArray.length;i++)
        {
            proIds +=proIdArray[i]+',';
        }
        proIds =proIds.substr(0,proIds.length-1);
    }else{
        proIds=  proIdArray;

    }
    //可选择的课程
    var courseIdArray = req.body.courseId ? req.body.courseId : '';
    var courseIds = '';
    if (courseIdArray instanceof Array) {
        for (var i=0;i<courseIdArray.length;i++)
        {
            courseIds +=courseIdArray[i]+',';
        }
        courseIds =courseIds.substr(0,courseIds.length-1);

    }else{
        courseIds=  courseIdArray;

    }
    //可参与活动的会员
    var memberIdArray = req.body.memberId ? req.body.memberId : '';
    var memberIds = '';
    if (memberIdArray instanceof Array) {
        for (var i=0;i<memberIdArray.length;i++)
        {
            memberIds +=memberIdArray[i]+',';
        }
        memberIds =memberIds.substr(0,memberIds.length-1);
    }else{
        memberIds=  memberIdArray;
    }
    //可选择的服务
    var serviceIdArray = req.body.serviceId ? req.body.serviceId : '';
    var serviceIds = '';
    if (serviceIdArray instanceof Array) {
        for (var i=0;i<serviceIdArray.length;i++)
        {
            serviceIds +=serviceIdArray[i]+',';
        }
        serviceIds =serviceIds.substr(0,serviceIds.length-1);
    }else{
        serviceIds=  serviceIdArray;

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
    if (memberCardTypeArray instanceof Array) {
        for (var i=0;i<memberCardTypeArray.length;i++)
        {
            memberCardType +=memberCardTypeArray[i]+',';
        }
        memberCardType =memberCardType.substr(0,memberCardType.length-1);
    }else{
        memberCardType=  memberCardTypeArray;

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
    if (proIdArray instanceof Array) {
        for (var i=0;i<proIdArray.length;i++)
        {
            proIds +=proIdArray[i]+',';
        }
        proIds =proIds.substr(0,proIds.length-1);
    }else{
        proIds=  proIdArray;

    }
    //可选择的课程
    var courseIdArray = req.body.courseId ? req.body.courseId : '';
    var courseIds = '';
    if (courseIdArray instanceof Array) {
        for (var i=0;i<courseIdArray.length;i++)
        {
            courseIds +=courseIdArray[i]+',';
        }
        courseIds =courseIds.substr(0,courseIds.length-1);

    }else{
        courseIds=  courseIdArray;

    }
    //可参与活动的会员
    var memberIdArray = req.body.memberId ? req.body.memberId : '';
    var memberIds = '';
    if (memberIdArray instanceof Array) {
        for (var i=0;i<memberIdArray.length;i++)
        {
            memberIds +=memberIdArray[i]+',';
        }
        memberIds =memberIds.substr(0,memberIds.length-1);
    }else{
        memberIds=  memberIdArray;
    }
    //可选择的服务
    var serviceIdArray = req.body.serviceId ? req.body.serviceId : '';
    var serviceIds = '';
    if (serviceIdArray instanceof Array) {
        for (var i=0;i<serviceIdArray.length;i++)
        {
            serviceIds +=serviceIdArray[i]+',';
        }
        serviceIds =serviceIds.substr(0,serviceIds.length-1);
    }else{
        serviceIds=  serviceIdArray;

    }

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
