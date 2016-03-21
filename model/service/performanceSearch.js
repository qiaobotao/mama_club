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
module.exports.fetchPerformanceSearch = function(staffId,performanceDate,cb) {
    //考勤情况汇总
    var attendanceSql = "";
    //培训情况汇总
    var staffTrainSql = "";
    //服务情况汇总
    var serviceSql = "";
    //投诉情况汇总
    var complainSql = "";
    async.series({
        attendanceDatas : function(callback){
            db.query(attendanceSql, [], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        staffTrainDatas : function(callback){
            db.query(staffTrainSql, [], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        serviceDatas : function(callback){
            db.query(serviceSql, [], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        complainDatas : function(callback){
            db.query(complainSql, [], function (cbData, err, rows, fields) {
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
