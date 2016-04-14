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
module.exports.insertClassroom = function(serialNumber,name,classType,remark,materialId, cb) {

    var sql = 'INSERT INTO classroom (serialNumber,name,classType,remark,outLogId,dateline,status) VALUES (?,?,?,?,?,?,?)';
    db.query(sql, [serialNumber,name,classType,remark,materialId,new Date().getTime(),'1'], function(cbData, err, rows, fields) {
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
module.exports.fetchAllCLassRoom = function(className,classCode,currentPage,cb) {

    var parm = " WHERE r.name LIKE '%"+className+"%' AND r.serialNumber LIKE '%"+classCode+"%' ";

    var sql_count = 'SELECT count(*) as count FROM classroom AS r '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
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
module.exports.checkSeril = function(seril,cb) {

    var checkSQL = 'SELECT * FROM classroom WHERE serialNumber = ?';
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

    var checkSql = 'SELECT * FROM classroom WHERE name = ?';
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