/**
 * Created by qiaojoe on 16-2-18.
 */

var db = require('../../common/db');
var async = require('async');
var mainDistributorClassifyId = require('../../config').mainClassifyId.distributor;

/**
 * 分页获取经销商列表
 * @param name
 * @param cid
 * @param currentPage
 * @param cb
 */
module.exports.list = function (name,cid,currentPage,cb) {

    var parm = "WHERE s.name LIKE '%"+name+"%' ";

    if (cid != '') {
        parm = parm + " AND classify ="+cid;
    }

    var sql_count = 'SELECT count(*) as count FROM distributor s '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT s.*, c.id AS cid, c.name AS cname FROM distributor AS s, systemClassify AS c '+parm+' AND s.classify = c.id ORDER BY dateline DESC LIMIT ?,?';

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
 * 获取经销商分类
 * @param cb
 */
module.exports.getDistributorClassify = function (cb) {

    var sql = 'SELECT id,name FROM systemClassify WHERE parentId = ?';
    db.query(sql, [mainDistributorClassifyId], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 添加经销商
 * @param name
 * @param address
 * @param remarks
 * @param classify
 * @param principal
 * @param tel
 * @param cb
 */
module.exports.add = function (name, address, remarks,classify, principal, tel ,cb) {

    var add_sql = 'INSERT INTO distributor (name, address, remarks, classify, principal, tel, status, dateline) VALUES (?,?,?,?,?,?,?,?)';

    db.query(add_sql, [name,address,remarks,classify,principal,tel,'1',new Date().getTime()], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取经销商详情
 * @param id
 * @param cb
 */
module.exports.getSingleDistributor = function (id, cb) {

    var get_sql = 'SELECT s.*, c.name AS cname, c.id AS cid FROM distributor s, systemClassify c WHERE s.id = ? AND s.classify = c.id';
    db.query(get_sql, [id], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 删除经销商
 * @param id
 * @param cb
 */
module.exports.del = function (id, cb) {

    var del_sql = 'DELETE FROM distributor WHERE id = ?';

    db.query(del_sql, [id], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 更新经销商
 * @param id
 * @param name
 * @param cid
 * @param principal
 * @param tel
 * @param address
 * @param remark
 * @param cb
 */
module.exports.update = function (id,name,cid,principal,tel,address,remark,cb) {

    var update_sql = 'UPDATE distributor SET name = ?, classify = ?, principal = ?, tel = ?, address = ?, remarks = ? WHERE id = ?';

    db.query(update_sql, [name,cid,principal,tel,address,remark,id], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取所有经销商
 * @param cb
 */
module.exports.getAllDistributors = function (cb) {

    var sql = "SELECT id,name FROM distributor ORDER BY dateline asc";
    db.query(sql, [], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}
