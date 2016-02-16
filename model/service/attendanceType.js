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
module.exports.insertAttendanceType = function(categoryName,jobTime,startDate,endDate,cb) {

    var sql = 'INSERT INTO attendanceCategory (categoryName,jobTime,startDate,endDate,dateline,status)' +
        ' VALUES (?,?,?,?,?,?)';
    db.query(sql, [categoryName,jobTime,startDate,endDate,new Date().getTime(),'1'], function(cbData, err, rows, fields) {
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
module.exports.updateAttendanceType = function(id, categoryName,jobTime,startDate,endDate, cb) {

    var sql = 'UPDATE attendanceCategory SET categoryName = ?, jobTime = ?, startDate = ?, endDate = ? WHERE id = ?';

    var par = [categoryName,jobTime,startDate,endDate, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
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

    var sql = 'SELECT * FROM attendanceCategory WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

