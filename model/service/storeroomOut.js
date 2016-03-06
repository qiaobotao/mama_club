/**
 * Created by qiaojoe on 16-2-27.
 * 出库管理service
 */

var db = require('../../common/db');
var async = require('async');
var moment = require('moment');
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

    var sql = 'INSERT INTO storeroomOutLogMX (outLogId,waresSerial,waresName,count,price,waresId) VALUES (?,?,?,?,?,?)';
    async.map(arr_obj, function(item, callback) {

        db.query(sql, [mid,item.proSerial,item.proName,item.count,item.price,item.proId], function (cbData, err, rows, fields) {
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

    if (arr_obj.length == 0) {
        return;
    }

    var sql = 'UPDATE inventory SET count = count - ? WHERE storeroomId = ? AND waresId = ?';

    async.map(arr_obj, function(item, callback) {

        db.query(sql, [item.num,sid,item.proId],function(cbData, err, rows, fields) {

            if (!err) {

                callback(null, rows);

            } else {  // 有记录
                callback(err);
            }
        });

    }, function(err,results) {
        cb(err, results);
    });

}


/**
 * 检查库存量
 * @param storeroomId
 * @param waresId
 * @param num
 * @param cb
 */
module.exports.checkResidue = function (storeroomId, waresId, num, cb) {

    var sql = 'SELECT count FROM inventory WHERE storeroomId = ? AND waresId = ?';

    db.query(sql, [storeroomId,waresId], function (cbData, err, rows, fields) {

        if (!err) {
            if (rows.length != 0) {
                var temp = rows[0].count - num;
                cb(null, temp >= 0 ? true : false);
            } else {
                cb(null, false);
            }
        } else {
            cb(err);
        }
    });
}

/**
 * 获取出库表详情
 * @param outLogId
 * @param cb
 */
module.exports.detail = function (outLogId,cb) {

    // 分两步查，1先查表单头，2查表单内容
    var sql = 'SELECT l.oper,l.outDate,l.remarks, s.name AS storeroomName, c.name AS outTypeName ' +
        'FROM storeroomOutLog l, systemClassify c, storeroom s ' +
        'WHERE l.outType = c.id AND l.storeroomId = s.id AND l.id = ?';

    var detail_sql = 'SELECT * FROM storeroomOutLogMX Where outLogId = ?';

    db.query(sql,[outLogId],function (cbData, err, rows, fields) {

        if (!err) {
            if (rows.length != 0) {

                var log = rows[0];
                // 处理日期显示
                log.outDate = moment(log.outDate).format('YYYY-MM-DD');
                db.query(detail_sql, [outLogId], function (cbData, err, rows, fields) {

                    if (!err) {
                        var obj = {};
                        obj.log = log;
                        obj.logmx = rows;
                        cb (null, obj);
                    } else {
                        cb(err);
                    }
                });
            } else { // 主表没有，直接返回空对象
                cb(null,{});
            }
        } else {
            cb(err);
        }
    });

}

/**
 * 出错后 删掉
 * @param outLogId
 */
module.exports.delOutLog = function (outLogId) {

    var sql = 'DELETE FROM storeroomOutLog WHERE id = ?';
    db.query(sql, [outLogId], function (err, results) {
        console.error(new Error('删除OUTLOG主表信息'));
    });
}

/**
 * 出错后删掉
 * @param outLogId
 */
module.exports.delOutLogMX = function (outLogId) {

    var sql = 'DELETE FROM storeroomOutLogMX WHERE outLogId = ?';
    db.query(sql, [outLogId], function (err, results) {
        console.error(new Error('删除OUTLOG明细表信息'));
    });

}
