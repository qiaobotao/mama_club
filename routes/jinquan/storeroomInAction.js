/**
 * Created by kuanchang on 16/1/20.
 */

var service = require('../../model/service/storeroomIn');
var storeroomService = require('../../model/service/storeroom');
var distributorService = require('../../model/service/distributor');
var moment = require('moment');
var laypage = require('laypage');
var myUtils = require('../../common/utils');
/**
 * 获取入库列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res, next) {

    var buyer = req.query.buyer ? req.query.buyer : ''; // 采购人
    var buyType = req.query.buyType ? req.query.buyType : '';// 采购方式
    var buyDate = req.query.buyDate ? req.query.buyDate : ''; // 采购日期
    var currentPage = req.query.page ? req.query.page : '1';
    var url = '/jinquan'+req.url;
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';

    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var resourcesData = req.session.user.resourcesData;


    service.list(shopId,buyer,buyType,buyDate,currentPage, function(err, results) {
        if (!err) {
            for (var i=0;i<results.data.length;i++) {
                var dateline = results.data[i].buyDate;
                if (dateline != '') {
                    var temp = moment(dateline).format('YYYY-MM-DD');
                    results.data[i].buyDate = temp;
                }
            }
            results.currentPage = currentPage;
            results.par_buyer = buyer;
            results.par_buyType = buyType;
            results.par_buyDate =buyDate;

            service.getBuyTypeClassify(function(err, buyTypeClassify){

                if (!err) {
                    results.buyTypeClassify = buyTypeClassify;
                    service.getInTypeClassify(function(err, inTypeClassify) {
                        if (!err) {
                            results.inTypeClassify = inTypeClassify;
                            res.render('storeroomIn/storeroomInList', {data : results, replytype : replytype,laypage: laypage({
                                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
                            });
                        } else {
                            myUtils.printSystemLog(err)
                            next();
                        }
                    })
                } else {
                    myUtils.printSystemLog(err)
                    next();
                }
            })
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    });
}

/**
 * 增加入库单
 * @param req
 * @param res
 */
module.exports.preAdd = function (req, res, next) {

    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    service.getBuyTypeClassify(function (err, buyTypeClassify) {

        if (!err) {
            var data = {};
            data.buyTypeClassify = buyTypeClassify;
            service.getInTypeClassify(function(err, inTypeClassify) {
                if (!err) {
                    data.inTypeClassify = inTypeClassify;
                    storeroomService.getAllStorerooms(shopId,function(err, storerooms) {
                        if (!err) {
                            data.storerooms = storerooms;
                            distributorService.getAllDistributors(function (err, distributors) {
                                if (!err) {
                                    data.distributors =  distributors;
                                    res.render('storeroomIn/storeroomInAdd',{data : data});
                                } else {
                                    myUtils.printSystemLog(err)
                                    next();
                                }
                            })
                        } else {
                            myUtils.printSystemLog(err)
                            next();
                        }
                    })
                } else {
                    myUtils.printSystemLog(err)
                    next();
                }
            })
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    })
}

/**
 * 增加库存
 * @param req
 * @param res
 * @param next
 */
module.exports.add = function (req, res, next) {

    var buyer = req.body.buyer ? req.body.buyer : '';
    var buyType = req.body.buyType ? req.body.buyType : '';
    var distributor = req.body.distributor ? req.body.distributor : '';
    var storeroom = req.body.storeroom ? req.body.storeroom : '';
    var inType = req.body.inType ? req.body.inType : '';
    var remark = req.body.remark ? req.body.remark : '';

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


    service.insertInLog(buyType,inType,buyer,new Date(),storeroom,distributor,remark,function(err, results) {

        if (!err) {
            var logId = results.insertId; // 主表id
            service.insertInLogMX(logId,arr,function (err, results) {
                if (!err) {
                    service.insertInventory(storeroom,arr,function(err, results) {

                        if (!err) {

                            res.redirect('/jinquan/storeroom_in_list?replytype=add');

                        } else {
                            service.delInLog(logId);
                            service.delInLogMX(logId);
                            myUtils.printSystemLog(err)
                            next();
                        }
                    });

                } else { // 如果入库详情出现错误，则将主表记录同时删除
                    service.delInLog(logId);
                    myUtils.printSystemLog(err)
                    next();
                }
            });
        } else {
            myUtils.printSystemLog(err)
           next();
        }
    });
}

/**
 * 浏览入库单
 * @param req
 * @param res
 * @param next
 */
module.exports.detail = function (req, res, next) {

    var inLogId = req.query.id ? req.query.id : ''; // 入库单id

    service.detail(inLogId,function(err, results) {

        if (!err) {
            res.render('storeroomIn/storeroomInDetail',{data : results});
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    });
}