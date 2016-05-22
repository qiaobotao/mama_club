/**
 * Created by qiaojoe on 15-12-12.
 * 库房管理，增删改查
 */

var service = require('../../model/service/storeroom');
var laypage = require('laypage');
var myUtils = require('../../common/utils');
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

    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    var resourcesData = req.session.user.resourcesData;

    service.list(shopId,name,classifyId,currentPage, function(err, results) {

        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.classifyId = classifyId;
            service.getStoreroomClassify(function(err,classify) {

                if (!err) {
                    results.classify = classify;
                    res.render('storeroom/storeroomList', {data : results, replytype : replytype,laypage: laypage({
                        curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
                    });
                } else {
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

    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    service.insertStoreroom(shopId,name, address, principal, tel, serial, cid, remarks, function(err, results) {
        if(!err) {
            res.redirect('/jinquan/storeroom_list?replytype=add');
        } else {
            myUtils.printSystemLog(err)
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
            myUtils.printSystemLog(err)
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
            myUtils.printSystemLog(err)
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
            myUtils.printSystemLog(err)
            next();
        }
    });

}

/**
 * 设置状态
 * @param req
 * @param res
 */
module.exports.setStatus = function(req, res,next) {

    var status = req.query.status ? req.query.status : 0;
    var id = req.query.id ?  req.query.id : 0;

    service.setStatus(id,status,function(err, results){
        if(!err) {
            res.redirect('/jinquan/storeroom_list');
        } else {
            myUtils.printSystemLog(err)
            next();
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
            myUtils.printSystemLog(err)
            next();
        }
    })
}

/**
 * 查看库房编号是否唯一
 */
module.exports.checkseril = function(req, res, next) {

    var seril = req.body.serial ? req.body.serial : '';
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    service.checkSeril(shopId,seril,function(err, results) {
        if (!err) {
            res.json({flag:results});
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    });
}

/**
 * 名称不得相同
 * @param req
 * @param res
 * @param next
 */
module.exports.checkName = function (req, res, next) {

    var name = req.body.name ? req.body.name : '';
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    service.checkName(shopId,name,function (err, results) {
        if (!err) {
            res.json({flag:results});
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    })
}

///**
// * 编辑教室的时候要形成一个入库单和一个出库单，
// * 对用户是不可见的，防止用户在做教室编辑的时候
// * 形成入库单而找不到原来的库，这里做删除限制，
// * 如果有教室的出库单关联的库房不能做删除处理
// * @param res
// * @param req
// * @param next
// */
//module.exports.delCheck = function(req, res, next) {
//
//    var id = req.body.id ? req.body.id : '';
//    service.check_del(id,function(err, flag) {
//        if (!err) {
//            res.json({flag : flag});
//        } else {
//            myUtils.printSystemLog(err)
//            next();
//        }
//    });
//}