/**
 * Created by kuanchang on 16/1/20.
 */


var service = require('../../model/service/storeroomOut');
var storeroomService = require('../../model/service/storeroom');
var moment = require('moment');
var laypage = require('laypage');
/**
 * 获取出库列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res, next) {

    var outType = req.query.outType ? req.query.outType : ''; // 出库方式
    var oper = req.query.oper ? req.query.oper : '';// 领取人
    var outDate = req.query.outDate ? req.query.outDate : ''; // 出库日期
    var currentPage = req.query.page ? req.query.page : '1';
    var url = '/jinquan'+req.url;
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';

    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    service.list(shopId,outType,oper,outDate,currentPage,function (err, results) {

        if (!err) {
            for (var i=0;i<results.data.length;i++) {
                var dateline = results.data[i].outDate;
                if (dateline != '') {
                    var temp = moment(dateline).format('YYYY-MM-DD');
                    results.data[i].outDate = temp;
                }
            }
            results.currentPage = currentPage;
            results.oper = oper;
            results.outType = outType;
            results.outDate =outDate;

            service.getOutTypeClassify(function (err, outTypeClassify) {

                if (!err) {
                    results.outTypeClassify = outTypeClassify;
                    res.render('storeroomOut/storeroomOutList',{data : results,replytype : replytype,laypage: laypage({
                        curr: currentPage,url: url,pages: results.totalPages})});
                } else {
                    next();
                }
            });
        } else {
            next();
        }
    });
}

/**
 * 增加出库单
 * @param req
 * @param res
 */
module.exports.preAdd = function (req, res, next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    service.getOutTypeClassify(function (err, outTypeClassify) {

        if (!err) {
            var data = {};
            data.outTypeClassify = outTypeClassify;
            storeroomService.getAllStorerooms(shopId,function (err, storerooms) {

                if (!err) {
                    data.storerooms = storerooms;
                    res.render('storeroomOut/storeroomOutAdd', {data : data});
                } else {
                    next();
                }
            });
        } else {
           next();
        }
    });
}

/**
 * 增加出库单
 * @param req
 * @param res
 * @param next
 */
module.exports.add = function (req, res, next) {

    var oper = req.body.oper ? req.body.oper : '';
    var outType = req.body.outType ? req.body.outType : '';
    var storeroom = req.body.storeroom ? req.body.storeroom : '';
    var remarks = req.body.remarks ? req.body.remarks : '';


    // 数组
    var arr_proId = req.body.proId ? req.body.proId : '';
    var arr_proname = req.body.proname ? req.body.proname :'';
    var arr_proNo = req.body.proNo ? req.body.proNo : '';
    var arr_count = req.body.count ? req.body.count : '';
    var arr_price = req.body.price ? req.body.price : '';

    // 处理数据
    var arr = new Array();

    if (arr_proId instanceof Array) {
        for (var i=0;i<arr_proId.length;i++) {
            var obj = {};
            obj.proId = arr_proId[i];
            obj.proName = arr_proname[i];
            obj.proSerial = arr_proNo[i];
            obj.count = arr_count[i];
            obj.price = arr_price[i];
            arr.push(obj);
        }
    } else {
        var obj = {};
        obj.proId = arr_proId;
        obj.proName = arr_proname;
        obj.proSerial = arr_proNo;
        obj.count = arr_count;
        obj.price = arr_price;
        arr.push(obj);
    }
    service.insertOutLog(oper,outType,new Date(),storeroom,remarks,function(err, results) {

        if (!err) {

            var outLogId = results.insertId;
            service.insertOutLogMX(outLogId,arr,function (err, results) {

                if (!err) {
                    service.updateInventory(storeroom,arr,function(err, results) {

                        if (!err) {
                            res.redirect('/jinquan/storeroom_out_list?replytype=add');

                        } else {
                            service.delOutLog(outLogId);
                            service.delOutLogMX(outLogId);
                            next();
                        }
                    });
                } else {
                    service.delOutLog(outLogId);
                    next();
                }
            })
        } else {
            next();
        }
    });
}

/**
 * 验证库存
 * @param req
 * @param res
 * @param next
 */
module.exports.checkResidue = function (req, res, next) {

    var num = req.body.num ? req.body.num : 0;
    var waresId = req.body.waresId ? req.body.waresId : '';
    var storeroomId = req.body.storeroomId ? req.body.storeroomId : '';

    service.checkResidue(storeroomId,waresId,num,function (err, flag) {
        if (!err) {
            res.json({flag : flag});
        } else {
          next();
        }
    });
}

/**
 * 出库详情
 * @param req
 * @param res
 * @param next
 */
module.exports.detail = function (req, res, next) {

    var outLogId = req.query.id ? req.query.id : '';

    service.detail(outLogId,function(err, results) {

        if (!err) {
            res.render('storeroomOut/storeroomOutDetail',{data : results});
        } else {
            next();
        }
    });



}