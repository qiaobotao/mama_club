/**
 * Created by kuanchang on 16/3/18.
 */
var db = require('../../common/db');
var async = require('async');

/**
 * 获取所有培训列表
 * @param cb
 */
module.exports.fetchAllStaffTrain = function(trainName,teacherName,currentPage,cb) {

    var parm = " WHERE r.name LIKE '%"+trainName+"%' AND c.teacherName LIKE '%"+trainName+"%' ";

    var sql_count = 'SELECT count(*) as count FROM course AS r ,courseTeacher AS c '+parm+' AND r.id = c.courseId ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT r.id,r.name,c.teacherName,r.courseDate,r.courseTimeStart,r.courseTimeEnd,r.classroomId,room.name as roomName ' +
        ' FROM course AS r,courseTeacher AS c,classroom room '+parm+' AND courseType = 1 AND r.id = c.courseId AND r.classroomId = room.id ORDER BY r.dateline DESC LIMIT ?,?';

    async.series({
        totalPages : function(callback){
            db.query(sql_count, [], function (cbData, err, rows, fields) {

                if (!err) {
                    var count = rows[0].count;
                    var totalPages = Math.ceil(count / 10);
                    callback(null,totalPages);
                } else {
                    callback(err);
                }
            });
        },
        data : function(callback){
            db.query(sql_data, [start, end], function (cbData, err, rows, fields) {

                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        }
    },function(err, results) {
        if (!err) {
            cb (null, results);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取员工培训详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleStaffTrain =function (id, cb) {
    var sqlCourseData = 'SELECT r.id,r.name,c.teacherName,r.courseDate,r.courseTimeStart,r.courseTimeEnd,r.classroomId,room.name as roomName , r.scorse,r.content ' +
        ' FROM course AS r,courseTeacher AS c,classroom room WHERE r.id = ? AND courseType = 1 AND r.id = c.courseId AND r.classroomId = room.id ORDER BY r.dateline DESC ';
    var sqlStaffTrain = 'select sf.*,s.name as staffName from staffTrain sf,staff s where courseId = ? and s.id = sf.staffId';
    async.series({
        courseData : function(callback){
            db.query(sqlCourseData, [id], function (cbData, err, rows, fields) {

                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        staffTrainData : function(callback){
            db.query(sqlStaffTrain, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        }
    },function(err, results) {
        if (!err) {
            cb (null, results);
        } else {
            cb(err);
        }
    });
}

/**
 * 删除用户培训信息
 * @param id
 * @param cb
 */
module.exports.delStaffTrain= function (id, cb) {

    var sql = 'DELETE from staffTrain WHERE courseId = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 增加员工培训信息
 * @param name
 * @param address
 * @param principal
 * @param cb
 */
module.exports.insertStaffTrain = function(courseId,staffTrainArr, cb) {

    var sql = 'INSERT INTO staffTrain (courseId,staffId,beforeClassIntegration,classIntegration,afterClassIntegration,status,dateline) VALUES (?,?,?,?,?,?,?)';
    //批量添加培训信息
    async.map(staffTrainArr, function(item, callback) {
        db.query(sql, [courseId,item.staffId,item.beforeClassIntegration,item.classIntegration,item.afterClassIntegration,item.status,new Date().getTime()], function (cbData, err, rows, fields) {
            if (!err) {
                callback(null, rows);
            } else {
                callback(err);
            }
        });
    }, function(err,results) {
        cb(err, results);
    });
};