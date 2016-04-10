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
    var attendanceSql = "";
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
        /*
        attendanceDatas : function(callback){
            db.query(attendanceSql, [], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        */
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
            db.query(levelSql, [staffId,], function (cbData, err, rows, fields) {
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
