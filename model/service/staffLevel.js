/**
 * Created by qiaojoe on 16-3-18.
 * 员工等级管理
 */


var db = require('../../common/db');
var async = require('async');
/**
 * 增加员工等级
 * @param name
 * @param describe
 * @param serverNum
 * @param attendanceNum
 * @param trainNum
 * @param cb
 */
module.exports.insertStaffLevel = function(name,describe,serverNum,attendanceNum,trainNum,remarks, cb) {

    var sql = 'INSERT INTO staffLevel (`name`,`describe`,serverNum,attendanceNum,trainNum,remarks,dateline) VALUES (?,?,?,?,?,?,?)';
    db.query(sql, [name,describe,serverNum,attendanceNum,trainNum, remarks,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除员工等级
 * @param id
 * @param cb
 */
module.exports.delStaffLevel= function (id, cb) {

    var sql = 'DELETE FROM staffLevel WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}


/**
 * 获取所有员工等级
 * @param cb
 */
module.exports.fetchAllStaffLevel = function(name,currentPage,cb) {

    var parm = "WHERE name LIKE '%"+name+"%'  ";

    var sql_count = 'SELECT count(*) as count FROM staffLevel '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT * FROM staffLevel '+parm+' ORDER BY dateline DESC LIMIT ?,?';

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
 * 修改员工等级
 * @param id
 * @param name
 * @param address
 * @param principal
 * @param cb
 */
module.exports.updateStaffLevel = function(id, name,describe,serverNum,attendanceNum,trainNum,remarks, cb) {

    var sql = 'UPDATE staffLevel SET `name` = ?, `describe` = ?, serverNum = ?, attendanceNum = ?, trainNum = ?,remarks=? WHERE id = ?';
    var par = [name,describe,serverNum,attendanceNum,trainNum,remarks, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取员工等级详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleStaffLevel =function (id, cb) {

    var sql = 'SELECT * FROM staffLevel WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 分页员工等级信息
 * @param cb
 */
module.exports.fetchStaffLevels = function(cb) {

    var sql = 'SELECT * FROM staffLevel ORDER BY dateline DESC ';
    db.query(sql, [], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}