/**
 * Created by qiaojoe on 16-2-21.
 * 入库处理方法
 */

var db = require('../../common/db');
var async = require('async');
var mainInTypeClassifyId = require('../../config').mainClassifyId.inType;
var mainBuyTypeClassifyId = require('../../config').mainClassifyId.buyType;

module.exports.list = function (buyer,buyType,buyDate,currentPage,cb) {

    var parm = "WHERE s.buyer LIKE '%"+buyer+"%' ";

    if (buyType != '') {
        parm = parm + " AND s.buyType ="+buyType;
    }

    if (buyDate != '') {
        parm = parm + " AND s.buyDate ="+buyDate;
    }

    var sql_count = 'SELECT count(*) as count FROM storeroomInLog s '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;

    var sql_data = 'SELECT s.*, c.id AS inid, c.name AS inname, cc.id AS buyid, cc.name AS buyName FROM storeroomInLog AS s, systemClassify AS c, systemClassify cc '+parm+' AND s.inType = c.id AND s.buyType = cc.id ORDER BY dateline DESC LIMIT ?,?';

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
 * 获取购买类型
 * @param cb
 */
module.exports.getBuyTypeClassify = function (cb) {

    var sql = 'SELECT id,name FROM systemClassify WHERE parentId = ?';
    db.query(sql, [mainBuyTypeClassifyId], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取所有入库方式
 * @param cb
 */
module.exports.getInTypeClassify = function (cb) {

    var sql = 'SELECT id,name FROM systemClassify WHERE parentId = ?';
    db.query(sql, [mainInTypeClassifyId], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}
