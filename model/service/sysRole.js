/**
 * Created by kuanchang on 16/2/29.
 */


var db = require('../../common/db');
var async = require('async');
/**
 * 增加角色
 * @param name
 * @param cb
 */
module.exports.insertSysRole = function(name,describe, cb) {

    var sql = 'INSERT INTO sysRole (name,describe,dateline) VALUES (?,?,?)';
    db.query(sql, [name,describe,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除角色
 * @param id
 * @param cb
 */
module.exports.delSysRole= function (id, cb) {

    var sql = 'DELETE from sysRole WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}


/**
 * 获取所有角色
 * @param name
 * @param currentPage
 * @param cb
 */
module.exports.fetchAllSysRole = function(name,currentPage,cb) {

    var parm = "WHERE name LIKE '%"+name+"%' ";

    var sql_count = 'SELECT count(*) as count FROM sysRole '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT * FROM sysRole '+parm+' ORDER BY dateline DESC LIMIT ?,?';

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
 * 修改角色
 * @param id
 * @param name
 * @param cb
 */
module.exports.updateSysRole = function(id, name,describe, cb) {
    var sql = 'UPDATE sysRole SET name = ?,describe = ? WHERE id = ?';
    var par = [name, id];
    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取角色详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleSysRole =function (id, cb) {
    var sql = 'SELECT * FROM sysRole WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}