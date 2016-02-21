/**
 * Created by qiaojoe on 15-12-12.
 * 提供商品的数据访问接口
 */

var db = require('../../common/db');
var mainWaresClassifyId = require('../../config').mainClassifyId.wares;
var async = require('async');
/**
 * 增加商品
 * @param name
 * @param longname
 * @param brand
 * @param standard
 * @param serialNumber
 * @param remarks
 * @param lowData
 * @param cb
 */
module.exports.insertWares = function(name, longname, brand, standard, serialNumber, remarks, lowData, cid, cb) {

    var sql = 'INSERT INTO wares (name, longname, brand, standard, serialNumber, remarks, lowData, classify) VALUES (?,?,?,?,?,?,?,?)';
    db.query(sql, [name, longname, brand, standard, serialNumber, remarks, lowData, cid], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 分页商品信息
 * @param pages
 * @param count
 * @param cb
 */
module.exports.list = function(name,cid,currentPage, cb) {

    var parm = "WHERE s.name LIKE '%"+name+"%' ";

    if (cid != '') {
        parm = parm + " AND classify ="+cid;
    }

    var sql_count = 'SELECT count(*) as count FROM wares s '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT s.*, c.id AS cid, c.name AS cname FROM wares AS s, systemClassify AS c '+parm+' AND s.classify = c.id ORDER BY dateline DESC LIMIT ?,?';

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
 * 更新商品信息
 * @param id
 * @param name
 * @param longname
 * @param brand
 * @param standard
 * @param serialNumber
 * @param remarks
 * @param lowData
 * @param cb
 */
module.exports.updateWares = function(id, name, longname, brand, standard, serialNumber, remarks, lowData, cid, cb) {

    var sql = 'UPDATE wares SET name = ?, longname = ?, brand = ?, standard = ?, serialNumber = ?, remarks = ?, lowData = ?, classify = ? WHERE id = ?';
    var par = [name, longname, brand, standard, serialNumber, remarks, lowData, cid, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 删除商品
 * @param id
 * @param cb
 */
module.exports.delWares = function (id, cb) {

    var sql = 'DELETE FROM wares WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取商品详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleWares =function (id, cb) {

    var sql = 'SELECT w.*,c.id AS cid, c.name AS cname FROM wares w, systemClassify c  WHERE  w.classify = c.id AND w.id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

module.exports.getWaresClassify = function (cb) {

    var sql = 'SELECT id,name FROM systemClassify WHERE parentId = ?';
    db.query(sql, [mainWaresClassifyId], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}