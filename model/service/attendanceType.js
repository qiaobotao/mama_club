/**
 * Created by kuanchang on 16/2/15.
 * 考勤类型管理类
 */


var db = require('../../common/db');
var async = require('async');
/**
 * 增加考勤管理
 * @param categoryName
 * @param jobTime
 * @param startDate
 * @param endDate
 * @param cb
 */
module.exports.insertAttendanceType = function(categoryName,status,describe,cb) {

    var sql = 'INSERT INTO attendanceCategory (categoryName,`status`,`describe`,dateline)' +
        ' VALUES (?,?,?,?)';
    db.query(sql, [categoryName,status,describe,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除考勤管理
 * @param id
 * @param cb
 */
module.exports.delAttendanceType= function (id, cb) {

    var sql = 'DELETE FROM attendanceCategory WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 分页考勤管理信息
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchAttendanceTypes = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM attendanceCategory ORDER BY dateline DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取所有考勤管理
 * @param cb
 */
module.exports.fetchAllAttendanceType = function(categoryName,currentPage,cb) {

    var parm = "WHERE categoryName LIKE '%"+categoryName+"%' ";

    var sql_count = 'SELECT count(*) as count FROM attendanceCategory '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT * FROM attendanceCategory '+parm+' ORDER BY dateline DESC LIMIT ?,?';

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
 * 修改考勤管理
 * @param id
 * @param categoryName
 * @param jobTime
 * @param startDate
 * @param endDate
 * @param cb
 */
module.exports.updateAttendanceType = function(id, categoryName,status,describe, cb) {
    //修改考勤主表sql
    var updateSql = 'UPDATE attendanceCategory SET categoryName = ?, `status` = ?, `describe` = ? WHERE id = ?';
    var updatePar = [categoryName,status,describe, id];
    //删除考勤子表sql
    var delMxSql = 'delete from attendanceCategoryMX WHERE attendanceCategoryId = ?';
    async.series({
        update : function(callback){
            db.query(updateSql, updatePar, function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        delMx : function(callback){
            db.query(delMxSql, [id], function (cbData, err, rows, fields) {
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
 * 获取考勤管理详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleAttendanceType =function (id, cb) {

    var singleSql = 'SELECT * FROM attendanceCategory WHERE id = ?';
    var singleMxSql = 'SELECT * FROM attendanceCategoryMX WHERE attendanceCategoryId = ? order by weekNum';

    async.series({
        single : function(callback){
            db.query(singleSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        singleMx : function(callback){
            db.query(singleMxSql, [id], function (cbData, err, rows, fields) {
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
 * 添加考勤类型子表信息
 * @param id
 * @param attendanceArr
 * @param cb
 */
module.exports.addAttendanceMx = function(id,attendanceArr,cb) {
    //添加考勤类型子表信息
    var addChildrenSql = 'insert into attendanceCategoryMX(attendanceCategoryId,jobStatus,startDate,endDate,weekNum) VALUES (?,?,?,?,?)';
    //批量添加考勤类型子表信息
    async.map(attendanceArr, function(item, callback) {
        db.query(addChildrenSql, [id,item.jobStatus,item.startDate,item.endDate,item.weekNum], function (cbData, err, rows, fields) {
            if (!err) {
                callback(null, rows);
            } else {
                callback(err);
            }
        });
    }, function(err,results) {
        cb(err, results);
    });
}
