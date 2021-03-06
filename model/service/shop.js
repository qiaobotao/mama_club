/**
 * Created by qiaojoe on 16-1-2.
 * 门店管理
 */


var db = require('../../common/db');
var async = require('async');
var myUtils = require('../../common/utils');
/**
 * 增加门店
 * @param serialNumber
 * @param name
 * @param principal
 * @param address
 * @param remark
 * @param cb
 */
module.exports.insertShop = function(serialNumber,code,name,principal,tel,province,city,town,address,remark, cb) {

    myUtils.printSystemLog('增加门店:'+serialNumber+'-'+code+'-'+name+'-'+principal+'-'+tel+'-'+province+city+town+'-'+address+'-'+remark);

    var sql = 'INSERT INTO shop (serialNumber,code,name,principal,tel,province,city,town,address,remark,dateline,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [serialNumber,code,name,principal,tel,province,city,town,address,remark, new Date().getTime(),'1'], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除门店
 * @param id
 * @param cb
 */
module.exports.delShop= function (id, cb) {

    myUtils.printSystemLog('删除门店：'+id)

    var check_sql = 'SELECT * FROM staff WHERE shopId = ?';
    var sql = 'DELETE FROM shop WHERE id = ?';
    db.query(check_sql,[id],function(cbData, err, rows, fields) {
        if (!err) {
            if (rows.length != 0) { //  有员工，不能删除
                 cb(null,false);
            } else {
                db.query(sql, [id], function(cbData, err, rows, fields) {
                    if (!err) {
                        cb(null, true);
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
 * 分页门店信息
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchShops = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM shop ORDER BY dateline DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
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
module.exports.fetchAllShop = function(name,principal,number,currentPage,cb) {

    var parm = "WHERE name LIKE '%"+name+"%' AND principal LIKE '%"+principal+"%' AND serialNumber LIKE '%"+number+"%' ";

    var sql_count = 'SELECT count(*) as count FROM shop '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT * FROM shop '+parm+' ORDER BY dateline DESC LIMIT ?,?';

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
 * 修改门店
 * @param id
 * @param name
 * @param address
 * @param principal
 * @param cb
 */
module.exports.updateShop = function(id, serialNumber,name,address, principal, tel, remark, cb) {

    myUtils.printSystemLog('修改门店：'+id+'-'+serialNumber+'-'+name+'-'+address+'-'+principal+'-'+tel+'-'+remark)

    var sql = 'UPDATE shop SET serialNumber = ?,name = ?, tel = ?,address = ?, principal = ?, remark = ? WHERE id = ?';
    var par = [serialNumber, name, tel, address, principal, remark, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取门店详情
 * 以及门店内员工工作情况详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleShop =function (id, cb) {

    var shopDetailsSql = 'SELECT * FROM shop WHERE id = ?';
    var attendanceDetailSql = "SELECT a.id,a.staffId,a.workType,date_format(a.attendanceDate,'%Y-%c-%d') as attendanceDate,a.workingStartHours as startWorkingHours,a.workingEndHours as endWorkingHours FROM attendanceDetails a,staff s WHERE a.staffId = s.id and s.shopId = ?";
    //var attendanceDetailSql = "SELECT a.id,a.staffId,a.workType,date_format(a.attendanceDate,'%Y-%c-%d') as attendanceDate,date_format(a.workingStartHours,'%h:%i') as startWorkingHours,date_format(a.workingEndHours,'%h:%i') as endWorkingHours FROM attendanceDetails a,staff s WHERE a.staffId = s.id and s.shopId = ?";
    async.series({
        shopData : function(callback){
            db.query(shopDetailsSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        attendanceDetailData : function(callback){
            db.query(attendanceDetailSql, [id], function (cbData, err, rows, fields) {
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
 * 修改attendanceDetail表记录
 * @param attendanceDetailId
 * @param workTypeId
 * @param startWorkingHours
 * @param endWorkingHours
 * @param cb
 */
module.exports.updateShop4AttendanceDetail = function (attendanceDetailId, workTypeId, startWorkingHours, endWorkingHours, cb) {

    var sql = 'UPDATE attendanceDetails  SET workType = ?,workingStartHours=?,workingEndHours=? WHERE id = ?';
    db.query(sql, [workTypeId, startWorkingHours, endWorkingHours,attendanceDetailId], function(cbData, err, rows, filelds) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });
}

/**
 * 新增attendanceDetail表记录
 * @param attendanceDetailId
 * @param workTypeId
 * @param startWorkingHours
 * @param endWorkingHours
 * @param cb
 */
module.exports.insetShop4AttendanceDetail = function (attendanceDetailId, workTypeId, startWorkingHours,endWorkingHours,attendanceStaffId,attendanceDate, cb) {

    var attendanceDetailSql = "SELECT a.id,a.staffId,a.workType,date_format(a.attendanceDate,'%Y-%c-%d') as attendanceDate,a.workingStartHours as startWorkingHours,a.workingEndHours as endWorkingHours FROM attendanceDetails a,staff s WHERE a.staffId = s.id and s.shopId = ?";

    var sql = 'INSERT INTO attendanceDetails (staffId,attendanceDate,workType,workingStartHours,workingEndHours,dateline) ' +
        '   VALUES (?,?,?,?,?,?)';
    db.query(sql, [ attendanceStaffId,attendanceDate,workTypeId, startWorkingHours,endWorkingHours,new Date().getTime()], function(cbData, err, rows, filelds) {

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

    var sql = 'UPDATE shop  SET status = ? WHERE id = ?';
    db.query(sql, [status,id], function(cbData, err, rows, filelds) {

        if (!err) {
            cb(null, rows);
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
module.exports.checkSeril = function(seril,cb) {

    var checkSQL = 'SELECT * FROM shop WHERE serialNumber = ?';
    db.query(checkSQL, [seril], function (cbData, err, rows, filelds) {
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
module.exports.checkName = function (name, cb) {

    var checkSql = 'SELECT * FROM shop WHERE name = ?';
    db.query(checkSql, [name], function (cbData, err, rows, filelds) {
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

module.exports.shopCount = function (cb) {

    var sql = 'SELECT count(*) AS count FROM shop';

    db.query(sql, [], function (cbData, err, rows, filelds) {
        if(!err) {
            cb(null, rows[0].count);
        } else {
            cb(err);
        }
    });

}
