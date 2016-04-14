/**
 * Created by qiaojoe on 15-12-12.
 * 库房管理，增删改查
 */

var service = require('../../model/service/storeroom');
var laypage = require('laypage');
/**
 * 库房的增删改查
 * @param req
 * @param res
 */
module.exports.list = function (req, res,next) {

    var name = req.query.name ? req.query.name : '';    // 库房名称
    var classifyId = req.query.id ? req.query.id : '';  // 保存分类
    var currentPage = req.query.page ? req.query.page : '1';
    var url = '/jinquan'+req.url;
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';

    service.list(name,classifyId,currentPage, function(err, results) {

        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.classifyId = classifyId;
            service.getStoreroomClassify(function(err,classify) {

                if (!err) {
                    results.classify = classify;
                    res.render('storeroom/storeroomList', {data : results, replytype : replytype,laypage: laypage({
                        curr: currentPage,url: url,pages: results.totalPages})
                    });
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
 * 修改库房信息
 * @param req
 * @param res
 */
module.exports.preEdit = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.getStoreroomClassify(function(err, classify) {

        if (!err) {
            service.fetchSingleStoreroom(id, function(err, results) {

                if (!err && results.length != 0) {
                    var service = results[0];
                    res.render('storeroom/storeroomEdit', {data : service , classifys : classify});

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
 * 增加库房
 * @param req
 * @param res
 */
module.exports.add = function (req, res, next) {

    var serial = req.body.serial ? req.body.serial : '';
    var name = req.body.name ? req.body.name : '';
    var principal = req.body.principal ? req.body.principal : '';
    var cid = req.body.cid ? req.body.cid : '';
    var tel = req.body.tel ? req.body.tel : '';
    var address = req.body.address ? req.body.address : '';
    var remarks = req.body.remarks ? req.body.remarks : '';


    service.insertStoreroom(name, address, principal, tel, serial, cid, remarks, function(err, results) {
        if(!err) {
            res.redirect('/jinquan/storeroom_list?replytype=add');
        } else {
           next();
        }
    });
}

/**
 * 增加库房
 * @param req
 * @param res
 */
module.exports.preAdd = function(req, res, next) {

    service.getStoreroomClassify(function(err, results) {

        if (!err) {
            res.render('storeroom/storeroomAdd', {data : results});
        } else {
            next();
        }
    })

}

/**
 * 删除库存为0的库房
 * 库房有数据不能删除
 * @param req
 * @param res
 */
module.exports.del = function(req, res, next) {

    var id = req.query.id ? req.query.id : 0;
    service.delStoreroom(id, function(err, results){

        if (!err) {
            res.redirect('/jinquan/storeroom_list?replytype=del');
        } else {
            next();
        }
    });
}

/**
 * 保存修改
 * @param req
 * @param res
 */
module.exports.update = function(req, res, next) {

    var id = req.body.sid ? req.body.sid : 0;
    var serial = req.body.serial ? req.body.serial : '';
    var name = req.body.name ? req.body.name : '';
    var principal = req.body.principal ? req.body.principal : '';
    var cid = req.body.cid ? req.body.cid : '';
    var tel = req.body.tel ? req.body.tel : '';
    var address = req.body.address ? req.body.address : '';
    var remarks = req.body.remarks ? req.body.remarks : '';

    service.updateStoreroom(id,name,address,principal, serial, cid, tel, remarks, function(err, results){

        if(!err) {
            res.redirect('/jinquan/storeroom_list?replytype=update');
        } else {
            next();
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
module.exports.detail = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleStoreroom(id,function(err, results) {
        if (!err && results.length != 0) {
            res.render('storeroom/storeroomDetail', {data : results[0]});
        } else {
            next();
        }
    })
}