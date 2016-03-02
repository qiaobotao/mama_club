/**
 * Created by qiaojoe on 16-2-12.
 * 服务管理
 */


var db = require('../../common/db');
var async = require('async');
var mainServiceClassifyId = require('../../config').mainClassifyId.serivce;

/**
 * 分页获取所有服务
 * @param cb
 */
module.exports.list = function(name,cid,currentPage,cb) {

    var parm = "WHERE status=1 s.name LIKE '%"+name+"%' ";

    if (cid != '') {
       parm = parm + " AND classify ="+cid;
    }

    var sql_count = 'SELECT count(*) as count FROM service s '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT s.*, c.id AS cid, c.name AS cname FROM service AS s, systemClassify AS c '+parm+' AND s.classify = c.id ORDER BY dateline DESC LIMIT ?,?';

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
 * 获取所有服务分类
 */
module.exports.getServiceClassify = function (cb) {

    var sql = 'SELECT id,name FROM systemClassify WHERE parentId = ?';
    db.query(sql, [mainServiceClassifyId], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 增加服务种类
 * @param name
 * @param content
 * @param cid
 * @param price
 * @param remark
 * @param cb
 */

module.exports.add = function(name,content,cid,price,remark,cb) {

    var add_sql = 'INSERT INTO service (name, content, classify, price, remark, status, dateline) VALUES (?,?,?,?,?,?,?)';

    db.query(add_sql, [name,content,cid,price,remark,'1',new Date().getTime()], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 删除
 * @param id
 * @param cb
 */
module.exports.del = function (id,cb) {

    var del_sql = 'DELETE FROM service WHERE id = ?';

    db.query(del_sql, [id], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 修改
 * @param id
 * @param name
 * @param content
 * @param cid
 * @param price
 * @param remark
 * @param cb
 */
module.exports.update = function (id,name,content,cid,price,remark,cb) {

    var update_sql = 'UPDATE service SET name = ?, content = ?, classify = ?, price = ?, remark = ? WHERE id = ?';

    db.query(update_sql, [name,content,cid,price,remark,id], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 查看
 * @param id
 * @param cb
 */
module.exports.getSingleService = function(id,cb) {

    var get_sql = 'SELECT s.*, c.name AS cname, c.id AS cid FROM service s, systemClassify c WHERE s.id = ? AND s.classify = c.id';
    db.query(get_sql, [id], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}


