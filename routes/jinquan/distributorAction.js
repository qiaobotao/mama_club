/**
 * Created by kuanchang on 16/1/20.
 */

var service = require('../../model/service/distributor');
var laypage = require('laypage');
/**
 * 获取经销商列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res, next) {

    var name = req.query.name ? req.query.name : '';    // 经销商名称
    var classifyId = req.query.id ? req.query.id : '';  // 经销商分类
    var currentPage = req.query.page ? req.query.page : '1';
    var url = '/jinquan'+req.url;
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var resourcesData = req.session.user.resourcesData;
    service.list(name,classifyId,currentPage, function(err, results) {

        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.classifyId = classifyId;
            service.getDistributorClassify(function(err,classify) {

                if (!err) {
                    results.classify = classify;
                    res.render('distributor/distributorList', {data : results, replytype : replytype,laypage: laypage({
                        curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
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
 * 增加经销商
 * @param req
 * @param res
 */
module.exports.preadd = function (req, res, next) {

    service.getDistributorClassify(function(err, results) {

        if (!err) {
            res.render('distributor/distributorAdd', {data : results});
        } else {
            next();
        }
    });
}


module.exports.add = function (req, res, next) {

    var name = req.body.name ? req.body.name : '';
    var cid = req.body.cid ? req.body.cid : '';
    var remarks = req.body.remark ? req.body.remark : '';
    var principal = req.body.principal ? req.body.principal : '';
    var tel = req.body.tel ? req.body.tel : '';
    var address = req.body.address ? req.body.address : '';

    service.add(name, address, remarks,cid, principal, tel,function(err, results) {
        if (!err) {
            res.redirect('/jinquan/distributor_list?replytype=add');
        } else {
            next();
        }
    });

}

module.exports.detail = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.getSingleDistributor(id,function(err, results) {
        if (!err && results.length != 0) {
            res.render('distributor/distributorDetail', {data : results[0]});
        } else {
            next();
        }
    })

}

module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.del(id,function(err, results){

        if (!err) {
            res.redirect('/jinquan/distributor_list?replytype=del');
        } else {
            next();
        }
    });

}

module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.getDistributorClassify(function(err, classify) {

        if (!err) {
            service.getSingleDistributor(id, function(err, results) {

                if (!err && results.length != 0) {
                    var service = results[0];
                    res.render('distributor/distributorEdit', {data : service , classifys : classify});

                } else {
                    next();
                }
            })
        } else {
            next();
        }
    })

}

module.exports.update = function (req, res, next) {

    var id = req.body.did ? req.body.did : '';
    var name = req.body.name ? req.body.name : '';
    var cid = req.body.cid ? req.body.cid : '';
    var principal = req.body.principal ? req.body.principal : '';
    var tel = req.body.tel ? req.body.tel : '';
    var address = req.body.address ? req.body.address : '';
    var remark = req.body.remark ? req.body.remark : '';


    service.update(id,name,cid,principal,tel,address,remark,function(err, results) {
        if (!err) {
            res.redirect('/jinquan/distributor_list?replytype=update');

        } else {
            next();
        }
    })

}