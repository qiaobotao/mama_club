/**
 * Created by qiaojoe on 15-12-5.
 * 门店管理
 */
var laypage = require('laypage');
var service = require('../../model/service/shop');

/**
 * 获取门店列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res, next) {

    var currentPage = req.query.page ? req.query.page : '1';
    var shopname = req.query.shopname ? req.query.shopname : '';
    var principal = req.query.principal ? req.query.principal : '';
    var number = req.query.number ? req.query.number : '';

    var url = '/jinquan'+req.url;
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var resourcesData = req.session.resourcesData;
    service.fetchAllShop(shopname,principal,number,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.name = shopname;
            results.principal = principal;
            results.number = number;
            res.render('shop/shoplist', {data : results, replytype : replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
            });
        } else {
            console.log(err);
            next();
        }
    });
}

/**
 * 增加门店页面
 * @param req
 * @param res
 */
module.exports.preAdd = function (req, res) {

    res.render('shop/shopAdd');

}

/**
 * 增加门店
 * @param req
 * @param res
 */
module.exports.add = function(req, res, next) {

    var serialNumber = req.body.serialNumber ? req.body.serialNumber : '';
    var name = req.body.name ? req.body.name : '';
    var principal = req.body.principal ? req.body.principal : '';
    var tel = req.body.tel ? req.body.tel : '';
    var address = req.body.address ? req.body.address : '';
    var remark = req.body.remark ? req.body.remark : '';

   service.insertShop(serialNumber,name,principal,tel,address,remark,function(err, results) {
       if (!err) {
           res.redirect('/jinquan/shop_list?replytype=add');
       } else {
           next();
       }
   });

}

/**
 * 删除门店
 * @param req
 * @param res
 */
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delShop(id,function(err, flag){
        if (!err) {
            if (flag) {
                res.redirect('/jinquan/shop_list?replytype=del');
            } else {
                res.redirect('/jinquan/shop_list?replytype=no_del');
            }
        } else {
            next();
        }
    });

}

/**
 * 设置门店是否可用
 * @param req
 * @param res
 */
module.exports.setStatus = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';
    var status = req.query.status ? req.query.status : '';
    var selectPage = req.query.page ? req.query.page : '1';
    var shopname = req.query.shopname ? req.query.shopname : '';
    var principal = req.query.principal ? req.query.principal : '';
    var number = req.query.number ? req.query.number : '';


    service.setStatus(id, status, function (err, results) {

        if (!err) {
            res.redirect('/jinquan/shop_list?page='+selectPage+'&shopname='+shopname+'&principal='+principal+'&number='+number);
        } else {
            next();
        }

    })
}

/**
 * 修改
 * @param req
 * @param res
 */
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleShop(id, function(err, results) {
        if (!err) {
            var shop = results.length == 0 ? null : results[0];
            res.render('shop/shopEdit', {shop : shop});
        } else {
            next();
        }
    })
}

/**
 * 修改保存
 * @param req
 * @param res
 */
module.exports.update = function(req, res,next) {

    var id = req.body.id ? req.body.id : '';
    var serialNumber = req.body.serialNumber ? req.body.serialNumber : '';
    var name = req.body.name ? req.body.name : '';
    var principal = req.body.principal ? req.body.principal : '';
    var tel = req.body.tel ? req.body.tel : '';
    var address = req.body.address ? req.body.address : '';
    var remark = req.body.remark ? req.body.remark : '';

    service.updateShop(id, serialNumber,  name, address, principal, tel, remark, function(err, results) {
        if (!err) {
            res.redirect('/jinquan/shop_list?replytype=update');
        } else {
            next();
        }
    })
}

module.exports.browse = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';
    service.fetchSingleShop(id, function (err, results) {
        if (!err && results.length != 0) {
             var data = results[0];
            res.render('shop/shopBrowse', {data : data});
        } else {
             next();
        }
    })
}


module.exports.checkSeril = function (req, res, next) {

    var seril = req.body.serial ? req.body.serial : '';
    service.checkSeril(seril,function(err, results) {
         if (!err) {
              res.json({flag:results});
         } else {
             next();
         }
    });
}

module.exports.checkName = function (req, res, next) {

    var name = req.body.name ? req.body.name : '';

    service.checkName(name,function (err, results) {
        if (!err) {
            res.json({flag:results});
        } else {
            next();
        }
    })
}

