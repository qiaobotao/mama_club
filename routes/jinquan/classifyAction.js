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
 *
 * @param req
 * @param res
 */
module.exports.preAdd = function (req, res) {

    res.render('classify/mainClassifyAdd');

}

/**
 * 添加子分类
 * @param req
 * @param res
 */
module.exports.addSubcollection = function (req, res) {

    var parentId = req.body.parentId ? req.body.parentId : 0;
    var name = req.body.name ? req.body.name :'';
    var remark = req.body.remark ? req.body.remark : '';


    service.addSubcollection(parentId,name,remark, function (err, results) {
        if(!err) {
            res.redirect('/jinquan/classify_list');
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
module.exports.delSubcollection = function (req, res) {

    var id = req.query.id ? req.query.id : 0;

    service.delSubcollection(id,function(err, results) {
        if(!err) {
            res.redirect('/jinquan/classify_list');
        } else {
            console.log(err.message);
            res.render('error');
        }
    });
}