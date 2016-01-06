/**
 * Created by qiaojoe on 15-12-24.
 * 数据字典维护
 */


var service = require('../../model/service/classify');


/**
 * 返回所有父分类和子分类
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {

    service.getAllMainClassify(function(err, results) {
        if (!err) {
            res.render('classify/mainClassifyList',{mainClassify : results});
        } else {
            console.log(err.message);
            res.render('error', {message : err});
        }
    });

}

/**
 *
 * @param req
 * @param res
 */
module.exports.del = function(req, res) {

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
                       console.log(err.message);
                       res.render('error',{message : err});
                   }
               })
           }
        } else {
            console.log(err.message);
            res.render('error', {message : err});
        }
    })

}

/**
 * 跳转
 * @param req
 * @param res
 */
module.exports.preAdd = function (req, res) {

    res.render('classify/mainClassifyAdd');

}

/**
 * 添加
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {

    var name = req.body.name ? req.body.name : '';
    var remark = req.body.remark ? req.body.remark : '';
    var orderNumber = req.body.orderNumber ? req.body.orderNumber : '';

    service.addMainClassify(name,remark,orderNumber,function(err, results) {
        if(!err) {
            res.redirect('/jinquan/main_classify_list');
        } else {
            console.log(err.message);
            res.render('error');
        }
    })
}

/**
 * 修改主分类
 * @param req
 * @param res
 */
module.exports.preEdit = function(req, res) {

    var id = req.query.id ? req.query.id : '';

    service.getMainClassifyById(id, function (err, results) {

        if(!err) {
            var mainClassify = results.length == 0 ? null : results[0];
            res.render('classify/mainClassifyEdit',{mainClassify : mainClassify});
        } else {
            console.log(err.message);
            res.render('error');
        }
    })
}

/**
 * 修改主分类
 * @param req
 * @param res
 */
module.exports.update = function (req, res) {

    var id = req.body.id ? req.body.id : '';
    var name = req.body.name ? req.body.name : '';
    var remark = req.body.remark ? req.body.remark : '';
    var orderCode = req.body.orderNumber ? req.body.orderNumber : '';

    service.mainClassifyUpdate(id,name,remark,orderCode,function (err, results) {

        if (!err) {
            res.redirect('/jinquan/main_classify_list');
        } else {
            console.log(err.message);
            res.render('error',{message : err});
        }
    });

}

/**
 * 子分类列表
 * @param req
 * @param res
 */
module.exports.subList = function (req, res) {

    var pid = req.query.id ? req.query.id : '';

    service.getAllSubcollection(pid, function (err, results) {
        if (!err) {
            res.render('classify/subClassifyList', {subClassify : results, pid : pid});
        } else {
            console.log(err.message);
            res.render('error',{message : err});
        }
    })

}

/**
 * 跳转添加页面
 * @param req
 * @param res
 */
module.exports.preSubAddClassify = function (req, res) {

    var pid = req.query.pid ? req.query.pid : 0;

    res.render('classify/subClassifyAdd', {pid : pid});

}

/**
 * 添加子分类
 * @param req
 * @param res
 */
module.exports.addSubClassify = function (req, res) {

    var pid = req.body.pid ? req.body.pid : 0;
    var name = req.body.name ? req.body.name :'';
    var remark = req.body.remark ? req.body.remark : '';


    service.addSubcollection(pid,name,remark, function (err, results) {
        if(!err) {
            res.redirect('/jinquan/sub_classify_list?id='+pid);
        } else {
            console.log(err.message);
            res.render('error');
        }
    });
}

/**
 * 删除子分类
 * @param req
 * @param res
 */
module.exports.delSubClassify = function (req, res) {

    var id = req.query.id ? req.query.id : 0;
    var pid = req.query.pid ? req.query.pid : 0;

    service.delSubcollection(id,function(err, results) {
        if(!err) {
            res.redirect('/jinquan/sub_classify_list?id='+pid);
        } else {
            console.log(err.message);
            res.render('error');
        }
    });
}

/**
 * 修改子分类
 * @param req
 * @param res
 */
module.exports.preSubEdit = function (req, res) {

    var id = req.query.id ? req.query.id : 0;

    service.getSingleSubClassifyById(id, function (err, results) {

        if(!err) {
            var subClassify = results.length == 0 ? null : results[0];
            res.render('classify/subClassifyEdit', {classify : subClassify});
        } else {
            console.log(err.message);
            res.render('error',{message : err});
        }

    });
}

/**
 * 修改
 * @param req
 * @param res
 */
module.exports.subUpdate = function (req, res) {

    var id = req.body.id ? req.body.id : 0;
    var pid = req.body.pid ? req.body.pid : 0;
    var name = req.body.name ? req.body.name : '';
    var remark = req.body.remark ? req.body.remark : '';

    service.subUpdate(id,name,remark,function(err, results) {
        if(!err) {
            res.redirect('/jinquan/sub_classify_list?id='+pid);
        } else {
            console.log(err.message);
            res.render('error');
        }
    });
}