/**
 * Created by kuanchang on 16/1/13.
 */

/**
 * 获取活动列表
 * @param req
 * @param res
 */

var service = require('../../model/service/activityManage');

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
            memberCardType += x + ';';
        }
    }
    var effectiveTimeStart = req.body.effectiveTimeStart ? req.body.effectiveTimeStart : '';
    var effectiveTimeEnd = req.body.effectiveTimeEnd ? req.body.effectiveTimeEnd : '';
    var describe = req.body.describe ? req.body.describe : '';
    var status = req.body.status ? req.body.status : '';

    service.insertActivityManage(activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,describe,status, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/activity_manage_list');
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
            memberCardType += x + ';';
        }
    }
    var effectiveTimeStart = req.body.effectiveTimeStart ? req.body.effectiveTimeStart : '';
    var effectiveTimeEnd = req.body.effectiveTimeEnd ? req.body.effectiveTimeEnd : '';
    var describe = req.body.describe ? req.body.describe : '';
    var status = req.body.status ? req.body.status : '';

    service.updateActivityManage(id,activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,describe,status, function (err, results) {
        if (!err) {
            res.redirect('/jinquan/activity_manage_list');
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