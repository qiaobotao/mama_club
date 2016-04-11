/**
 * Created by qiaojoe on 16-3-19.
 */
var service = require('../../model/service/punchCard');

var laypage = require('laypage');
var router = require('express').Router();

var multiparty = require('multiparty');
var xlsx = require('node-xlsx');
var fs = require('fs');


module.exports.list = function (req, res, next) {

    var name = req.query.name ? req.query.name : '';    // 员工姓名
    var date = req.query.date ? req.query.date : '';  // 服务分类
    var currentPage = req.query.page ? req.query.page : '1';

    var replytype = req.query.replytype ? req.query.replytype : '';

    //router.get('punch_card_list/page/:num', function(req, res){
    //    res.render('punchCard/punchCardList', {
    //        laypage: laypage({
    //            curr: req.params.page || 1
    //            ,url: req.url //必传参数，获取当前页的url
    //            ,pages: 18 //分页总数你需要通过sql查询得到
    //        })
    //    })
    //});
    //router.get('punchCard/punchCardList/page/:num', function(req, res){
    //    res.render('punchCard/punchCardList', {
    //        laypage: laypage({
    //            curr: req.params.page || 1
    //            ,url: req.url //必传参数，获取当前页的url
    //            ,pages: 18 //分页总数你需要通过sql查询得到
    //        })
    //    })
    //});

    service.list(name,date,currentPage, function(err, results) {

        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.date = date;
            res.render('punchCard/punchCardList', {data : results,replytype : replytype});
        } else {
            next();
        }
    });
}

module.exports.preimport = function (req, res, next) {

    var type = req.query.replytype ? req.query.replytype : '';

    res.render('punchCard/punchCardImport', {replytype : type});

}

module.exports.import = function (req, res, next) {

    var form = new multiparty.Form({uploadDir: './public/files/'});
    form.parse(req, function(err, fields, files) {
        if (!err) {
            var inputFile = files.recordfile[0];
            var uploadedPath = inputFile.path;
            var obj = xlsx.parse(uploadedPath);
            if (obj.length == 0) {  // xls 格式的数据解析后会是 []
                res.redirect('/jinquan/punch_pre_import?replytype=errorformat');
            } else {
                service.insertExcelData(obj[0].data, function(err, results) {
                    if (!err) {
                        res.redirect('/jinquan/punch_card_list?replytype=success');
                    } else {
                        res.redirect('/jinquan/punch_pre_import?replytype=error');
                    }
                });
            }
        } else {
            console.log('parse error: ' + err);
            next();
        }
    });
}
