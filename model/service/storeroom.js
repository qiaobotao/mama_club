/**
 * Created by qiaojoe on 15-12-12.
 * 提供仓库的数据访问接口
 */

var db = require('../../common/db');
var async = require('async');
var mainStoreroomClassifyId = require('../../config').mainClassifyId.storeroom;

/**
 * 增加仓库
 * @param name
 * @param address
 * @param principal
 * @param cb
 */
module.exports.insertStoreroom = function(shopId,name, address, principal, tel, serial, classify, remarks, cb) {

    var sql = 'INSERT INTO storeroom (name, address, principal, status, dateline, tel, serial, classify, remarks,shopId) VALUES (?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [name, address, principal, '0', new Date().getTime(), tel, serial, classify, remarks,shopId], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 获取所有仓库
 * @param cb
 */
module.exports.list = function(shopId,name,cid,currentPage,cb) {

    var parm = "WHERE s.name LIKE '%"+name+"%' AND shopId="+shopId;

    if (cid != '') {
        parm = parm + " AND classify ="+cid;
    }

    var sql_count = 'SELECT count(*) as count FROM storeroom s '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT s.*, c.id AS cid, c.name AS cname FROM storeroom AS s, systemClassify AS c '+parm+' AND s.classify = c.id ORDER BY dateline DESC LIMIT ?,?';

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

module.exports.getStoreroomClassify = function (cb) {

    var sql = 'SELECT id,name FROM systemClassify WHERE parentId = ?';
    db.query(sql, [mainStoreroomClassifyId], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 修改仓库
 * @param id
 * @param name
 * @param address
 * @param principal
 * @param cb
 */
module.exports.updateStoreroom = function(id, name, address, principal, serial, cid, tel, remarks,  cb) {

    var sql = 'UPDATE storeroom SET name = ?, address = ?, principal = ?,serial = ?, classify = ?, tel = ?, remarks = ?  WHERE id = ?';
    var par = [name, address, principal, serial, cid, tel, remarks, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 删除仓库
 * @param id
 * @param cb
 */
module.exports.delStoreroom = function (id, cb) {

    var sql = 'DELETE FROM storeroom WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取仓库详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleStoreroom =function (id, cb) {

    var get_sql = 'SELECT s.*, c.name AS cname, c.id AS cid FROM storeroom s, systemClassify c WHERE s.id = ? AND s.classify = c.id';
    db.query(get_sql, [id], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 设置状态
 * @param id
 * @param status
 */
module.exports.setStatus = function (id, status, cb) {

    var sql = 'UPDATE storeroom  SET status = ? WHERE id = ?';
    db.query(sql, [status,id], function(cbData, err, rows, filelds) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });
}
/**
 *获取所有的仓库
 * @param cb
 */
module.exports.getAllStorerooms = function (shopId,cb) {

    var sql = 'SELECT id,name FROM storeroom WHERE shopId='+shopId+' ORDER BY dateline asc';

    db.query(sql,[],function(cbData, err, rows, filelds) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 核对编号是否重复
 * @param shopId
 * @param seril
 * @param cb
 */
module.exports.checkSeril = function(shopId,seril,cb) {

    var checkSQL = 'SELECT * FROM storeroom WHERE serial = ? AND shopId =?';
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
 * 查看名字是否相同
 * @param shopId
 * @param name
 * @param cb
 */
module.exports.checkName = function(storeroomId,name, cb) {

    var checkSql = 'SELECT * FROM storeroom WHERE name = ? AND shopId = ?';
    db.query(checkSql, [name,storeroomId], function (cbData, err, rows, filelds) {
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

///**
// * 验证该库房是否能够删除
// * @param storeroomId
// * @param cb
// */
//module.exports.check_del = function(storeroomId, cb) {
//
//    // 查出所有教室关联的outLogId
//    var sql = "SELECT outLogId FROM classroom";
//    // 根据outLogId 查出当时出库的库房id
//    var getstoreroomIdsSQL = "SELECT storeroomId FROM storeroomOutLog WHERE id in ";
//    db.query(sql,[],function(cbData, err, rows, filelds){
//        if(!err) {
//            if (rows.length == 0) { // 如果没有数据，直接返回true
//                cb(null,true);
//            } else {
//                var v = "(";
//                for (var i=0; i<rows.length; i++) {
//                     if (i!=rows.length -1) {
//                         v = v + "'"+rows[i].outLogId+"',";
//                     } else {
//                         v = v + "'"+rows[i].outLogId+"')";
//                     }
//                }
//                db.query(getstoreroomIdsSQL+v,[],function(cbData, err, rows, filelds){
//
//                      if(!err) {
//                          var arr = new Array();
//                          for (var i=0;i<rows.length;i++) {
//                             arr.push(rows[i].storeroomId);
//                          }
//                          cb(null,isContains(arr,storeroomId));
//                      } else {
//                         cb(err);
//                      }
//                });
//            }
//        } else {
//            cb(err);
//        }
//    });
//}
//
//
//function isContains(arr, temp) {
//
//    if (arr.length == 0) {
//        return false;
//    }
//    for (var i=0;i<arr.length;i++) {
//       if (arr[i] == temp){
//           return true;
//       }
//    }
//    return false;
//
//}
