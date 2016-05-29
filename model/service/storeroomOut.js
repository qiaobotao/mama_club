/**
 * Created by qiaojoe on 16-2-27.
 * 出库管理service
 */

var db = require('../../common/db');
var async = require('async');
var moment = require('moment');
var mainOutTypeClassifyId = require('../../config').mainClassifyId.outType;
var myUtils = require('../../common/utils');


module.exports.list = function (shopId,outType,oper,outDate,currentPage,cb) {

    var parm = "WHERE s.oper LIKE '%"+oper+"%' ";

    if (outType != '') {
        parm = parm + " AND s.outType ="+outType;
    }

    if (outDate != '') {
        parm = parm + " AND s.outDate ="+outDate;
    }

    var sql_count = 'SELECT count(*) as count FROM storeroomOutLog s,storeroom st '+parm+'  AND s.storeroomId = st.id AND st.shopId='+shopId+' ORDER BY s.dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = 10;

    var sql_data = 'SELECT s.*, c.id AS cid, c.name AS outName, r.name AS storeroomName FROM storeroomOutLog AS s, systemClassify AS c, storeroom r  '+parm+' AND s.outType = c.id AND s.storeroomId = r.id AND r.shopId = '+shopId+' ORDER BY s.dateline DESC LIMIT ?,?';
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
module.exports.insertOutLog = function (oper,outType,outDate,storeroomId,remarks,address,consignee,consigneeTel,cb) {

    myUtils.printSystemLog('出库操作'+oper+'_'+outType+'_'+outDate+'_'+storeroomId+'_'+remarks+'_'+address+'_'+consignee);

    var sql = 'INSERT INTO storeroomOutLog (outType,oper,outDate,storeroomId,remarks,dateline,address,consignee,consigneeTel) VALUES (?,?,?,?,?,?,?,?,?)';

    db.query(sql, [outType,oper,outDate,storeroomId,remarks,new Date().getTime(),address,consignee,consigneeTel], function (cbData, err, rows, fields) {

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

    myUtils.printSystemLog('出库明细操作'+mid+'_'+arr_obj);

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
 * 添加教室产生的出库单
 * @param oper
 * @param arr_obj
 * @param cb
 */
module.exports.addClassroom_AddOutLog = function(classroomName,classroomId,arr_obj,cb) {

    myUtils.printSystemLog('添加教室形成出库单'+classroomName+'_'+arr_obj+'_'+classroomId);

    var insertOutLog = 'INSERT INTO storeroomOutLog (outType,oper,outDate,storeroomId,dateline,serviceId) VALUES (?,?,?,?,?,?)';


    async.map(arr_obj, function(item, finalCB) {

        var arr = item.data; // 数据结构 [[],[],....]
        var storeroomId = item.storeroomId;

        if (arr.length != 0) {
               // 52 就是分类管理里面的创建教室的 id
            db.query(insertOutLog,['52',classroomName,new Date(),storeroomId,new Date().getTime(),classroomId],function(cbData, err, rows, fields) {

                if(!err) {
                    var mid = rows.insertId;
                    addClassroom_ProMX(mid,arr,function(err, results) {
                        if (!err) {
                            addClassroom_updateInventory(storeroomId,arr,function(err, results){
                                if(!err) {
                                    finalCB(null, mid);  // 返回主表id
                                } else {
                                    finalCB(err);
                                }
                            })
                        } else {
                            finalCB(err);
                        }
                    });
                } else {
                    finalCB(err);
                }
            });
        } else {
            finalCB(null,null);
        }
    },function(err, results) {
        cb(err,results);
    });
}

/**
 * 库存详情表
 * @param sid 库房id
 * @param arr_obj [{商品id,商品数量},{商品id,商品数量}]
 * @param cb
 */
module.exports.updateInventory = function (sid,arr_obj,cb) {

    myUtils.printSystemLog('出库单修改库存'+sid+'_'+arr_obj);

    if (arr_obj.length == 0) {
        return;
    }

    var sql = 'UPDATE inventory SET count = count - ? WHERE storeroomId = ? AND waresId = ?';

    async.map(arr_obj, function(item, callback) {

        db.query(sql, [item.count,sid,item.proId],function(cbData, err, rows, fields) {

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
 * @param classroomId  教室id
 * @param proId 需要验证产品id
 * @param num   当前填写的数量
 * @param cb
 */
module.exports.checkResidueEditClassroom = function (classroomId, proId, num, cb) {

    var getOutLogId = 'SELECT outLogId,storeroomId FROM classroom WHERE id = ?';
    var getOriginalNum = 'SELECT mx.count FROM storeroomOutLog out, storeroomOutLogMX mx WHERE out.id = mx.outLogId AND out.storeroomId = ? AND mx.waresId = ? AND out.id = ?';

    db.query(getOutLogId,[classroomId],function(cbData, err, rows, fields) {

        if (!err) {
            if (rows.length == 0) {
                cb(null,false);
                return;
            }
            var outLogId = rows[1].outLogId;
            var storeroomId = rows[1].storeroomId;
            db.query(getOriginalNum, [storeroomId,proId,outLogId], function(cbData, err, rows, fields) {
                if (!err) {
                    if(rows.length == 0) {
                       cb(null,false);
                        return;
                    }
                    // 这里比较出库单中的count 和 更新后输入框中的 num 如果 count 大于或者等于 num，返回true，如果num大于count，求出差值，然后在验证目前库存的数量
                } else {
                    cb(err);
                }
            });
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
    var sql = 'SELECT l.oper,l.outDate,l.remarks,l.address,l.consignee,l.consigneeTel, s.name AS storeroomName, c.name AS outTypeName ' +
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


function addClassroom_ProMX(mid, arr, cb) {

    myUtils.printSystemLog('天机教室出库单明细'+mid+'_'+arr);

    var sql = 'INSERT INTO storeroomOutLogMX (outLogId,waresSerial,waresName,count,price,waresId) VALUES (?,?,?,?,?,?)';
    var conn = db.db_conn();
    async.map(arr, function(item, callback) {

        conn.query(sql, [mid,item.proSerial,item.proName,item.count,item.bname,item.proId], function (err,results) {
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


function addClassroom_updateInventory (sid,arr_obj,cb) {

    myUtils.printSystemLog('天机教室出库库存变化'+sid+'_'+arr_obj);

    var sql = 'UPDATE inventory SET count = count - ? WHERE storeroomId = ? AND waresId = ?';
    var conn = db.db_conn();
    async.map(arr_obj, function(item, callback) {

        conn.query(sql, [item.count,sid,item.proId],function(err,results) {

            if (!err) {

                callback(null, results);

            } else {  // 有记录
                db.close(conn);
                callback(err);
            }
        });

    }, function(err,results) {
        db.close(conn);
        cb(err, results);
    });

}
