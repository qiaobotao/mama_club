/**
 * Created by qiaojoe on 15-12-24.
 * 数据字典维护
 */


var service = require('../../model/service/classify');
var async = require('async');


/**
 * 返回所有父分类和子分类
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {

    async.series({
            subcollection: function(cb){

                service.getAllSubcollection(function(err, results) {
                    cb(err, results);
                });
            },
            mainClassify: function(cb){
                 service.getAllMainClassify(function(err, results) {
                     cb(err, results);
                 });
            }
        },
        function(err, results) {
            if (!err) {
                res.render('classify/classifyList',{result : results});
            } else {
                console.log(err.message);
                res.render('error', {error : err});
            }
        });
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