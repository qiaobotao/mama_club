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
module.exports.insertStaff = function(serialNumber,name,tel,idCard,birthDate,highestEducation,graduationSchool,spouseName,spouseTel,email,startJobTime,endJobTime,isJob,shopId,clockCode,remarks,staffLevel, cb) {

    var sql = 'INSERT INTO staff (serialNumber,name,tel,idCard,birthDate,highestEducation,graduationSchool,spouseName,spouseTel,email,startJobTime,endJobTime,isJob,shopId,clockCode,remarks,dateline,status,staffLevel)' +
        ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [serialNumber,name,tel,idCard,birthDate,highestEducation,graduationSchool,spouseName,spouseTel,email,startJobTime,endJobTime,isJob,shopId,clockCode,remarks,new Date().getTime(),'1',staffLevel], function(cbData, err, rows, fields) {
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

    var parm = "WHERE a.name LIKE '%"+name+"%' AND a.serialNumber LIKE '%"+serialNumber+"%' AND a.tel LIKE '%"+tel+"%' ";

    var sql_count = 'SELECT count(a.id) as count FROM staff a,shop s ,staffLevel sl '+parm+' ' +
        'AND a.shopId = s.id ' +
        'AND sl.id = a.staffLevel' +
        ' ORDER BY a.dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT a.*,s.name as `shopName`,s.id as `shopId`,sl.`name` as `levelName`  FROM staff a,shop s ,staffLevel sl '+parm+' ' +
        'AND a.shopId = s.id ' +
        'AND sl.id = a.staffLevel' +
        ' ORDER BY a.dateline DESC LIMIT ?,?';

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
 * 1、修改员工基本信息
 * 2、删除员工子女信息
 * 3、删除合同信息
 * 4、删除职业资格信息
 * @param id
 * @param name
 * @param address
 * @param principal
 * @param cb
 */
module.exports.updateStaff = function(id, serialNumber,name,tel,idCard,birthDate,highestEducation,graduationSchool,spouseName,spouseTel,email,startJobTime,endJobTime,isJob,shopId,clockCode,remarks,staffLevel, cb) {

    var updateStaffSql = 'UPDATE staff SET serialNumber = ?, name = ?, tel = ?, idCard = ?, birthDate = ?, highestEducation = ? , graduationSchool = ? , spouseName = ? ' +
        ', spouseTel = ? , email = ? , startJobTime = ? , endJobTime = ? , isJob = ? , shopId = ? , clockCode = ?, remarks = ?,staffLevel=? WHERE id = ?';

    var updateStaffPar = [serialNumber,name,tel,idCard,birthDate,highestEducation,graduationSchool,spouseName,spouseTel,email,startJobTime,endJobTime,isJob,shopId,clockCode,remarks,staffLevel, id];
    //删除员工与之对应的子女信息
    var delChildSql = 'delete from staffChildren WHERE staffId = ?';
    var deleteChildPar = [id];
    //删除员工与之对应的合同信息
    var deleteContractSql = 'delete from staffContract WHERE staffId = ?';
    var deleteContractPar = [id];
    //删除员工与之对应的职业资格信息
    var deleteCertificateSql = 'delete from staffCertificate WHERE staffId = ?';
    var deleteCertificatePar = [id];
    //删除员工与之对应的考勤周期信息
    var deleteAttendanceSql = 'delete from staffAttendance WHERE staffId = ?';
    var deleteAttendancePar = [id];
    async.series({
        updateStaff : function(callback){
            db.query(updateStaffSql, updateStaffPar, function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        delChildren : function(callback){
            db.query(delChildSql, deleteChildPar, function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        delContract : function(callback){
            db.query(deleteContractSql, deleteContractPar, function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        delCertificate : function(callback){
            db.query(deleteCertificateSql, deleteCertificatePar, function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        delAttendance : function(callback){
            db.query(deleteAttendanceSql, deleteAttendancePar, function (cbData, err, rows, fields) {
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
 * 获取员工详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleStaff =function (id, cb) {
    //员工基本信息
    var staffSql = 'SELECT * FROM staff WHERE id = ?';
    //员工子女信息
    var childrenSql = 'SELECT * FROM staffChildren WHERE staffId = ?';
    //员工合同信息
    var contractSql = 'SELECT * FROM staffContract WHERE staffId = ?';
    //员工职业资格信息
    var certificateSql = 'SELECT * FROM staffCertificate WHERE staffId = ?'
    //员工考勤类型信息
    var attendanceTypeSql = 'SELECT * FROM staffAttendance WHERE staffId = ?';
    async.series({
        staff : function(callback){
            db.query(staffSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        children : function(callback){
            db.query(childrenSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        contracts : function(callback){
            db.query(contractSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        certificates : function(callback){
            db.query(certificateSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        attendanceTypes : function(callback){
            db.query(attendanceTypeSql, [id], function (cbData, err, rows, fields) {
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
 * 添加员工与子女、合同、职业资格等信息
 * @param id
 * @param childrenArr
 * @param contractArr
 * @param qualificationsArr
 * @param cb
 */
module.exports.addStaffOhter = function(id,childrenArr,contractArr,qualificationsArr,attendancesArr,cb) {
    //添加员工孩子信息
    var addChildrenSql = 'insert into staffChildren(staffId,childrenName,childrenBirth,childrenSex,childrenRank,dateline) VALUES (?,?,?,?,?,?)';
    //添加员工合同信息
    var addContractSql = 'insert into staffContract(staffId,contractStartDate,contractEndDate,contractRemarks,dateline) VALUES (?,?,?,?,?)';
    //添加员工职业资格信息
    var addCertificateSql = 'insert into staffCertificate(staffId,vocationalQualifications,qualificationsImage,qualificationsDescribe,qualificationsTime,dateline) VALUES (?,?,?,?,?,?)';
    //添加员工考勤周期信息
    var addAttendanceSql = 'insert into staffAttendance(staffId,attendanceId,attendanceStartDate,attendanceEndDate,attendanceRank,dateline) VALUES (?,?,?,?,?,?)';
    //批量添加员工的孩子信息
    async.map(childrenArr, function(item, callback) {
        db.query(addChildrenSql, [id,item.childrenName,item.childrenBirth,item.childrenSex,item.childrenRank,new Date().getTime()], function (cbData, err, rows, fields) {
            if (!err) {
                callback(null, rows);
            } else {
                callback(err);
            }
        });
    }, function(err,results) {
        //callback(err, results);
    });
    //批量添加员工的合同信息
    async.map(contractArr, function(item, callback) {
        db.query(addContractSql, [id,item.contractStartDate,item.contractEndDate,item.contractRemarks,new Date().getTime()], function (cbData, err, rows, fields) {
            if (!err) {
                callback(null, rows);
            } else {
                callback(err);
            }
        });
    }, function(err,results) {
        //cb(err, results);
    });
    //批量添加考勤周期信息
    async.map(attendancesArr, function(item, callback) {
        db.query(addAttendanceSql, [id,item.attendanceId,item.attendanceStartDate,item.attendanceEndDate,item.attendanceRank,new Date().getTime()], function (cbData, err, rows, fields) {
            if (!err) {
                callback(null, rows);
            } else {
                callback(err);
            }
        });
    }, function(err,results) {
        //cb(err, results);
    });
    //批量添加员工的职业资格信息
    async.map(qualificationsArr, function(item, callback) {
        db.query(addCertificateSql, [id,item.vocationalQualifications,item.qualificationsImage,item.qualificationsDescribe,item.qualificationsTime,new Date().getTime()], function (cbData, err, rows, fields) {
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
