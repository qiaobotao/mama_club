/**
 * Created by kuanchang on 16/1/20.
 */


var service = require('../../model/service/storeroomOut');
var storeroomService = require('../../model/service/storeroom');

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


    service.list(outType,oper,outDate,currentPage,function (err, results) {

        if (!err) {
            results.currentPage = currentPage;
            results.oper = oper;
            results.outType = outType;
            results.outDate =outDate;

            service.getOutTypeClassify(function (err, outTypeClassify) {

                if (!err) {
                    results.outTypeClassify = outTypeClassify;
                    res.render('storeroomOut/storeroomOutList',{data : results});
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

    service.getOutTypeClassify(function (err, outTypeClassify) {

        if (!err) {
            var data = {};
            data.outTypeClassify = outTypeClassify;
            storeroomService.getAllStorerooms(function (err, storerooms) {

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

module.exports.add = function (req, res, next) {

}