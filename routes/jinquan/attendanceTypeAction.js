/**
 * Created by kuanchang on 16/1/13.
 * 考勤类型管理
 */

var laypage = require('laypage');
var service = require('../../model/service/attendanceType');
var consts = require('../../model/utils/consts');
/**
 * 获取考勤类型列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res,next) {
    var currentPage = req.query.page ? req.query.page : '1';
    var categoryName = req.query.categoryName ? req.query.categoryName : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;

    service.fetchAllAttendanceType(categoryName,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.categoryName = categoryName;
            res.render('attendanceType/attendanceTypeList', {data : results, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
            });
        } else {
            console.log(err.message);
            res.render('error');
           // next();
        }
    });
}
/**
 * 跳转到编辑考勤类型页面
 * @param req
 * @param res
 */
module.exports.edit = function (req, res,next) {
    var id = req.query.id ? req.query.id : '';
    //var workDate = ['8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30'];

    var workDate = consts.COURSE_DATE;
    if(id == ''){
        var attendanceType = [];
        res.render('attendanceType/attendanceTypeEdit', {attendanceType : attendanceType,workDate:workDate,attendanceTypeMx:[]});
    }else{
        service.fetchSingleAttendanceType(id, function(err, results) {
            if (!err) {
                var attendanceType = results.single != null ? results.single[0] : {};
                var attendanceTypeMx = results.singleMx;
                res.render('attendanceType/attendanceTypeEdit', {attendanceType : attendanceType,workDate:workDate,attendanceTypeMx:attendanceTypeMx});
            } else {
                next();
            }
        })
    }
}
/**
 * 保存考勤类型
 * @param req
 * @param res
 */
module.exports.save = function (req, res,next) {
    //主表信息
    var id = req.body.id ? req.body.id : '';
    var categoryName = req.body.categoryName ? req.body.categoryName : '';
    var status = req.body.status ? req.body.status : '';
    var describe = req.body.describe ? req.body.describe : '';
    //子表信息
    var jobStatus = req.body.jobStatus ? req.body.jobStatus : '';
    var startDate = req.body.startDate ? req.body.startDate : '';
    var endDate = req.body.endDate ? req.body.endDate : '';
    var weekNum = req.body.weekNum ? req.body.weekNum : '';
    // 处理考勤子表集合数据
    var attendanceArr = new Array();
    if (jobStatus instanceof Array) {
        for (var i = 0; i < jobStatus.length; i++) {
            var obj = {};
            obj.jobStatus = jobStatus[i];
            obj.startDate = startDate[i];
            obj.endDate = endDate[i];
            obj.weekNum = weekNum[i];
            attendanceArr.push(obj);
        }
    } else {
        var obj = {};
        obj.jobStatus = jobStatus;
        obj.startDate = startDate;
        obj.endDate = endDate;
        obj.weekNum = weekNum;
        attendanceArr.push(obj);
    }
    if(id!=''){//修改
        service.updateAttendanceType(id,categoryName,status,describe,function(err, results) {
            if(!err) {
                service.addAttendanceMx(id,attendanceArr,function(err, results) {
                    if(!err) {
                        res.redirect('/jinquan/attendance_type_list');
                    } else {
                        console.log(err.message);
                        res.render('error');
                    }
                })
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }else{//添加
        service.insertAttendanceType(categoryName,status,describe,function(err, results) {
            if(!err) {
                service.addAttendanceMx(results.insertId,attendanceArr,function(err, results) {
                    if(!err) {
                        res.redirect('/jinquan/attendance_type_list');
                    } else {
                        console.log(err.message);
                        res.render('error');
                    }
                })
            } else {
                console.log(1123);
                console.log(err.message);
                res.render('error');
            }
        })
    }
}

/**
 * 删除考勤类型
 * @param id
 * @param cb
 */
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delAttendanceType(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/attendance_type_list');
        } else {
            next();
        }
    });

}