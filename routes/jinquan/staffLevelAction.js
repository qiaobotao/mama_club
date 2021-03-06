/**
 * Created by kuanchang on 16/3/21.
 */

var laypage = require('laypage');
var service = require('../../model/service/staffLevel');
/**
 * 获取员工等级列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res,next) {

    var currentPage = req.query.page ? req.query.page : '1';
    var name = req.query.name ? req.query.name : '';
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;

    service.fetchAllStaffLevel(name,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            res.render('staffLevel/staffLevelList', {data : results,replytype:replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
            });
        } else {
            next();
        }
    });
}

/**
 * 保存员工等级
 * @param req
 * @param res
 */
module.exports.save = function (req, res,next) {
    var id = req.body.id ? req.body.id : '';
    var name = req.body.name ? req.body.name : '';
    var describe = req.body.describe ? req.body.describe : '';
    var serverNum = req.body.serverNum ? req.body.serverNum : '';
    var attendanceNum = req.body.attendanceNum ? req.body.attendanceNum : '';
    var trainNum = req.body.trainNum ? req.body.trainNum : '';
    var remarks = req.body.remarks ? req.body.remarks : '';

    if(id!=''){//修改
        service.updateStaffLevel(id,name,describe,serverNum,attendanceNum,trainNum,remarks,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/staff_level_list?replytype=update');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }else{//添加
        service.insertStaffLevel(name,describe,serverNum,attendanceNum,trainNum,remarks,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/staff_level_list?replytype=add');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }

}
/**
 * 修改
 * @param req
 * @param res
 */
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';
    var show = req.query.show ? req.query.show : '';
    service.fetchSingleStaffLevel(id, function(err, results) {
        if (!err) {
            var staffLevel = results.length == 0 ? null : results[0];
            if(staffLevel == null){
                staffLevel = {};
            }
            res.render('staffLevel/staffLevelEdit', {staffLevel : staffLevel,show:show});
        } else {
            next();
        }
    })
}

/**
 * 删除员工等级
 * @param req
 * @param res
 */
module.exports.delStaffLevel = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delStaffLevel(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/staff_level_list?replytype=del');
        } else {
            next();
        }
    });

}
