/**
 * Created by kuanchang on 16/1/7.
 */
/**
 * 获取教室列表
 * @param req
 * @param res
 */
var service = require('../../model/service/classroom');
var waresService = require('../../model/service/wares');
module.exports.list = function (req, res) {
    var currentPage = req.query.page ? req.query.page : '1';
    var className = req.query.className ? req.query.className : '';
    var classCode = req.query.classCode ? req.query.classCode : '';
    var classType = req.query.number ? req.query.number : '';

    service.fetchAllCLassRoom(className,classCode,classType,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.className = className;
            results.classCode = classCode;
            results.classType = classType;
            res.render('classroom/classroomList', {data : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });

}

/**
 * 增加门店
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    /*var currentPage = req.query.page ? req.query.page : '1';
    var className = req.query.className ? req.query.className : '';
    var classCode = req.query.classCode ? req.query.classCode : '';
    var classType = req.query.number ? req.query.number : '';
    waresService.fetchAllWares(currentPage,className,classCode,classType, function (err, results)
    {
        if (!err) {
            results.currentPage = currentPage;
            results.className = className;
            results.classCode = classCode;
            results.classType = classType;
            res.render('classroom/classroomAdd', {datas : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });*/
    res.render('classroom/classroomAdd' , {datas : null});
}