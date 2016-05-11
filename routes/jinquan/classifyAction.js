/**
 * Created by qiaojoe on 15-12-24.
 * 数据字典维护
 */

var laypage = require('laypage');
var service = require('../../model/service/classify');
 var myUtils = require('../../common/utils');

/**
 * 返回所有父分类和子分类
 * @param req
 * @param res
 */
module.exports.list = function (req, res,next) {

    var keywords = req.query.keywords ? req.query.keywords : '';
    var currentPage = req.query.page ? req.query.page : '1';
    var url = '/jinquan'+req.url;

    service.getAllMainClassify(keywords,currentPage, function(err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.keywords = keywords;
            res.render('classify/mainClassifyList',{data : results, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages})
            });
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    });

}

/**
 *
 * @param req
 * @param res
 */
module.exports.del = function(req, res, next) {

    var id = req.query.id ? req.query.id : 0;

    service.getSubcollectionById(id,function (err, results) {

        if (!err) {
            // 判断是否有子分类，如果有子分类则不能删除
           if (results.length != 0) {
               res.send("<script>alert('该分类下有子级分类，不能删除！');history.back();</script>");
           } else { // 没有子分类，可以删除操作
               service.delMainClassify(id, function(err, results) {
                   if(!err) {
                       res.redirect('/jinquan/main_classify_list');
                   } else {
                       myUtils.printSystemLog(err)
                       next();
                   }
               })
           }
        } else {
            myUtils.printSystemLog(err)
           next();
        }
    })

}

/**
 * 跳转
 * @param req
 * @param res
 */
module.exports.preAdd = function (req, res,next) {

    res.render('classify/mainClassifyAdd');

}

/**
 * 添加
 * @param req
 * @param res
 */
module.exports.add = function (req, res, next) {

    var name = req.body.name ? req.body.name : '';
    var remark = req.body.remark ? req.body.remark : '';
    var orderNumber = req.body.orderNumber ? req.body.orderNumber : '';

    service.addMainClassify(name,remark,orderNumber,function(err, results) {
        if(!err) {
            res.redirect('/jinquan/main_classify_list');
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    })
}

/**
 * 修改主分类
 * @param req
 * @param res
 */
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.getMainClassifyById(id, function (err, results) {

        if(!err) {
            var mainClassify = results.length == 0 ? null : results[0];
            res.render('classify/mainClassifyEdit',{mainClassify : mainClassify});
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    })
}

/**
 * 修改主分类
 * @param req
 * @param res
 */
module.exports.update = function (req, res,next) {

    var id = req.body.id ? req.body.id : '';
    var name = req.body.name ? req.body.name : '';
    var remark = req.body.remark ? req.body.remark : '';
    var orderCode = req.body.orderNumber ? req.body.orderNumber : '';

    service.mainClassifyUpdate(id,name,remark,orderCode,function (err, results) {

        if (!err) {
            res.redirect('/jinquan/main_classify_list');
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    });

}

/**
 * 子分类列表
 * @param req
 * @param res
 */
module.exports.subList = function (req, res,next) {

    var pid = req.query.id ? req.query.id : '';

    var keywords = req.query.keywords ? req.query.keywords : '';
    var currentPage = req.query.page ? req.query.page : '1';

    service.getAllSubcollection(pid, keywords, currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.keywords = keywords;
            results.pid = pid;
            res.render('classify/subClassifyList', {data : results});
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    });

}

/**
 * 跳转添加页面
 * @param req
 * @param res
 */
module.exports.preSubAddClassify = function (req, res,next) {

    var pid = req.query.pid ? req.query.pid : 0;

    res.render('classify/subClassifyAdd', {pid : pid});

}

/**
 * 添加子分类
 * @param req
 * @param res
 */
module.exports.addSubClassify = function (req, res, next) {

    var pid = req.body.pid ? req.body.pid : 0;
    var name = req.body.name ? req.body.name :'';
    var remark = req.body.remark ? req.body.remark : '';


    service.addSubcollection(pid,name,remark, function (err, results) {
        if(!err) {
            res.redirect('/jinquan/sub_classify_list?id='+pid);
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    });
}

/**
 * 删除子分类
 * @param req
 * @param res
 */
module.exports.delSubClassify = function (req, res, next) {

    var id = req.query.id ? req.query.id : 0;
    var pid = req.query.pid ? req.query.pid : 0;

    service.delSubcollection(id,function(err, results) {
        if(!err) {
            res.redirect('/jinquan/sub_classify_list?id='+pid);
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    });
}

/**
 * 修改子分类
 * @param req
 * @param res
 */
module.exports.preSubEdit = function (req, res, next) {

    var id = req.query.id ? req.query.id : 0;

    service.getSingleSubClassifyById(id, function (err, results) {

        if(!err) {
            var subClassify = results.length == 0 ? null : results[0];
            res.render('classify/subClassifyEdit', {classify : subClassify});
        } else {
            myUtils.printSystemLog(err)
            next();
        }

    });
}

/**
 * 修改
 * @param req
 * @param res
 */
module.exports.subUpdate = function (req, res, next) {

    var id = req.body.id ? req.body.id : 0;
    var pid = req.body.pid ? req.body.pid : 0;
    var name = req.body.name ? req.body.name : '';
    var remark = req.body.remark ? req.body.remark : '';

    service.subUpdate(id,name,remark,function(err, results) {
        if(!err) {
            res.redirect('/jinquan/sub_classify_list?id='+pid);
        } else {
            myUtils.printSystemLog(err)
            next();
        }
    });
}