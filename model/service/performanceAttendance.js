/**
 * Created by kuanchang on 16/4/11.
 * 绩效考勤
 */


var db = require('../../common/db');
var async = require('async');
/**
 * 增加绩效考勤
 * @param categoryName
 * @param jobTime
 * @param startDate
 * @param endDate
 * @param cb
 */
module.exports.insertPerformanceAttendance = function(staffId,attendanceFraction,trainFraction,serverFraction,complainFraction,startDate,endDate,remarks,cb) {

    var sql = 'INSERT INTO performanceAttendance (staffId,attendanceFraction,trainFraction,serverFraction,complainFraction,startDate,endDate,remarks,dateline)' +
        ' VALUES (?,?,?,?,?,?,?,?,?)';
    db.query(sql, [staffId,new Date(),attendanceFraction,trainFraction,serverFraction,complainFraction,startDate,endDate,remarks,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除绩效考勤
 * @param id
 * @param cb
 */
module.exports.delPerformanceAttendance= function (id, cb) {

    var sql = 'DELETE FROM performanceAttendance WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 分页绩效考勤信息
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchAttendanceChanges = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM performanceAttendance ORDER BY dateline DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取所有绩效考勤
 * @param cb
 */
module.exports.fetchAllPerformanceAttendance = function(staffId,attendanceType,startDate,endDate,currentPage,cb) {

    var parm = "WHERE 1=1 ";
    if(staffId != ''){
        var parm = "AND b.id = ? ";
    }
    /*
    if(startDate != ''){
        parm += " AND startDate >= str_to_date('"+startDate+"', '%Y-%m-%d %H:%i:%s')";
    }
    if(endDate != ''){
        parm += " AND endDate <= str_to_date('"+endDate+"', '%Y-%m-%d %H:%i:%s')";
    }
    */

    var sql_count = 'SELECT count(*) as count FROM performanceAttendance a ,staff b  '+parm+' AND b.id = a.staffId ORDER BY a.dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT a.*,b.name as `staffName`,b.id as `staffId`,date_format(a.endDate,"%Y-%m-%d %H:%i:%S") as endDate2Str,date_format(a.startDate,"%Y-%m-%d %H:%i:%S") as startDate2Str FROM performanceAttendance a ,staff b '+parm+' AND b.id = a.staffId ORDER BY a.dateline DESC LIMIT ?,?';

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
 * 修改绩效考勤
 * @param id
 * @param categoryName
 * @param jobTime
 * @param startDate
 * @param endDate
 * @param cb
 */
module.exports.updateAttendanceChange = function(id, staffId,attendanceType,leaveStartDate,leaveEndDate,startDate,endDate,leaveReason,attendanceTypeDetailed,cb) {

    var sql = 'UPDATE performanceAttendance SET staffId = ?, attendanceType = ?, leaveStartDate = ?, leaveEndDate = ?,startDate=?,endDate=?,leaveReason=?,attendanceTypeDetailed=? WHERE id = ?';

    var par = [staffId,attendanceType,leaveStartDate,leaveEndDate,startDate,endDate,leaveReason,attendanceTypeDetailed,id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取绩效考勤详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleAttendanceChange =function (id, cb) {
    var sql = 'SELECT a.*,b.name as `staffName`,b.id as `staffId`,date_format(a.endDate,"%Y-%m-%d %H:%i:%S") as endDate2Str,date_format(a.startDate,"%Y-%m-%d %H:%i:%S") as startDate2Str FROM performanceAttendance a ,staff b   WHERE a.id = ? AND b.id = a.staffId';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

