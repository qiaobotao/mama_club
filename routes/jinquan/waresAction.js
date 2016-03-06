/**
 * Created by qiaojoe on 15-12-12.
 * 商品Action
 */

var service = require('../../model/service/wares');

/**
 * 商品展示首页list
 * @param req
 * @param res
 */
module.exports.list = function (req, res, next) {

    var name = req.query.name ? req.query.name : '';    // 商品名称
    var classifyId = req.query.id ? req.query.id : '';  // 商品分类
    var currentPage = req.query.page ? req.query.page : '1';

    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';

    service.list(name,classifyId,currentPage,function(err, results){
        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.classifyId = classifyId;
            service.getWaresClassify(function(err,classify) {
                if (!err) {
                    results.classify = classify;
                    res.render('wares/waresList', {data : results, replytype :replytype});
                } else {
                    console.log(err);
                    next();
                }
            });
        } else {
            console.log(err);
            next();
        }
    });
}
/**
 * 选择商品list页
 * @param req
 * @param res
 */
module.exports.modular = function (req, res, next) {

    var name = req.query.name ? req.query.name : '';    // 商品名称
    var classifyId = req.query.id ? req.query.id : '';  // 商品分类
    var currentPage = req.query.page ? req.query.page : '1';

    service.list(name,classifyId,currentPage,function(err, results){
        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.classifyId = classifyId;
            service.getWaresClassify(function(err,classify) {
                if (!err) {
                    results.classify = classify;
                    res.render('wares/waresModular', {data : results});
                } else {
                    console.log(err);
                    next();
                }
            });
        } else {
            console.log(err);
            next();
        }
    });
}

module.exports.preAdd = function (req, res, next) {

    service.getWaresClassify(function(err, results) {

        if (!err) {
            res.render('wares/waresAdd', {data : results});
        } else {
            next();
        }
    })
}

module.exports.add = function (req, res, next) {

    var serial = req.body.serial ? req.body.serial : '';
    var name = req.body.name ? req.body.name : '';
    var longname = req.body.longname ? req.body.longname : '';
    var brand = req.body.brand ? req.body.brand : '';
    var cid = req.body.cid ? req.body.cid : '';
    var standard = req.body.standard ? req.body.standard : '';
    var remarks = req.body.remarks ? req.body.remarks  : '';
    var lowdata = req.body.lowdata ? req.body.lowdata : '';

    service.insertWares(name,longname,brand,standard,serial,remarks,lowdata,cid,function(err, results) {
        if (!err) {
            res.redirect('/jinquan/wares_list?replytype=add');
        } else {
            next();
        }
    })
}

/**
 * 查看商品详情
 * @param req
 * @param res
 */
module.exports.detail = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleWares(id, function(err, results){

        if (!err && results.length != 0) {
            var wares = results[0];
            res.render('wares/waresDetail', {wares : wares});
        } else {
            next();
        }
    });
}

/**
 * 编辑商品
 * @param req
 * @param res
 */
module.exports.preEdit = function (req, res, next) {

    var id = req.query.id ? req.query.id : 0;
    service.fetchSingleWares(id, function(err, results){

        if (!err && results.length != 0) {
            var wares = results[0];
            service.getWaresClassify(function(err, classifys) {
                if (!err) {
                    res.render('wares/waresEdit', {wares : wares, classifys : classifys});
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
 * 修改商品
 * @param req
 * @param res
 */
module.exports.waresUpdate = function (req, res, next) {

    var id = req.body.id ? req.body.id : '';
    var serial = req.body.serial ? req.body.serial : '';
    var name = req.body.name ? req.body.name : '';
    var longname = req.body.longname ? req.body.longname : '';
    var brand = req.body.brand ? req.body.brand : '';
    var cid = req.body.cid ? req.body.cid : '';
    var standard = req.body.standard ? req.body.standard : '';
    var remarks = req.body.remarks ? req.body.remarks  : '';
    var lowdata = req.body.lowdata ? req.body.lowdata : '';

    service.updateWares(id,name,longname,brand,standard,serial,remarks,lowdata,cid, function(err, results) {

        if (!err) {
            res.redirect('/jinquan/wares_list?replytype=update');
        } else {
            next();
        }
    })

}

module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.delWares(id, function(err, results) {
        if (!err) {
            res.redirect('/jinquan/wares_list?replytype=del');
        } else {
            next();
        }
    })

}

module.exports.select = function (req, res, next) {

    var name = req.query.name ? req.query.name : '';    // 商品名称
    var classifyId = req.query.id ? req.query.id : '';  // 商品分类
    var currentPage = req.query.page ? req.query.page : '1';

    var index = req.query.index ? req.query.index : '';

    service.list(name,classifyId,currentPage,function(err, results){
        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.classifyId = classifyId;
            service.getWaresClassify(function(err,classify) {
                if (!err) {
                    results.classify = classify;
                    res.render('wares/waresSelect', {data : results, index : index});
                } else {
                    console.log(err);
                    next();
                }
            });
        } else {
            next();
        }
    });
}


/**
 * 出库时调用的选择页面数据
 * 从库存中查找
 * @param req
 * @param res
 * @param next
 */
module.exports.selectFromInventory = function (req, res, next) {

    var sid = req.query.sid ? req.query.sid : '';
    var name = req.query.name ? req.query.name : '';    // 商品名称
    var classifyId = req.query.id ? req.query.id : '';  // 商品分类
    var currentPage = req.query.page ? req.query.page : '1';

    var index = req.query.index ? req.query.index : '';

    service.listByInventory(sid,name,classifyId,currentPage,function (err, results) {

        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.classifyId = classifyId;
            service.getWaresClassify(function(err,classify) {
                if (!err) {
                    results.classify = classify;
                    res.render('wares/waresSelectFromInventory', {data : results, index : index, sid : sid});
                } else {
                    console.log(err);
                    next();
                }
            });
        } else {
            next();
        }

    });
}


