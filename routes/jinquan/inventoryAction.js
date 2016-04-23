/**
 * Created by qiaojoe on 16-3-12.
 */

var service = require('../../model/service/inventory');
var service_storeroom = require('../../model/service/storeroom');
var laypage = require('laypage');
module.exports.list = function (req, res, next) {

    var sid = req.query.sid ? req.query.sid : ''; // 入库房
    var currentPage = req.query.page ? req.query.page : '1';
    var url = '/jinquan'+req.url;

    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    service.list(shopId,sid,currentPage, function(err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.sid = sid;
            service_storeroom.getAllStorerooms(shopId,function(err, storerooms){

                if (!err) {
                    results.storerooms = storerooms;
                    res.render('inventory/inventoryList', {data : results,laypage: laypage({
                        curr: currentPage,url: url,pages: results.totalPages})});
                } else {
                    next();
                }
            })
        } else {
            next();
        }
    });

}
