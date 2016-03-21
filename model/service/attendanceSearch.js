/**
 * Created by kuanchang on 16/3/21.
 * 考勤查询server
 */
var db = require('../../common/db');
var async = require('async');

/**
 * 获取所有考勤变更
 * @param staffName 员工名称
 * @param cb
 */
module.exports.fetchAllAttendanceSearch = function(staffName,startDate,endDate,currentPage,cb) {
    var parm = "WHERE 1=1 ";
/*
    var parm = "WHERE b.name LIKE '%"+staffName+"%' ";
    if(startDate != ''){
        parm += " AND startDate >= str_to_date('"+startDate+"', '%Y-%m-%d %H:%i:%s')";
    }
    if(endDate != ''){
        parm += " AND endDate <= str_to_date('"+endDate+"', '%Y-%m-%d %H:%i:%s')";
    }
*/
    var sql_count = 'select count(*) from punchCardRecord p ,staff s '+parm+' and p.recordNumber = s.clockCode ';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'select ' +
        "DATE_FORMAT(str_to_date(p.date, '%Y/%m/%d'),'%Y-%m-%d')as 'day'," +
        "str_to_date(p.date, '%Y/%m/%d %H:%i:%s') as 'time',p.recordNumber," +
        "s.`name` as 'staffName'," +
        "p.date as 'punchCardDate'," +
        "(select ac.attendanceType from attendanceChange ac " +
        "   where ac.staffId = s.id and str_to_date(ac.startDate, '%Y-%m-%d') = str_to_date(p.date, '%Y/%m/%d') " +
        ") as 'attendanceType'," +
        "(select timediff(ac.endDate,ac.startDate) from attendanceChange ac " +
        "   where ac.staffId = s.id and str_to_date(ac.startDate, '%Y-%m-%d') = str_to_date(p.date, '%Y/%m/%d') " +
        ") as 'attendanceTime'," +
        "(select ac.leaveReason from attendanceChange ac " +
        "   where ac.staffId = s.id and str_to_date(ac.startDate, '%Y-%m-%d') = str_to_date(p.date, '%Y/%m/%d') " +
        ") as 'attendanceReason' " +
        " from punchCardRecord p ,staff s " +parm+
        " and p.recordNumber = s.clockCode " +
        "group by p.date,p.recordNumber " +
        "order by p.date desc,p.recordNumber " +
        ' LIMIT ?,?';

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