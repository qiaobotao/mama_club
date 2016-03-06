/**
 * Created by kuanchang on 16/1/20.
 */

var service_storeroom = require('../../model/service/storeroom');
var service = require('../../model/service/storeroomMove');

/**
 * 获取移库列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res, next) {

        var oper = req.query.oper ? req.query.oper : ''; // 经办人
        var outId = req.query.outId ? req.query.outId : '';// 出库房
        var inId = req.query.inId ? req.query.inId : ''; // 入库房
        var moveDate = req.query.moveDate ? req.query.moveDate : ''; // 入库房
        var currentPage = req.query.page ? req.query.page : '1';

        // 接收操作参数
        var replytype = req.query.replytype ? req.query.replytype : '';

        service.list(outId,oper,inId,moveDate,currentPage, function(err, results) {
            if (!err) {
                for (var i=0;i<results.data.length;i++) {
                    var dateline = results.data[i].moveDate;
                    if (dateline != '') {
                        var temp = moment(dateline).format('YYYY-MM-DD');
                        results.data[i].moveDate = temp;
                    }
                }
                results.currentPage = currentPage;
                results.oper = oper;
                results.outId = outId;
                results.inId =inId;
                results.moveDate = moveDate;

                service_storeroom.getAllStorerooms(function(err, storerooms){

                    if (!err) {
                        results.storerooms = storerooms;
                        res.render('storeroomMove/storeroomMoveList', {data : results, replytype : replytype});
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
 * 增加移库单
 * @param req
 * @param res
 */
module.exports.preadd = function (req, res, next) {

    service_storeroom.getAllStorerooms(function (err, storerooms) {

        if (!err) {
            res.render('storeroomMove/storeroomMoveAdd', {data : storerooms});
        } else {
            next();
        }
    });
}


module.exports.add = function (req, res, next) {



}