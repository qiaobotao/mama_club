/**
 * Created by qiaojoe on 16-2-27.
 * 出库管理service
 */

var db = require('../../common/db');
var async = require('async');
var mainOutTypeClassifyId = require('../../config').mainClassifyId.outType;



module.exports.list = function (outType,oper,outDate,currentPage,cb) {

    var parm = "WHERE s.oper LIKE '%"+oper+"%' ";

    if (outType != '') {
        parm = parm + " AND s.outType ="+outType;
    }

    if (outDate != '') {
        parm = parm + " AND s.outDate ="+outDate;
    }

    var sql_count = 'SELECT count(*) as count FROM storeroomOutLog s '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;

    var sql_data = 'SELECT s.*, c.id AS cid, c.name AS outName, r.name AS storeroomName FROM storeroomOutLog AS s, systemClassify AS c, storeroom r  '+parm+' AND s.outType = c.id AND s.storeroomId = r.id ORDER BY dateline DESC LIMIT ?,?';
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
 * 获取出库方式
 * @param cid
 * @param cb
 */
module.exports.getOutTypeClassify = function (cb) {

    var sql = 'SELECT id,name FROM systemClassify WHERE parentId = ?';
    db.query(sql, [mainOutTypeClassifyId], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 操作outLog主表
 * @param oper
 * @param outType
 * @param outDate
 * @param storeroomId
 * @param remarks
 * @param cb
 */
module.exports.insertOutLog = function (oper,outType,outDate,storeroomId,remarks,cb) {

    var sql = 'INSERT INTO storeroomOutLog (outType,oper,outDate,storeroomId,remarks,dateline) VALUES (?,?,?,?,?,?)';

    db.query(sql, [outType,oper,outDate,storeroomId,remarks,new Date().getTime()], function (cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 操作明细表
 * @param mid
 * @param arr_obj  [{},{}] 结构
 * @param cb
 */
module.exports.insertOutLogMX = function (mid,arr_obj,cb) {

    if (arr_obj.length == 0) {
        return;
    }

    var sql = 'INSERT INTO storeroomOutLogMX (outLogId,waresId,count,price) VALUES (?,?,?,?)';
    async.map(arr_obj, function(item, callback) {

        db.query(sql, [item.outLogId,item.waresId,item.count,item.price], function (cbData, err, rows, fields) {
            if (!err) {
                callback(null, rows);
            } else {
                callback(err);
            }
        });
    }, function(err,results) {
        cb(err, results);
    });
}

/**
 * 库存详情表
 * @param sid 库房id
 * @param arr_obj [{商品id,商品数量},{商品id,商品数量}]
 * @param cb
 */
module.exports.updateInventory = function (sid,arr_obj,cb) {



}
