/**
 * Created by qiaojoe on 16-2-21.
 * 入库处理方法
 */

var db = require('../../common/db');
var async = require('async');
var moment = require('moment');
var mainInTypeClassifyId = require('../../config').mainClassifyId.inType;
var mainBuyTypeClassifyId = require('../../config').mainClassifyId.buyType;
var myUtils = require('../../common/utils');


module.exports.list = function (shopId,buyer,buyType,buyDate,buyDateEnd,currentPage,cb) {

    var parm = "WHERE s.buyer LIKE '%"+buyer+"%' ";

    if (buyType != '') {
        parm = parm + " AND s.buyType ="+buyType;
    }

    if (buyDate != '') {
        parm = parm + " AND s.buyDate >= '"+buyDate+"'";
    }

    if (buyDateEnd != '') {
        parm = parm + " AND s.buyDate <='" + buyDateEnd+"'";
    }

    var sql_count = "SELECT count(*) as count FROM storeroomInLog s, storeroom st "+parm+" AND s.storeroomId = st.id AND st.shopId = "+shopId+"   ORDER BY s.dateline DESC";
    var start = (currentPage - 1) * 10;
    var end = 10;

    var sql_data = 'SELECT s.*, c.id AS inid, c.name AS inname, cc.id AS buyid, cc.name AS buyName, st.name AS storeroomName FROM storeroomInLog AS s, systemClassify AS c, systemClassify cc, storeroom st '+parm+' AND s.inType = c.id AND s.buyType = cc.id AND s.storeroomId = st.id AND st.shopId = '+shopId+' ORDER BY s.dateline DESC LIMIT ?,?';

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

/**
 * log 主表
 * @param buyType
 * @param inType
 * @param buyer
 * @param buyDate
 * @param storeroomId
 * @param distributorId
 * @param remarks
 * @param cb
 */
module.exports.insertInLog = function (buyType,inType,buyer,buyDate,storeroomId,distributorId,remarks,cb) {

    myUtils.printSystemLog('入库操作：'+buyType+'_'+inType+'_'+buyer+'_'+buyDate+'_'+storeroomId+'_'+distributorId+'_'+remarks);

    var sql = 'INSERT INTO storeroomInLog (buyType,inType,buyer,buyDate,storeroomId,distributorId,remarks,dateline) VALUES (?,?,?,?,?,?,?,?)';

    db.query(sql, [buyType,inType,buyer,buyDate,storeroomId,distributorId,remarks,new Date().getTime()], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * log 详细表
 * @param arr_obj  [{},{}] 结构
 * @param cb
 */
module.exports.insertInLogMX = function (mid,arr_obj,cb) {

    myUtils.printSystemLog('入库明细操作：'+mid+'_'+arr_obj);

    if (arr_obj.length == 0) {
        return;
    }
    var conn = db.db_conn();
    var sql = 'INSERT INTO storeroomInLogMX (inLogId,waresName,waresSerial,count,price) VALUES (?,?,?,?,?)';
    async.map(arr_obj, function(item, callback) {

        conn.query(sql, [mid,item.proName,item.proSerial,item.count,item.price], function (err, results) {
            if (!err) {
                callback(null, results);
            } else {
                db.close(conn);
                callback(err);
            }
        });
    }, function(err,results) {
            db.close(conn);
          cb(err, results);
    });
}

/**
 * 库存详情表
 * @param sid 库房id
 * @param arr_obj [{商品id,商品数量},{商品id,商品数量}]
 * @param cb
 */
module.exports.insertInventory = function (sid,arr_obj,cb) {

    myUtils.printSystemLog('入库修改库存操作：'+sid+'_'+arr_obj);

    if (arr_obj.length == 0) {
        return;
    }
    // 查看是否原来有库存
    var check_sql = 'SELECT * FROM inventory WHERE storeroomId = ? AND waresId = ?';
    // 入库操作
    var sql = 'INSERT INTO inventory (storeroomId,waresId,count) VALUES (?,?,?)';

    var update_sql = 'UPDATE inventory SET count = ? WHERE storeroomId = ? AND waresId = ?';
    var conn = db.db_conn();
    async.map(arr_obj, function(item, callback) {

        conn.query(check_sql, [sid,item.proId],function(err,results) {

            if (!err) {

                if (results.length == 0) {  // 原来没有记录

                    conn.query(sql, [sid,item.proId,item.count], function (err, results) {

                        if (!err) {
                            callback(null, results);
                        } else {
                            db.close(conn);
                            callback(err);
                        }
                    });
                } else {  // 有记录
                    var old_count = results[0].count;
                    conn.query(update_sql,[Number(item.count)+Number(old_count),sid,item.proId],function(err, results){
                        if (!err) {
                            callback(null, results);
                        } else {
                            db.close(conn);
                            callback(err);
                        }
                    });
                }
            } else {
                db.close(conn);
                callback(err);
            }
        });

    }, function(err,results) {
        db.close(conn);
        cb(err, results);
    });

}

/**
 * 查看入库单详情
 * @param inLogId
 * @param cb
 */
module.exports.detail = function (inLogId,cb) {

    // 分两步查，1先查表单头，2查表单内容
    var sql = 'SELECT l.buyer,l.buyDate,l.remarks,c. name AS buyTypeName,cc.name AS inTypeName,d.name AS distributorName,s.name AS storeroomName ' +
        'FROM storeroomInLog l,systemClassify c,systemClassify cc,storeroom s,distributor d ' +
        'WHERE l.buyType = c.id AND l.inType = cc.id AND l.distributorId = d.id AND l.storeroomId = s.id AND l.id = ?';

    var detail_sql = 'SELECT * FROM storeroomInLogMX Where inLogId = ?';

    db.query(sql,[inLogId],function (cbData, err, rows, fields) {

        if (!err) {
            if (rows.length != 0) {

                var log = rows[0];
                // 处理日期显示
                log.buyDate = moment(log.buyDate).format('YYYY-MM-DD');
                db.query(detail_sql, [inLogId], function (cbData, err, rows, fields) {

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
 * 当代码出错时，做删除
 * @param inLogId
 * @param cb
 */
module.exports.delInLog = function (inLogId) {

    var sql = 'DELETE FROM storeroomInLog WHERE id = ?';

    db.query(sql, [inLogId], function (err, results) {
        console.error(new Error('删除INLOG主表信息'));
    });
}

/**
 * 根据inlogid 删除
 * @param inLogId
 */
module.exports.delInLogMX = function (inLogId) {

    var sql = 'DELETE FROM storeroomInLogMX WHERE inLogId = ?';

    db.query(sql, [inLogId], function(err, results){
        console.error(new Error('删除INLOG明细表信息'));
    });
}

