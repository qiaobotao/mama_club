/**
 * Created by kuanchang on 16/1/20.
 */

var service_storeroom = require('../../model/service/storeroom');
var service = require('../../model/service/storeroomMove');
var moment = require('moment');
var laypage = require('laypage');
var myUtils = require('../../common/utils');

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
        var moveDateEnd = req.query.moveDateEnd ? req.query.moveDateEnd : '';
        var url = '/jinquan'+req.url;
        // 接收操作参数
        var replytype = req.query.replytype ? req.query.replytype : '';

        // 从session 中获取门店id
        var shopId = req.session.user.shopId;

    var resourcesData = req.session.user.resourcesData;


    service.list(shopId,outId,oper,inId,moveDate,moveDateEnd,currentPage, function(err, results) {
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
                results.moveDateEnd = moveDateEnd;
                service_storeroom.getAllStorerooms(shopId,function(err, storerooms){

                    if (!err) {
                        results.storerooms = storerooms;
                        res.render('storeroomMove/storeroomMoveList', {data : results, replytype : replytype,laypage: laypage({
                            curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData});
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
 * 增加移库单
 * @param req
 * @param res
 */
module.exports.preadd = function (req, res, next) {

    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    service_storeroom.getAllStorerooms(shopId,function (err, storerooms) {

        if (!err) {
            res.render('storeroomMove/storeroomMoveAdd', {data : storerooms});
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    });
}


module.exports.add = function (req, res, next) {

    var outId = req.body.outId ? req.body.outId : '';
    var inId = req.body.inId ? req.body.inId : '';
    var oper = req.body.oper ? req.body.oper : '';
    var remark = req.body.remark ? req.body.remark : '';

    // 商品数组
    var arr_proId = req.body.proId ? req.body.proId : '';
    var arr_proname = req.body.proname ? req.body.proname :'';
    var arr_proNo = req.body.proNo ? req.body.proNo : '';
    var arr_count = req.body.count ? req.body.count : '';
    // 处理数据
    var arr = new Array();

    if (arr_proId instanceof Array) {
        for (var i=0;i<arr_proId.length;i++) {
            var obj = {};
            obj.proId = arr_proId[i];
            obj.proName = arr_proname[i];
            obj.proSerial = arr_proNo[i];
            obj.count = arr_count[i];
            arr.push(obj);
        }
    } else {
        var obj = {};
        obj.proId = arr_proId;
        obj.proName = arr_proname;
        obj.proSerial = arr_proNo;
        obj.count = arr_count;
        arr.push(obj);
    }

   service.insertMoveLog(oper,outId,inId,remark,function(err, results) {

       if (!err) {
           var moveLogId = results.insertId;
           service.insertMoveLogMX(moveLogId,arr,function(err, results) {

               if (!err) {
                   service.updateInventory(outId,inId,arr,function(err, results) {
                      if (!err) {
                          res.redirect('/jinquan/storeroom_move_list?replytype=add');
                      } else {
                          service.delMoveLog(moveLogId);
                          service.delMoveLogMX(moveLogId);
                          myUtils.printSystemLog(err)
                          next();
                      }
                   })
               } else {
                   service.delMoveLog(moveLogId);
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

module.exports.detail = function (req, res, next) {

    var moveLogId = req.query.id ? req.query.id : '';

    service.detail(moveLogId, function (err, results) {

        if (!err) {
            res.render('storeroomMove/storeroomMoveDetail', {data : results});
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    });
}