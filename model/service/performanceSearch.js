/**
 * Created by kuanchang on 16/2/15.
 * 绩效查询管理类
 */


var db = require('../../common/db');
var async = require('async');
/**
 * 根据员工id、绩效时间月，获取时间相关考勤、内训、实操、投诉情况
 * @param staffId
 * @param performanceDate
 * @param cb
 */
module.exports.fetchPerformanceSearch = function(staffId,startDate , endDate ,cb) {
    //考勤情况汇总
    var attendanceSql = "select DATE_FORMAT(p.date, '%Y-%m-%d') as `date`,max(DATE_FORMAT(p.date, '%Y-%m-%d %H:%i:%s')) as maxTime,min(DATE_FORMAT(p.date, '%Y-%m-%d %H:%i:%s')) as minTime from punchCardRecord p ,staff s where s.clockCode = p.recordNumber  and s.id = ? " +
        "and DATE_FORMAT(p.date, '%Y-%m-%d %H:%i:%s') >=  DATE_FORMAT(?, '%Y-%m-%d %H:%i:%s') " +
        "and DATE_FORMAT(p.date, '%Y-%m-%d %H:%i:%s') <=  DATE_FORMAT(?, '%Y-%m-%d %H:%i:%s') " +
        "group by DATE_FORMAT(p.date, '%Y-%m-%d') " +
        "order by DATE_FORMAT(p.date, '%Y-%m-%d %H:%i:%s')";
    //找到该时间段所使用的考勤级别
    var staffAttendanceSql = "SELECT * from staffAttendance s where s.staffId = ?" +
        "and (" +
        "	(s.attendanceStartDate <= ? and s.attendanceEndDate >= ?)" +
        "   or (s.attendanceStartDate <= ? and s.attendanceEndDate >= ?)" +
        ") order by s.attendanceStartDate";
    //各考勤类型的考勤详情
    var categoryMXSql = "select * from attendanceCategoryMX m where m.attendanceCategoryId = ? order by m.weekNum ";
    //请假情况
    var leaveSql = "select " +
        "(select FORMAT(sum((UNIX_TIMESTAMP(aa.endDate) - UNIX_TIMESTAMP(aa.startDate))/(60*60)),2) " +
        "	from attendanceChange aa where staffId = ? and aa.attendanceType = 'jb' " +
        "	and DATE_FORMAT(aa.startDate, '%Y-%m-%d') >= DATE_FORMAT(?, '%Y-%m-%d')" +
        "	and DATE_FORMAT(aa.endDate, '%Y-%m-%d') <= DATE_FORMAT(?, '%Y-%m-%d') " +
        ") as 'overtime', " +
        "(select FORMAT(sum((UNIX_TIMESTAMP(aa.endDate) - UNIX_TIMESTAMP(aa.startDate))/(60*60)),2)  " +
        "	from attendanceChange aa where staffId = ? and aa.attendanceTypeDetailed ='qj_sj' " +
        "	and DATE_FORMAT(aa.startDate, '%Y-%m-%d') >= DATE_FORMAT(?, '%Y-%m-%d') " +
        "	and DATE_FORMAT(aa.endDate, '%Y-%m-%d') <= DATE_FORMAT(?, '%Y-%m-%d')) as 'thingLeave', " +
        "(select FORMAT(sum((UNIX_TIMESTAMP(aa.endDate) - UNIX_TIMESTAMP(aa.startDate))/(60*60)),2)  " +
        "	from attendanceChange aa where staffId = ? and aa.attendanceTypeDetailed ='qj_tx' " +
        "	and DATE_FORMAT(aa.startDate, '%Y-%m-%d') >= DATE_FORMAT(?, '%Y-%m-%d') " +
        "	and DATE_FORMAT(aa.endDate, '%Y-%m-%d') <= DATE_FORMAT(?, '%Y-%m-%d')) as 'offTime', " +
        "(select FORMAT(sum((UNIX_TIMESTAMP(aa.endDate) - UNIX_TIMESTAMP(aa.startDate))/(60*60)),2)  " +
        "	from attendanceChange aa where staffId = ? " +
        "	and aa.attendanceType = 'qj'" +
        "	and aa.attendanceTypeDetailed not in ('qj_tx','qj_sj') " +
        "	and DATE_FORMAT(aa.startDate, '%Y-%m-%d') >= DATE_FORMAT(?, '%Y-%m-%d') " +
        "	and DATE_FORMAT(aa.endDate, '%Y-%m-%d') <= DATE_FORMAT(?, '%Y-%m-%d')) as 'otherLeave'";
    //员工参与的培训次数
    var staffTrainCountSql = "select count(*) as trainSum from staffTrain s , course c where s.courseId = c.id and s.staffId = ? and c.courseDate > ? and c.courseDate < ? ";
    //培训情况汇总
    var staffTrainSql = "select sum(s.afterClassIntegration) as afterSum,sum(s.classIntegration) as classSum,sum(s.beforeClassIntegration) as beforeSum ,sum(c.scorse) as scorseSum from staffTrain s , course c where s.courseId = c.id and s.staffId = ? and c.courseDate > ? and c.courseDate < ? ";
    //服务情况汇总
    var serviceSql = "select COUNT(*) as serverCount from serviceMeet s where s.staffId = ? and s.meetTime >= ? and s.meetTime <= ?";
    //投诉情况汇总
    var complainSumSql = "select count(*) as complainSum,complainType from complain c , serviceMeet s where c.serviceMeetId = s.id and s.staffId = ? and c.complainTime > ? and c.complainTime < ? group by complainType ";
    //员工下次升级所需指标
    var levelSql = "select * from staffLevel s ,staff st where s.id = st.staffLevel and st.id = ?";
    async.series({
        //从打卡表找到员工在对应时间内的打卡记录
        attendanceDatas : function(callback){
            db.query(attendanceSql, [staffId,startDate+" 0:0:0" , endDate+" 23:59:59"], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //从考勤变更表中找到员工在对应时间内的变更情况
        staffAttendanceDatas : function(callback){
            db.query(staffAttendanceSql, [staffId,startDate ,startDate , endDate,endDate], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //从考勤类别明细表中找到每天工作时间段
        categoryMXDatas : function(callback){
            db.query(categoryMXSql, [staffId], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //从请假变更表中找到在该时间段内的工作情况
        leaveDatas : function(callback){
            db.query(leaveSql, [staffId,startDate ,endDate ,staffId,startDate ,endDate ,staffId,startDate ,endDate,staffId,startDate ,endDate ], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //参加的培训数量
        staffTrainSumDatas : function(callback){
            db.query(staffTrainCountSql, [staffId,startDate , endDate], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //上课前、上课中、上课后的积分情况
        staffTrainIntegrationDatas : function(callback){
            db.query(staffTrainSql, [staffId,startDate , endDate], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //获取用户在某段时间内参与了多少次服务
        serviceDatas : function(callback){
            db.query(serviceSql, [staffId,startDate , endDate], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //在该月份内对某员工的总投诉数量
        complainSumCount : function(callback){
            db.query(complainSumSql, [staffId,startDate , endDate], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //员工下次升级所需各种指标
        staffLevel : function(callback){
            db.query(levelSql, [staffId], function (cbData, err, rows, fields) {
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
