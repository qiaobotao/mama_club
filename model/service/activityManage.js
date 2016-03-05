/**
 * Created by Administrator on 2016/1/31.
 */
/**
 * Created by qiaojoe on 16-1-2.
 * 教室管理
 */


var db = require('../../common/db');
var async = require('async');

module.exports.insertActivityManage = function(activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,describe,status, cb) {

    var sql = 'INSERT INTO activityManage(activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,`describe`,`status`) VALUES (?,?,?,?,?,?,?)';
    db.query(sql, [activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,describe,status], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.updateActivityManage = function(id,activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,describe,status, cb) {

    var sql = 'UPDATE activityManage set activityName=?,activityType=?,memberCardType=?,effectiveTimeStart=?,effectiveTimeEnd=?,`describe`=?,`status`=? where id=?';
    db.query(sql, [activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,describe,status,id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
module.exports.fetchAllActivityManage = function(activityName,activityType,effectiveTimeStart,effectiveTimeEnd,status,currentPage,cb) {

    var parm = '';
    if (activityName != '')
        parm += " WHERE activityName like '%" + activityName + "%'";
    if (activityType != '')
        parm += " and activityType = '" + activityType + "'";
    if (effectiveTimeStart != '')
        parm += " and effectiveTimeStart >= '" + effectiveTimeStart + "'";
    if (effectiveTimeEnd != '')
        parm += " and effectiveTimeEnd <= '" + effectiveTimeEnd + "'";
    if (status != '')
        parm += " and status = '" + status + "'";

    var sql_count = 'SELECT count(*) as count FROM activityManage';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = "SELECT id,activityName,activityType,memberCardType,CONCAT(effectiveTimeStart,'~',effectiveTimeEnd) AS effectiveTime,`describe`,`status` FROM activityManage "+ parm +' LIMIT ?,?';

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
module.exports.fetchSingleActivityManage =function (id, cb) {

    var sql = 'SELECT * FROM activityManage WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
module.exports.delActivityManage= function (id, cb) {

    var sql = 'DELETE FROM activityManage WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}