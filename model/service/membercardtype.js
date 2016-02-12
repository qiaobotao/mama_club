/**
 * Created by Administrator on 2016/1/31.
 */
/**
 * Created by qiaojoe on 16-1-2.
 * 教室管理
 */


var db = require('../../common/db');
var async = require('async');
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
module.exports.insertMemberCardType = function(memberCardType,memberCardAmount,consumerLimit,zeroDiscounts,isManyPeopleUsed,status, cb) {

    var sql = 'INSERT INTO memberCardType (memberCardType,memberCardAmount,consumerLimit,zeroDiscounts,isManyPeopleUsed,status) VALUES (?,?,?,?,?,?)';
    db.query(sql, [memberCardType,memberCardAmount,consumerLimit,zeroDiscounts,isManyPeopleUsed,status], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除教室
 * @param id
 * @param cb
 */
module.exports.delClassRoom= function (id, cb) {

    var sql = 'DELETE FROM classroom WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 查询菜单
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchClassRoom = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM classroom ORDER BY dateline DESC LIMIT ?, ?';
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
module.exports.fetchAllCLassRoom = function(className,classCode,classType,currentPage,cb) {

    var parm = "WHERE name LIKE '%"+className+"%' AND classCode LIKE '%"+classCode+"%' AND classType LIKE '%"+classType+"%' ";

    var sql_count = 'SELECT count(*) as count FROM classroom '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT * FROM classroom '+parm+' ORDER BY dateline DESC LIMIT ?,?';

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
 * 修改教室
 * @param id
 * @param name
 * @param address
 * @param principal
 * @param cb
 */
module.exports.updateClassRoom = function(id,serialNumber,name,classCode,classType,remark,status,materialId, cb) {

    var sql = 'update   classroom  set  serialNumber =?, NAME =?, classCode =?, classType =?, remark =?, STATUS =?, materialId =?, dateline =?  where id =? ';
    var par = [serialNumber,name,classCode,classType,remark,status,materialId, new Date().getTime(), id];

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
 * @param id
 * @param cb
 */
module.exports.fetchSingleClassRoom =function (id, cb) {

    var sql = 'SELECT * FROM classroom WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

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

    var sql = 'UPDATE classroom  SET status = ? WHERE id = ?';
    db.query(sql, [status,id], function(cbData, err, rows, filelds) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });
}

