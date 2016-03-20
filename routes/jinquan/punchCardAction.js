/**
 * Created by qiaojoe on 16-3-19.
 */
var service = require('../../model/service/punchCard');
var multiparty = require('multiparty');
var xlsx = require('node-xlsx');
var fs = require('fs');


module.exports.list = function (req, res, next) {

    var name = req.query.name ? req.query.name : '';    // 员工姓名
    var date = req.query.date ? req.query.date : '';  // 服务分类
    var currentPage = req.query.page ? req.query.page : '1';

    service.list(name,date,currentPage, function(err, results) {

        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.date = date;
            res.render('punchCard/punchCardList', {data : results});
        } else {
            next();
        }
    });
}

module.exports.preimport = function (req, res, next) {

    res.render('punchCard/punchCardImport');

}

module.exports.import = function (req, res, next) {

    var form = new multiparty.Form({uploadDir: './public/files/'});
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
            next();
        } else {
            console.log('parse files: ' + filesTmp);

            //var obj = xlsx.parse(filename);
            //console.log(JSON.stringify(obj));
        }

    });
}
