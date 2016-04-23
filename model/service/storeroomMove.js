/**
 * Created by qiaojoe on 16-3-6.
 */

var db = require('../../common/db');
var async = require('async');
var moment = require('moment');
var mainInTypeClassifyId = require('../../config').mainClassifyId.inType;



module.exports.list = function (shopId,outId,oper,inId,moveDate,currentPage,cb) {

    var parm = "WHERE s.oper LIKE '%"+oper+"%' ";

    if (outId != '') {
        parm = parm + " AND s.outStoreroomId ="+outId;
    }

    if (inId != '') {
        parm = parm + " AND s.inStoreroomId ="+inId;
    }

    if (moveDate != '') {
        parm = parm + " AND s.moveDate ="+moveDate;
    }

    var sql_count = 'SELECT count(*) as count FROM storeroomMoveLog s, storeroom st '+parm+' AND s.outStoreroomId = st.id AND st.shopId='+shopId+' ORDER BY s.dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = 10;

    var sql_data = 'SELECT s.*, r.name AS inStoreroomName, rr.name AS outStoreName FROM storeroomMoveLog AS s,  storeroom AS r, storeroom AS rr  '+parm+' AND  s.inStoreroomId = r.id AND s.outStoreroomId = rr.id AND r.shopId='+shopId+' ORDER BY s.dateline DESC LIMIT ?,?';
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
 * 插入移库主表
 * @param oper
 * @param outId
 * @param inId
 * @param remarks
 * @param cb
 */
module.exports.insertMoveLog = function (oper,outId,inId,remarks,cb) {

    var sql = 'INSERT INTO storeroomMoveLog (oper,moveDate,outStoreroomId,inStoreroomId,remarks,dateline) VALUES (?,?,?,?,?,?)';

    db.query(sql,[oper,new Date(),outId,inId,remarks,new Date().getTime()],function(cbData, err, rows, fields) {

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
module.exports.insertMoveLogMX = function (mid,arr_obj,cb) {

    if (arr_obj.length == 0) {
        return;
    }
    var sql = 'INSERT INTO storeroomMoveLogMX (moveLogId,waresSerial,count,waresName,waresId) VALUES (?,?,?,?,?)';
    async.map(arr_obj, function(item, callback) {

        db.query(sql, [mid,item.proSerial,item.count,item.proName,item.proId], function (cbData, err, rows, fields) {
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
 * @param sid out 出库房id
 * @param sid in  入库id
 * @param arr_obj [{商品id,商品数量},{商品id,商品数量}]
 * @param cb
 */
module.exports.updateInventory = function (sid_out,sid_in,arr_obj,cb) {

    if (arr_obj.length == 0) {
        return;
    }
    // 出库
    var sql = 'UPDATE inventory SET count = count - ? WHERE storeroomId = ? AND waresId = ?';
    var check_sql = 'SELECT * FROM inventory WHERE storeroomId = ? AND waresId = ?';
    var update_sql = 'UPDATE inventory SET count = count + ? WHERE storeroomId = ? AND waresId = ?';
    var insert_sql = 'INSERT INTO inventory (storeroomId,waresId,count) VALUES (?,?,?)';

    async.map(arr_obj, function(item, callback) {
        // 先减去，后增加
        db.query(sql, [item.count,sid_out,item.proId],function(cbData, err, rows, fields) {

            if (!err) {
                // 先查看原来有没有数据，没有直接insert 有update
                db.query(check_sql,[sid_in,item.proId],function(cbData, err, rows, fields) {

                    if (!err) {
                        // 有数据，update
                        if (rows.length != 0) {

                            db.query(update_sql,[item.count,sid_in,item.proId],function (cbData, err, rows, fields) {

                                if (!err) {
                                    callback(null, rows);
                                } else {
                                    callback(err);
                                }
                            });
                        } else {

                            db.query(insert_sql, [sid_in,item.proId,item.count], function(cbData, err, rows, fields) {

                                if (!err) {
                                    callback(null, rows);
                                } else {
                                    callback(err);
                                }

                            });
                        }
                    } else {
                        callback(err);
                    }
                })
            } else {  // 有记录
                callback(err);
            }
        });

    }, function(err,results) {
        cb(err, results);
    });

}

/**
 * 查看移库详情
 * @param moveLogId
 * @param cb
 */
module.exports.detail = function (moveLogId,cb) {

    // 分两步查，1先查表单头，2查表单内容
    var sql = 'SELECT l.oper,l.moveDate,l.remarks, s.name AS outStoreroomName, ss.name AS inStoreroomName ' +
        'FROM storeroomMoveLog l, storeroom s, storeroom ss ' +
        'WHERE l.outStoreroomId = s.id AND l.inStoreroomId = ss.id AND l.id = ?';

    var detail_sql = 'SELECT * FROM storeroomMoveLogMX Where moveLogId = ?';

    db.query(sql,[moveLogId],function (cbData, err, rows, fields) {

        if (!err) {
            if (rows.length != 0) {

                var log = rows[0];
                // 处理日期显示
                log.outDate = moment(log.outDate).format('YYYY-MM-DD');
                db.query(detail_sql, [moveLogId], function (cbData, err, rows, fields) {

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
 * @param moveLogId
 */
module.exports.delMoveLog = function (moveLogId) {

    var sql = 'DELETE FROM storeroomMoveLog WHERE id = ?';
    db.query(sql, [moveLogId], function (err, results) {
        console.error(new Error('删除MOVELOG主表信息'));
    });
}

/**
 * 出错后删掉
 * @param moveLogId
 */
module.exports.delMoveLogMX = function (moveLogId) {

    var sql = 'DELETE FROM storeroomMoveLogMX WHERE moveLogId = ?';
    db.query(sql, [moveLogId], function (err, results) {
        console.error(new Error('删除MOVELOG明细表信息'));
    });

}
