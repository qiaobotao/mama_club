/**
 * Created by qiaojoe on 16/4/23.
 */

var laypage = require('laypage');
var service = require('../../model/service/brand');
var distr_service = require('../../model/service/distributor');


module.exports.list = function (req, res,next) {

    var did = req.query.did ? req.query.did : '';

    var url = '/jinquan'+req.url;
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var currentPage = req.query.page ? req.query.page : '1';

    service.getAllBrand(did,currentPage,function (err, results) {
        if (!err) {
            distr_service.getAllDistributors(function(err, resu) {
                if (!err) {
                    results.did = did;
                    results.currentPage = currentPage;
                    results.distributors = resu;
                    res.render('brand/brandList', {data : results, replytype : replytype,laypage: laypage({
                        curr: currentPage,url: url,pages: results.totalPages})});
                } else {
                    console.log(err);
                    next();
                }
            })
        } else {
            console.log(err);
            next();
        }
    });
}


module.exports.preAdd = function(req, res, next) {

     distr_service.getAllDistributors(function(err, results){
         if (!err) {
             res.render('brand/brandAdd',{distributors:results});
         } else {
             console.log(err);
             next();
         }
     })
}

module.exports.add = function(req, res, next) {

    var name =  req.body.name ? req.body.name : '';
    var did = req.body.did ? req.body.did : '';
    var remarks = req.body.remarks ? req.body.remarks : '';

    service.add(name,did,remarks,function(err, results) {

        if (!err) {
             res.redirect('/jinquan/brand_list?replytype=add');
        } else {
            console.log(err);
            next();
        }
    })
}

module.exports.checkName = function(req, res, next) {

    var name = req.body.name ? req.body.name : '';

    service.checkName(name, function(err, results){

        if (!err) {
            res.json({flag:results});
        } else {
            console.log(err);
            next();
        }
    })
}

module.exports.browse = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.browse(id, function (err, results){

        if (!err) {
             res.render('brand/brandBrowse', {data : results[0]});
        } else {
            console.log(err);
             next();
        }
    });
}

module.exports.del = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.del(id,function(err, results) {

        if (!err) {
            res.redirect('/jinquan/brand_list?replytype=del');
        } else {
            console.log(err);
            next();
        }
    })

}

module.exports.preUpdate = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.preUpdate(id, function(err, results) {
        if (!err) {
            distr_service.getAllDistributors(function(err, distributors) {
                var data = results[0];
                data.distributors = distributors;
                res.render('brand/brandUpdate', {data:data});
            })
        } else {
            console.log(err);
            next();
        }
    })
}

module.exports.update = function(req, res, next) {

    var name = req.body.name ? req.body.name : '';
    var did = req.body.did ? req.body.did : '';
    var remarks = req.body.remarks ? req.body.remarks : '';
    var id = req.body.id ? req.body.id : '';

    service.update(id,name,did,remarks,function(err, results) {
        if (!err) {
            res.redirect('/jinquan/brand_list?replytype=update');
        } else {
            console.log(err);
            next();
        }
    })
}