
var laypage = require('laypage');
var serviceMeetService = require('../../model/service/servicemeet');
var nursService = require('../../model/service/nursservice');
var commonUtil = require('../../model/utils/common');//公共类
var consts = require('../../model/utils/consts');
/**
 * 查看回访单list列表
 * @param req
 * @param res
 * @param next
 */
module.exports.list = function (req, res,next) {


    var shopId = req.session.user.shopId;
    var name = req.query.name ? req.query.name : '';
    var principal = req.query.principal ? req.query.principal : '';
    var serviceDate = req.query.serviceDate ? req.query.serviceDate : '';
    var currentPage = req.query.page ? req.query.page : 1;
    currentPage =currentPage<1?1:currentPage;
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;
    nursService.fetchAllReturnVisit(shopId,name,principal,serviceDate,currentPage, function (err, results) {
        if (!err) {
            results.name = name;
            results.principal = principal;
            results.serviceDate = serviceDate;
            results.currentPage = currentPage;
            res.render('returnVisit/returnVisitList', {data : results, replytype : replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
            });
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}

/**
 * 保存回访单数据
 * @param req
 * @param res
 * @param next
 */
module.exports.doEdit = function (req, res,next) {
    var id = req.body.id ? req.body.id : '';
    var returnVisitDate = req.body.returnVisitDate ? req.body.returnVisitDate : '';//回访日期
    var returnVisitTypeTemp = req.body.returnVisitType ? req.body.returnVisitType : '';//回访方式
    var returnVisitType = commonUtil.array2Str(returnVisitTypeTemp,",");
    var state = consts.NURS_STATE_5;//回访结束
    if(returnVisitType=='无应答'){
        state = consts.NURS_STATE_4;//已回访未接电话
    }
    var returnVisitStaffId = req.body.returnVisitStaffId ? req.body.returnVisitStaffId : '';//回访人
    var returnVisitResult = req.body.returnVisitResult ? req.body.returnVisitResult : '';//回访结果

    nursService.updateReturnVisit(id,returnVisitDate,returnVisitType,returnVisitStaffId,returnVisitResult,state, function (err, results) {
        if (!err) {
            res.redirect('/jinquan/return_visit_list?replytype=update');
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}

/**
 * 进入编辑页面
 * @param req
 * @param res
 * @param next
 */
module.exports.preEdit = function(req, res, next) {


    var id = req.query.id ? req.query.id : '';
    var show = req.query.show ? req.query.show : '';
    var openWindow = req.query.openWindow ? req.query.openWindow : '';//通过弹出层打开

    nursService.fetchSingleNursService(id, function(err, results) {
        if (!err) {
            var nursService = results.nursService.length == 0 ? null : results.nursService[0];
            var outLogId =nursService.outLogId;
            var dictData = results;
            var serviceArr = results.moneyManageServicesData.length > 0 ? results.moneyManageServicesData:{};//收费单（服务子表）单独处理
            var proArr = results.moneyManageWaresData.length > 0 ? results.moneyManageWaresData:{};//收费单（商品子表）单独处理
            res.render('returnVisit/returnVisitEdit', {
                nursService : nursService,
                data : results,
                dictData : dictData,
                show:show,
                openWindow:openWindow,
                serviceArr:serviceArr,
                proArr:proArr
            });
        } else {
            next();
        }
    });
}