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
    var classRoomName = req.query.classRoomName ? req.query.classRoomName : '';
    var classRoomCode = req.query.classRoomCode ? req.query.classRoomCode : '';
    var classType = req.query.number ? req.query.number : '';

    service.fetchAllCLassRoom(classRoomName,classRoomCode,classType,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.classRoomName = classRoomName;
            results.classRoomCode = classRoomCode;
            results.classType = classType;
            res.render('classroom/classroomList', {data : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });

};

/**
 * 跳转心中页面教室
 * @param req
 * @param res
 */
module.exports.goAdd = function (req, res) {
    var currentPage = req.query.page ? req.query.page : '1';
    var className = req.query.className ? req.query.className : '';
    var classCode = req.query.classCode ? req.query.classCode : '';
    var classType = req.query.number ? req.query.number : '';
    waresService.fetchAllWares( function (err, results)
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
    });
};
/**
 * 修改
 * @param req
 * @param res
 */
module.exports.preEdit = function(req, res) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleClassRoom(id, function(err, results) {
        if (!err) {
            var classroom = results.length == 0 ? null : results[0];
            var materialId=classroom.materialId;
            res.render('classroom/classroomEdit', {classroom : classroom});


        } else {
            console.log(err.message);
            res.render('error', {message : err});
        }
    })
}
/**
 * 添加
 * @param req
 * @param res
 */
module.exports.doEdit = function (req, res) {

    var id = req.body.id ? req.body.id : '';
    var serialNumber = req.body.serialNumber ? req.body.serialNumber : '';
    var name = req.body.name ? req.body.name : '';
    var classCode = req.body.classCode ? req.body.classCode : '';
    var classType = req.body.classType ? req.body.classType : '';
    var remark = req.body.remark ? req.body.remark : '';
    var materialId = req.body.materialId ? req.body.materialId : '';

    service.updateClassRoom(id,serialNumber,name,classCode,classType,remark,materialId,function(err, results) {
        if(!err) {
            res.redirect('/jinquan/classroom_list');
        } else {
            console.log(err.message);
            res.render('error');
        }
    })
};
/**
 * 添加
 * @param req
 * @param res
 */
module.exports.doAdd = function (req, res) {

    var serialNumber = req.body.serialNumber ? req.body.serialNumber : '';
    var name = req.body.name ? req.body.name : '';
    var classCode = req.body.classCode ? req.body.classCode : '';
    var classType = req.body.classType ? req.body.classType : '';
    var remark = req.body.remark ? req.body.remark : '';
    var materialId = req.body.materialId ? req.body.materialId : '';

    service.insertClassRoom(serialNumber,name,classCode,classType,remark,materialId,function(err, results) {
        if(!err) {
            res.redirect('/jinquan/classroom_list');
        } else {
            console.log(err.message);
            res.render('error');
        }
    })
};

/**
 * 删除教室为0的
 * 库房有数据不能删除
 * @param req
 * @param res
 */
module.exports.del = function(req, res) {

    var id = req.query.id ? req.query.id : 0;
    service.delClassRoom(id, function(err, results){



    });
};
/**
 * 设置状态
 * @param req
 * @param res
 */
module.exports.setStatus = function(req, res) {

    var status = req.query.status ? req.query.status : 0;
    var id = req.query.id ?  req.query.id : 0;

    service.setStatus(id,status,function(err, results){
        if(!err) {
            res.redirect('/jinquan/classRoom_list');
        } else {
            console.log(err.message);
            res.render('error');
        }
    });
};