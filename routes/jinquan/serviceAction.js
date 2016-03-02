/**
 * Created by kuanchang on 16/1/18.
 */

var service = require('../../model/service/service');

/**
 * 获取服务列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res, next) {

    var name = req.query.name ? req.query.name : '';    // 服务名称
    var classifyId = req.query.id ? req.query.id : '';  // 服务分类
    var currentPage = req.query.page ? req.query.page : '1';

    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';

    service.list(name,classifyId,currentPage, function(err, results) {

        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.classifyId = classifyId;
            service.getServiceClassify(function(err,classify) {

                if (!err) {
                    results.classify = classify;
                    res.render('service/serviceList', {data : results, replytype : replytype});
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
 * 增加服务
 * @param req
 * @param res
 */
module.exports.preAdd = function (req, res, next) {

   service.getServiceClassify(function(err, results) {

       if (!err) {
           res.render('service/serviceAdd', {data : results});
       } else {
           next();
       }
   })
}

/**
 * 增加服务表单
 * @param req
 * @param res
 */
module.exports.add = function (req, res, next) {

    var name = req.body.name ? req.body.name : '';
    var content = req.body.content ? req.body.content : '';
    var cid = req.body.cid ? req.body.cid : '';
    var price = req.body.price ? req.body.price : '';
    var remark = req.body.remark ? req.body.remark : '';

    service.add(name,content,cid,price,remark,function(err, results) {
        if (!err) {
            res.redirect('/jinquan/service_list?replytype=add');
        } else {
            next();
        }
    });
}

/**
 * 查看
 * @param req
 * @param res
 */
module.exports.browse = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.getSingleService(id,function(err, results) {
        if (!err && results.length != 0) {
           res.render('service/serviceBrowse', {data : results[0]});
        } else {
            next();
        }
    })

}

module.exports.preEdit = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.getServiceClassify(function(err, classify) {

        if (!err) {
            service.getSingleService(id, function(err, results) {

                if (!err && results.length != 0) {
                    var service = results[0];
                    res.render('service/serviceEdit', {data : service , classifys : classify});

                } else {
                    next();
                }
            })
        } else {
            next();
        }
    })

}


module.exports.update = function(req, res, next) {

    var id = req.body.sid ? req.body.sid : '';
    var name = req.body.name ? req.body.name : '';
    var content = req.body.content ? req.body.content : '';
    var cid = req.body.cid ? req.body.cid : '';
    var price = req.body.price ? req.body.price : '';
    var remark = req.body.remark ? req.body.remark : '';

    service.update(id,name,content,cid,price,remark,function(err, results) {
        if (!err) {
             res.redirect('/jinquan/service_list?replytype=update');

        } else {
            next();
        }
    })
}

module.exports.del = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.del(id,function(err, results){

        if (!err) {
            res.redirect('/jinquan/service_list?replytype=del');
        } else {
            next();
        }
    });
}
module.exports.select = function(req, res, next) {

    var name = req.query.name ? req.query.name : '';    // 服务名称
    var classifyId = req.query.id ? req.query.id : '';  // 服务分类
    var currentPage = req.query.page ? req.query.page : '1';

    service.list(name,classifyId,currentPage, function(err, results) {

        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.classifyId = classifyId;
            service.getServiceClassify(function(err,classify) {

                if (!err) {
                    results.classify = classify;
                    res.render('service/serviceSelect', {data : results});
                } else {
                    next();
                }
            });
        } else {
            next();
        }

    });

}