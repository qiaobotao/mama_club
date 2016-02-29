/**
 * Created by kuanchang on 16/2/29.
 */


var db = require('../../common/db');
var async = require('async');
/**
 * 增加系统用户
 * @param userName
 * @param password
 * @param shopId
 * @param staffId
 * @param cb
 */
module.exports.insertSysUser = function(userName,password,shopId,staffId, cb) {

    var sql = 'INSERT INTO sysUser (userName,password,shopId,staffId,activity,dateline) VALUES (?,?,?,?,?,?)';
    db.query(sql, [userName,password,shopId,staffId,'1',new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 增加系统用户与角色关系表
 * @param userId
 * @param roleId
 * @param cb
 */
module.exports.insertSysUserRole = function(userId,roleId, cb) {

    var sql = 'INSERT INTO sysUserRole (userId,roleId,dateline) VALUES (?,?,?)';
    db.query(sql, [userId,roleId,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除系统用户
 * @param id
 * @param cb
 */
module.exports.delSysUser= function (id, cb) {

    var sql = 'DELETE from sysUser WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}


/**
 * 获取所有系统用户
 * @param name
 * @param currentPage
 * @param cb
 */
module.exports.fetchAllSysUser = function(userName,currentPage,cb) {

    var parm = "WHERE userName LIKE '%"+userName+"%' ";

    var sql_count = 'SELECT count(*) as count FROM sysUser '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT * FROM sysUser '+parm+' ORDER BY dateline DESC LIMIT ?,?';

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
 * 修改系统用户
 * @param id
 * @param name
 * @param cb
 */
module.exports.updateSysUser = function(id, userName,password,shopId,staffId, cb) {
    var sql = 'UPDATE sysUser SET userName = ?,password=?,shopId=?,staffId=? WHERE id = ?';
    var par = [userName,password,shopId,staffId, id];
    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取系统用户详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleSysUser =function (id, cb) {
    var sql = 'SELECT * FROM sysUser WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}