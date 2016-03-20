/**
 * Created by kuanchang on 16/2/15.
 * 考勤变更管理类
 */


var db = require('../../common/db');
var async = require('async');
/**
 * 增加考勤变更
 * @param categoryName
 * @param jobTime
 * @param startDate
 * @param endDate
 * @param cb
 */
module.exports.insertAttendanceChange = function(staffId,attendanceType,leaveStartDate,leaveEndDate,startDate,endDate,leaveReason,attendanceTypeDetailed,cb) {

    var sql = 'INSERT INTO attendanceChange (staffId,attendanceType,leaveStartDate,leaveEndDate,startDate,endDate,leaveReason,attendanceTypeDetailed,dateline,status)' +
        ' VALUES (?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [staffId,attendanceType,new Date(leaveStartDate),new Date(leaveEndDate),new Date(startDate),new Date(endDate),leaveReason,attendanceTypeDetailed,new Date().getTime(),'1'], function(cbData, err, rows, fields) {
    //db.query(sql, [staffId,attendanceType,new Date(leaveStartDate).getTime(),new Date(leaveEndDate).getTime(),new Date(startDate).getTime(),new Date(endDate).getTime(),leaveReason,attendanceTypeDetailed,new Date().getTime(),'1'], function(cbData, err, rows, fields) {
    //db.query(sql, [staffId,attendanceType,leaveStartDate,leaveEndDate,startDate,endDate,leaveReason,attendanceTypeDetailed,new Date().getTime(),'1'], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除考勤变更
 * @param id
 * @param cb
 */
module.exports.delAttendanceChange= function (id, cb) {

    var sql = 'DELETE FROM attendanceChange WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 分页考勤变更信息
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchAttendanceChanges = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM attendanceChange ORDER BY dateline DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取所有考勤变更
 * @param cb
 */
module.exports.fetchAllAttendanceChange = function(staffName,attendanceType,startDate,endDate,currentPage,cb) {

    var parm = "WHERE attendanceType LIKE '%"+attendanceType+"%' AND b.name LIKE '%"+staffName+"%' ";
    if(startDate != ''){
        parm += " AND startDate >= str_to_date('"+startDate+"', '%Y-%m-%d %H:%i:%s')";
    }
    if(endDate != ''){
        parm += " AND endDate <= str_to_date('"+endDate+"', '%Y-%m-%d %H:%i:%s')";
    }

    var sql_count = 'SELECT count(*) as count FROM attendanceChange a ,staff b  '+parm+' AND b.id = a.staffId ORDER BY a.dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT a.*,b.name as `staffName`,date_format(a.endDate,"%Y-%m-%d %H:%i:%S") as endDate2Str,date_format(a.startDate,"%Y-%m-%d %H:%i:%S") as startDate2Str FROM attendanceChange a ,staff b '+parm+' AND b.id = a.staffId ORDER BY a.dateline DESC LIMIT ?,?';

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
 * 修改考勤变更
 * @param id
 * @param categoryName
 * @param jobTime
 * @param startDate
 * @param endDate
 * @param cb
 */
module.exports.updateAttendanceChange = function(id, staffId,attendanceType,leaveStartDate,leaveEndDate,startDate,endDate,leaveReason,attendanceTypeDetailed,cb) {

    var sql = 'UPDATE attendanceChange SET staffId = ?, attendanceType = ?, leaveStartDate = ?, leaveEndDate = ?,startDate=?,endDate=?,leaveReason=?,attendanceTypeDetailed=? WHERE id = ?';

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
 * 获取考勤变更详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleAttendanceChange =function (id, cb) {
    var sql = 'SELECT a.*,b.name as `staffName`,date_format(a.endDate,"%Y-%m-%d %H:%i:%S") as endDate2Str,date_format(a.startDate,"%Y-%m-%d %H:%i:%S") as startDate2Str FROM attendanceChange a ,staff b   WHERE a.id = ? AND b.id = a.staffId';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

