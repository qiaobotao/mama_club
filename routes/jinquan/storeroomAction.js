/**
 * Created by qiaojoe on 15-12-12.
 * 库房管理，增删改查
 */

var service = require('../../model/service/storeroom');

/**
 * 库房的增删改查
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {

    service.fetchAllStorerooms(function(err, results){
        if (!err) {
            res.render('storeroom/storeroomList', {storerooms : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}

/**
 * 修改库房信息
 * @param req
 * @param res
 */
module.exports.preEdit = function (req, res) {

    var id = req.query.id ? req.query.id : 0;
    service.fetchSingleStoreroom(id, function(err, results) {
        if (!err) {
            var storeroom = results.length == 0 ? null : results[0];
            res.render('storeroom/storeroomEdit', {storeroom : storeroom});
        } else {
            console.log(err.message);
            res.render('error');
        }
    });
}

/**
 * 增加库房
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {

    var name = req.body.name ? req.body.name : '';
    var address = req.body.address ? req.body.address : '';
    var principal = req.body.principal ? req.body.principal : '';
    var status = req.body.roomstatus ? req.body.roomstatus : 1;

    service.insertStoreroom(name, address, principal, status, function(err, results) {
        if(!err) {
            res.redirect('/jinquan/storeroom_list');
        } else {
            console.log(err.message);
            res.render('error');
        }
    });
}

/**
 * 增加库房
 * @param req
 * @param res
 */
module.exports.preAdd = function(req, res) {

    res.render('storeroom/storeroomAdd');

}

/**
 * 删除库存为0的库房
 * 库房有数据不能删除
 * @param req
 * @param res
 */
module.exports.del = function(req, res) {

    var id = req.query.id ? req.query.id : 0;
    service.delStoreroom(id, function(err, results){



    });
}

/**
 * 保存修改
 * @param req
 * @param res
 */
module.exports.update = function(req, res) {

    var id = req.body.id ? req.body.id : 0;
    var name = req.body.name ? req.body.name : '';
    var address = req.body.address ? req.body.address : '';
    var principal = req.body.principal ? req.body.principal : '';
    var status = req.body.roomstatus ? req.body.roomstatus : 1;

    service.updateStoreroom(id,name,address,principal,status,function(err, results){

        if(!err) {
            res.redirect('/jinquan/storeroom_list');
        } else {
            console.log(err.message);
            res.render('error');
        }
    });

}

/**
 * 设置状态
 * @param req
 * @param res
 */
module.exports.setStatus = function(req, res) {

    var status = req.query.status ? req.query.status : 0;
    var id = req.query.id ?  req.query.id : 0;

    service.setStatus(id,status,function(err, results){
        if(!err) {
            res.redirect('/jinquan/storeroom_list');
        } else {
            console.log(err.message);
            res.render('error');
        }
    });

}

/*
 * 查看库房明细
 * @param req
 * @param res
 */
module.exports.detailed = function(req, res) {
    res.render('distributor/distributorDetailed');
}