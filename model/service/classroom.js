/**
 * Created by qiaojoe on 16-1-2.
 * 教室管理
 */


var db = require('../../common/db');
var async = require('async');
var mainClassroomClassifyId = require('../../config').mainClassifyId.classroomType;


/**
 * 获取教室分类
 * @param cb
 */
module.exports.getClassroomClassify = function (cb) {

    var sql = 'SELECT id,name FROM systemClassify WHERE parentId = ?';
    db.query(sql, [mainClassroomClassifyId], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 添加教室
 * @param serialNumber
 * @param name
 * @param classCode
 * @param classType
 * @param remark
 * @param materialid
 * @param cb
 */
module.exports.insertClassroom = function(shopId,serialNumber,name,classType,remark,materialId, cb) {

    var sql = 'INSERT INTO classroom (serialNumber,name,classType,remark,outLogId,dateline,status,shopId) VALUES (?,?,?,?,?,?,?,?)';
    db.query(sql, [serialNumber,name,classType,remark,materialId,new Date().getTime(),'1',shopId], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            console.log(err);
            cb(err);
        }
    });
};

/**
 * 删除教室
 * @param id
 * @param cb
 */
module.exports.setClassroomStatus= function (id, type, cb) {

    var sql = 'UPDATE classroom SET status = ?  WHERE id = ?';
    db.query(sql, [type,id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取所有门店
 * @param cb
 */
module.exports.fetchAllCLassRoom = function(shopId,className,classCode,currentPage,cb) {

    var parm = " WHERE r.name LIKE '%"+className+"%' AND r.serialNumber LIKE '%"+classCode+"%' ";

    var parm = parm + ' AND r.shopId = '+shopId;

    var sql_count = 'SELECT count(*) as count FROM classroom AS r '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT r.id,r.name,r.serialNumber,r.status,c.name AS cname FROM classroom AS r,systemClassify AS c '+parm+' AND r.classType = c.id ORDER BY dateline DESC LIMIT ?,?';

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
 * 教室详情
 * @param id
 * @param cb
 */
module.exports.detail = function (id, cb) {

    var sql = 'SELECT c.serialNumber,c.name,c.remark,c.status,cc.name AS cname,c.outLogId FROM classroom AS c, systemClassify  AS cc WHERE cc.id = c.classType AND c.id = ?';

    var detail_sql = 'SELECT * FROM storeroomOutLogMX WHERE outLogId = ?';

    db.query(sql,[id],function (cbData, err, rows, fields) {

        if (!err) {
            if (rows != null && rows.length != 0) {

                var data = {};
                data.classroom = rows[0];
                var outLogId = rows[0].outLogId;

                db.query(detail_sql, [outLogId], function (cbData, err, rows, fields) {

                    if (!err) {
                        data.detail = rows;
                        cb (null, data);
                    } else {
                        cb(err);
                    }
                });
            }
        } else {
            cb(err);
        }
    });
}

/**
 * 修改教室，先将所有商品入库，
 * 点击修改后，在根据修改后的数据修改库存
 * @param id
 * @param cb
 */
//module.exports.preEdit = function(id, cb) {
//
//    var sql = 'SELECT c.serialNumber,c.name,c.remark,c.status,cc.name AS cname,c.outLogId FROM classroom AS c, systemClassify  AS cc WHERE cc.id = c.classType AND c.id = ?';
//
//    db.query(sql,[id],function(cbData, err, rows, fields) {
//
//        if (!err) {
//            if (rows.length != 0) {
//                var outLogId = rows[0].outLogId;
//                var outSQl = 'SELECT * FROM storeroomOutLog WHERE id = ?';
//                db.query(outSQl,[outLogId],function(cbData, err, rows, fields) {
//                    if(!err) {
//                        if(rows.length != 0) { // 出库单主表，查找出
//
//                        }
//                    } else {
//                        cb(err);
//                    }
//                });
//            }
//        } else {
//            cb(err);
//        }
//    });
//}

module.exports.preDel = function(id,shopId, cb) {

    var sql = 'SELECT name, outLogId FROM classroom WHERE id = ? AND shopId = ?';
    db.query(sql,[id,shopId],function(cbData, err, rows, fields) {
           var data = {};
        if (!err) {
            if(rows.length != 0) {
                data.name = rows[0].name;
                var pro_sql = 'SELECT * FROM storeroomOutLogMX WHERE outLogId = ?';
                db.query(pro_sql,[rows[0].outLogId],function(cbData, err, rows, fields) {
                     if (!err) {
                         data.pro = rows;
                         cb(null,data);
                     } else {
                         cb(err);
                     }
                });
            }
        } else {
            cb(err);
        }
    });
}

/**
 * 不分页显示获取所有教室
 * @param cb
 */
module.exports.getAllClassroom = function (cb) {

    var sql = 'SELECT * FROM classroom';
    db.query(sql, [],function (cbData, err, rows, fields) {
        if (!err) {
            cb (null, rows);
        } else {
            cb(err);
        }
    });

}


/**
 *
 * @param seril
 * @param cb
 */
module.exports.checkSeril = function(shopId,seril,cb) {

    var checkSQL = 'SELECT * FROM classroom WHERE serialNumber = ? AND shopId =?';
    db.query(checkSQL, [seril,shopId], function (cbData, err, rows, filelds) {
        if(!err) {
            if (rows.length != 0) {
                cb(null,false);
            } else {
                cb(null,true);
            }
        } else {
            cb(err);
        }
    });
}

/**
 *
 * @param name
 * @param cb
 */
module.exports.checkName = function (shopId,name, cb) {

    var checkSql = 'SELECT * FROM classroom WHERE name = ? AND shopId = ?';
    db.query(checkSql, [name,shopId], function (cbData, err, rows, filelds) {
        if(!err) {
            if (rows.length != 0) {
                cb(null,false);
            } else {
                cb(null,true);
            }
        } else {
            cb(err);
        }
    });

}

/**
 * 删除教室，同时增加入库单
 * @param id
 * @param shopId
 * @param cb
 */
module.exports.del = function(id,sid,shopId,userName, cb) {

    var getOutLogId = 'SELECT outLogId FROM classroom WHERE id = ? AND shopId = ?';
    var del = 'DELETE FROM classroom WHERE id = ? AND shopId = ?';

    db.query(getOutLogId,[id,shopId],function(cbData, err, rows, filelds) {

        if (!err) {
            if(rows.length != 0) {  // 处理入库单
                var outLogId = rows[0].outLogId;
               var pro_sql = 'SELECT * FROM storeroomOutLogMX WHERE outLogId = ?';
                db.query(pro_sql,[outLogId], function(cbData, err, rows, filelds){
                    if(!err) {  // 生成入库单
                        inStoreroom(userName,sid,rows,function(err, results){
                            if(!err) {
                                updateInventory(sid,rows,function(err, results) {
                                    if(!err) {
                                        db.query(del,[id,shopId],function(cbData, err, rows, filelds){
                                            if(!err) {
                                                cb(null,rows);
                                            } else {
                                                cb(err);
                                            }
                                        });

                                    } else {
                                        console.log(err);
                                        cb(err);
                                    }
                                })
                            } else {
                                console.log(err);
                                cb(err);
                            }
                        })
                    } else {
                        console.log(err);
                        cb(err);
                    }
                });
            }
        } else {
            cb(err);
        }
    });
}

/**
 * 删除教室新增入库单
 */
function inStoreroom (oper,sid,arr,cb) {

    var sql = 'INSERT INTO storeroomInLog (buyer,buyDate,storeroomId,dateline,inType,buyType,distributorId) VALUES (?,?,?,?,?,?,?)';

    // 教室物品 id 53
    db.query(sql,[oper,new Date(),sid,new Date().getTime(),'53','30','3'],function(cbData, err, rows, filelds) {

        if(!err) {
            var inLogId = rows.insertId;
            var sql_mx = 'INSERT INTO storeroomInLogMX (inLogId,waresName,count,price,waresSerial,waresId) VALUES (?,?,?,?,?,?)';
            async.map(arr, function(item, callback) {

                db.query(sql_mx, [inLogId,item.waresName,item.waresSerial,item.count,item.price,item.waresId], function (cbData, err, rows, fields) {
                    if (!err) {
                        callback(null, rows);
                    } else {
                        callback(err);
                    }
                });
            }, function(err,results) {
                cb(err, results);
            });
        }else {
            cb(err);
        }
    });
}

/**
 * 更新库存
 * @param arr
 * @param cb
 */
function updateInventory (sid,arr,cb) {

    // 查看是否原来有库存
    var check_sql = 'SELECT * FROM inventory WHERE storeroomId = ? AND waresId = ?';
    // 入库操作
    var sql = 'INSERT INTO inventory (storeroomId,waresId,count) VALUES (?,?,?)';

    var update_sql = 'UPDATE inventory SET count = ? WHERE storeroomId = ? AND waresId = ?';

    async.map(arr, function(item, callback) {

        db.query(check_sql, [sid,item.waresId],function(cbData, err, rows, fields) {

            if (!err) {

                if (rows.length == 0) {  // 原来没有记录

                    db.query(sql, [sid,item.waresId,item.count], function (cbData, err, rows, fields) {

                        if (!err) {
                            callback(null, rows);
                        } else {
                            callback(err);
                        }
                    });
                } else {  // 有记录
                    var old_count = rows[0].count;
                    db.query(update_sql,[Number(item.count)+Number(old_count),sid,item.waresId],function(cbData, err, rows, fields){
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
        });

    }, function(err,results) {
        cb(err, results);
    });

}