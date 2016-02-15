/**
 * Created by kuanchang on 16/2/12.
 * 员工管理
 */


var db = require('../../common/db');
var async = require('async');
/**
 * 增加员工
 * @param serialNumber
 * @param name
 * @param principal
 * @param address
 * @param remark
 * @param cb
 */
module.exports.insertStaff = function(serialNumber,name,tel,idCard,birthDate,highestEducation,graduationSchool,spouseName,spouseTel,email,startJobTime,endJobTime,isJob,belongShop,clockCode,remarks, cb) {

    var sql = 'INSERT INTO staff (serialNumber,name,tel,idCard,birthDate,highestEducation,graduationSchool,spouseName,spouseTel,email,startJobTime,endJobTime,isJob,belongShop,clockCode,remarks,dateline,status)' +
        ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [serialNumber,name,tel,idCard,birthDate,highestEducation,graduationSchool,spouseName,spouseTel,email,startJobTime,endJobTime,isJob,belongShop,clockCode,remarks,new Date().getTime(),'1'], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除员工
 * @param id
 * @param cb
 */
module.exports.delStaff= function (id, cb) {

    var sql = 'DELETE FROM staff WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 分页员工信息
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchStaffs = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM staff ORDER BY dateline DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取所有员工
 * @param cb
 */
module.exports.fetchAllStaff = function(name,serialNumber,tel,currentPage,cb) {

    var parm = "WHERE name LIKE '%"+name+"%' AND serialNumber LIKE '%"+serialNumber+"%' AND tel LIKE '%"+tel+"%' ";

    var sql_count = 'SELECT count(*) as count FROM staff '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT * FROM staff '+parm+' ORDER BY dateline DESC LIMIT ?,?';

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
 * 修改员工
 * @param id
 * @param name
 * @param address
 * @param principal
 * @param cb
 */
module.exports.updateStaff = function(id, serialNumber,name,tel,idCard,birthDate,highestEducation,graduationSchool,spouseName,spouseTel,email,startJobTime,endJobTime,isJob,belongShop,clockCode,remarks, cb) {

    var sql = 'UPDATE staff SET serialNumber = ?, name = ?, tel = ?, idCard = ?, birthDate = ?, highestEducation = ? , graduationSchool = ? , spouseName = ? ' +
        ', spouseTel = ? , email = ? , startJobTime = ? , endJobTime = ? , isJob = ? , belongShop = ? , clockCode = ?, remarks = ? WHERE id = ?';

    var par = [serialNumber,name,tel,idCard,birthDate,highestEducation,graduationSchool,spouseName,spouseTel,email,startJobTime,endJobTime,isJob,belongShop,clockCode,remarks, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取员工详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleStaff =function (id, cb) {

    var sql = 'SELECT * FROM staff WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

