/**
 * Created by kuanchang on 16/1/20.
 */

var service = require('../../model/service/storeroomIn');
var storeroomService = require('../../model/service/storeroom');
var distributorService = require('../../model/service/distributor');

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

    service.list(buyer,buyType,buyDate,currentPage, function(err, results) {

        if (!err) {
            results.currentPage = currentPage;
            results.buyer = buyer;
            results.buyType = buyType;
            results.buyDate =buyDate;

            service.getBuyTypeClassify(function(err, buyTypeClassify){

                if (!err) {
                    results.buyTypeClassify = buyTypeClassify;
                    service.getInTypeClassify(function(err, inTypeClassify) {
                        if (!err) {
                            results.inTypeClassify = inTypeClassify;
                            res.render('storeroomIn/storeroomInList', {data : results});
                        } else {
                            next();
                        }
                    })
                } else {
                    next();
                }
            })
        } else {
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

    service.getBuyTypeClassify(function (err, buyTypeClassify) {

        if (!err) {
            var data = {};
            data.buyTypeClassify = buyTypeClassify;
            service.getInTypeClassify(function(err, inTypeClassify) {
                if (!err) {
                    data.inTypeClassify = inTypeClassify;
                    storeroomService.getAllStorerooms(function(err, storerooms) {
                        if (!err) {
                            data.storerooms = storerooms;
                            distributorService.getAllDistributors(function (err, distributors) {
                                if (!err) {
                                    data.distributors =  distributors;
                                    res.render('storeroomIn/storeroomInAdd',{data : data});
                                } else {
                                    next();
                                }
                            })
                        } else {
                            next();
                        }
                    })
                } else {
                    next();
                }
            })
        } else {
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
    var arr_proname = req.body.proname ? req.body.proname :'';
    var proNo = req.body.proNo ? req.body.proNo : '';
    var count = req.body.count ? req.body.count : '';
    var price = req.body.price ? req.body.price : '';





}