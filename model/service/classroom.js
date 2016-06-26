/**
 * Created by qiaojoe on 16-1-2.
 * 教室管理
 */


var db = require('../../common/db');
var async = require('async');
var mainClassroomClassifyId = require('../../config').mainClassifyId.classroomType;
var myUtils = require('../../common/utils');

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
module.exports.insertClassroom = function(shopId,serialNumber,name,classType,remark,oper, cb) {

    myUtils.printSystemLog('增加教室：'+shopId+'_'+serialNumber+'_'+name+'_'+classType+'_'+remark+'_'+oper);

    var sql = 'INSERT INTO classroom (serialNumber,name,classType,remark,dateline,status,shopId,oper) VALUES (?,?,?,?,?,?,?,?)';
    db.query(sql, [serialNumber,name,classType,remark,new Date().getTime(),'1',shopId,oper], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 新增教室明细
 * @param classroomId
 * @param arr
 * @param cb
 */
module.exports.insertClassroomMX = function (classroomId, arr, cb){

    myUtils.printSystemLog('增加教室明细：'+classroomId+'_'+arr);
    var sql = "INSERT INTO classroomMX (classroomId,waresName,count,bname,waresSerial,waresId) VALUES (?,?,?,?,?,?)";

    var conn = db.db_conn();

    async.map(arr, function(item, callback) {
        if(item.proId != '') {
            conn.query(sql, [classroomId,item.proName,item.count,item.bname,item.proSerial,item.proId],function(err, results) {

                if (!err) {
                    callback(null, results);
                } else {  // 有记录
                    db.close(conn);
                    callback(err);
                }
            });
        } else {
            callback(null,null);
        }
    }, function(err,results) {
        db.close(conn);
        cb(err, results);
    });
}



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

    var sql = 'SELECT c.oper,c.serialNumber,c.name,c.remark,c.status,cc.name AS cname FROM classroom AS c, systemClassify  AS cc WHERE cc.id = c.classType  AND c.id = ?';

    var detail_sql = 'SELECT * FROM classroomMX WHERE classroomId = ?';

    db.query(sql,[id],function (cbData, err, rows, fields) {

        if (!err) {
            if (rows != null && rows.length != 0) {

                var data = {};
                data.classroom = rows[0];
                db.query(detail_sql, [id], function (cbData, err, rows, fields) {

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
 * @param id
 * @param cb
 */
module.exports.preEdit = function(id, cb) {

    //var sql = 'SELECT c.id, c.oper,s.name AS storename,c.serialNumber,c.name,c.remark,c.status,cc.name AS cname,c.outLogId FROM classroom AS c, systemClassify  AS cc, storeroom AS s WHERE cc.id = c.classType AND s.id = c.storeroomId AND c.id = ?';
    var sql = 'SELECT c.* FROM classroom AS c  WHERE c.id = ?';

    db.query(sql,[id],function(cbData, err, rows, fields) {

        var data = {};
        if (!err) {
            if (rows.length != 0) {
                data.classroom = rows[0];
                var mxSQL = 'SELECT * FROM classroomMX where classroomId = ?';
                db.query(mxSQL,[id],function(cbData, err, rows, fields) {
                    if(!err) {
                       data.detail = rows;
                        cb(err,data);
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
 * 查询该教室是否有物资，如果有则不能删除
 * @param id
 * @param cb
 */
module.exports.checkDel = function(id,cb) {

    var sql = 'SELECT * FROM classroomMX WHERE classroomId = ?';
    db.query(sql, [id], function(cbData, err, rows, filelds) {
         if (!err) {
              if (rows.length != 0) {
                  cb(null,false);
                  return;
              }
             cb(null,true);
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
module.exports.del = function(id,shopId,cb) {

    myUtils.printSystemLog('删除教室：'+id+'-'+shopId)
    var del = 'DELETE FROM classroom WHERE id = ? AND shopId = ?';
    db.query(del,[id, shopId],function(cbData, err, rows, fields) {
    cb(err,rows);
    });
}

/**
 *
 * @param id
 * @param shopId
 * @param name
 * @param classType
 * @param remark
 * @param oper
 * @param cb
 */
module.exports.updateClassroom = function (id,shopId,name,classType,remark,oper, cb) {

    myUtils.printSystemLog('更新教室：'+shopId+'-'+name+'-'+classType+'-'+remark+'-'+oper);

   var sql = 'UPDATE classroom SET name=?,classType=?,remark=?,shopId=?,oper=? WHERE id = ?';

    db.query(sql, [name,classType,remark,shopId,oper,id], function(cbData, err, rows, fields){

        if (!err) {
            cb(null,rows);
        } else {
            cb(err);
        }

    });
}

module.exports.getCode = function (cb) {

    var sql = 'SELECT count(*) AS count FROM classroom';
    db.query(sql,[],function(cbData, err, rows, filelds){

        if (!err) {
            var count = rows[0].count;
            cb(null,count);
        } else {
            cb(err);
        }
    });
}

/**
 * 删除教室新增入库单
 */
module.exports.inStoreroomForDelWares = function (cid,oper,sid,arr,cb) {

    // 先把删除的物资入库，然后在删除操作

    myUtils.printSystemLog('删除教室新增入库单数据：'+cid+'-'+sid+'-'+arr);

    // 拼接串
    var temp = "(";
    for (var i=0;i<arr.length;i++) {
        if(i != arr.length - 1) {
            temp = temp + arr[i] + ","
        } else {
            temp = temp + arr[i] +")";
        }
    }
    // 查出要删除的数据
    var getWaresSQL = "SELECT * FROM classroomMX WHERE classroomId = ? AND waresId in  "+temp;
    db.query(getWaresSQL,[cid],function(cbData, err, rows, filelds){
        if (!err) {
            var wares = rows;
            if(wares.length == 0) {
                cb(null,null);
                return;
            }
            // 处理入库单
            var sql = 'INSERT INTO storeroomInLog (buyer,buyDate,storeroomId,dateline,inType,buyType,distributorId) VALUES (?,?,?,?,?,?,?)';
            // 教室物品 id 53
            db.query(sql,[oper,new Date(),sid,new Date().getTime(),'53','30','3'],function(cbData, err, rows, filelds) {

                if(!err) {
                    var inLogId = rows.insertId;
                    var sql_mx = 'INSERT INTO storeroomInLogMX (inLogId,waresName,count,price,waresSerial,waresId) VALUES (?,?,?,?,?,?)';
                    var handle_db = db.db_conn();
                    async.map(wares, function(item, callback) {

                        handle_db.query(sql_mx, [inLogId,item.waresName,item.count,item.bname,item.waresSerial,item.waresId], function (err,results) {
                            if (!err) {
                                callback(null, results);
                            } else {
                                db.close(handle_db);
                                callback(err);
                            }
                        });
                    }, function(err,results) {
                        updateInventoryForDelete(sid,wares);
                        delClassroomMX(cid,arr);
                        cb(err, results);
                    });
                }else {
                    cb(err);
                }
            });

        } else {
            cb(err);
        }
    });
}

/**
 * 更新库存
 * @param arr
 * @param cb
 */
function updateInventoryForDelete (sid,arr) {

    if(arr.length == 0) {
        return;
    }

    myUtils.printSystemLog('删除或者添加教室库存更改：'+sid+'-'+arr)

    // 查看是否原来有库存
    var check_sql = 'SELECT * FROM inventory WHERE storeroomId = ? AND waresId = ?';
    // 入库操作
    var sql = 'INSERT INTO inventory (storeroomId,waresId,count) VALUES (?,?,?)';

    var update_sql = 'UPDATE inventory SET count = ? WHERE storeroomId = ? AND waresId = ?';

    var handle_db = db.db_conn();
    async.map(arr, function(item, callback) {

        handle_db.query(check_sql, [sid,item.waresId],function(err, results) {

            if (!err) {

                if (results.length == 0) {  // 原来没有记录

                    handle_db.query(sql, [sid,item.waresId,item.count], function (err,results) {

                        if (!err) {
                            callback(null, results);
                        } else {
                            db.close(handle_db);
                            callback(err);
                        }
                    });
                } else {  // 有记录
                    var old_count = results[0].count;
                    handle_db.query(update_sql,[Number(item.count)+Number(old_count),sid,item.waresId],function(err, results){
                        if (!err) {
                            callback(null, results);
                        } else {
                            db.close(handle_db);
                            callback(err);
                        }
                    });
                }
            } else {
                db.close(handle_db);
                callback(err);
            }
        });

    }, function(err,results) {
        db.close(handle_db);
    });

}


function delClassroomMX(id,arr) {

    if(arr.length == 0) {
        return;
    }
    // 拼接串
    var temp = "(";
    for (var i=0;i<arr.length;i++) {
        if(i != arr.length - 1) {
            temp = temp + arr[i] + ","
        } else {
            temp = temp + arr[i] +")";
        }
    }

    var del = "DELETE FROM classroomMX WHERE classroomId = ? AND waresId in  " +temp;

    db.query(del,[id],function(cbData, err, rows, filelds) {

        if(err) {
            console.log(err);
        }

    });

}

