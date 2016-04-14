/**
 * Created by kuanchang on 16/1/7.
 */
/**
 * 获取教室列表
 * @param req
 * @param res
 */
var laypage = require('laypage');
var service = require('../../model/service/classroom');

module.exports.list = function (req, res,next) {

    var currentPage = req.query.page ? req.query.page : '1';
    var classRoomName = req.query.classRoomName ? req.query.classRoomName : '';
    var classRoomCode = req.query.classRoomCode ? req.query.classRoomCode : '';

    var url = '/jinquan'+req.url;
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';

    service.fetchAllCLassRoom(classRoomName,classRoomCode,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.classRoomName = classRoomName;
            results.classRoomCode = classRoomCode;
            res.render('classroom/classroomList', {data : results, replytype : replytype,laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages})});
        } else {
            next();
        }
    });

};

/**
 * 跳转心中页面教室
 * @param req
 * @param res
 */
module.exports.preAdd = function (req, res,next) {

    service.getClassroomClassify(function (err, results) {
        if (!err) {
            res.render('classroom/classroomAdd', {data : results});
        } else {
            next();
        }
    })
};
/**
 * 添加
 * @param req
 * @param res
 */
module.exports.Add = function (req, res,next) {

    var serialNumber = req.body.serialNumber ? req.body.serialNumber : '';
    var name = req.body.name ? req.body.name : '';
    var classType = req.body.cid ? req.body.cid : '';
    var remark = req.body.remark ? req.body.remark : '';
    var materialId = req.body.outLogId ? req.body.outLogId : '';

    service.insertClassroom(serialNumber,name,classType,remark,materialId,function(err, results) {
        if(!err) {
            res.redirect('/jinquan/classroom_list?replytype=add');
        } else {
            next();
        }
    })
};

module.exports.set = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';
    var type = req.query.type ? req.query.type : '';

    service.setClassroomStatus(id, type, function (err, results) {

        if (!err) {
            res.redirect('/jinquan/classroom_list');
        } else {
            next();
        }
    })
}

module.exports.detail = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.detail(id,function(err, results) {

        if (!err) {

            res.render('classroom/classroomDetail', {data : results});

        } else {
            next();
        }
    });
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


