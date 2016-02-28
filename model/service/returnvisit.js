/**
 * Created by Administrator on 2016/1/31.
 */

var db = require('../../common/db');
var async = require('async');

module.exports.insertReturnVisit = function(serialNumber,name,tel,returnVisitDate,returnVisitType,returnVisitResult,serviceComment,advice,
                                            isReturnVisit,returnVisitReason, cb) {

    var sql = 'INSERT INTO returnVisit (serialNumber,returnVisitDate,returnVisitType,returnVisitResult,serviceComment,advice,'
        + 'isReturnVisit,returnVisitReason) VALUES (?,?,?,?,?,?,?,?)';
    db.query(sql, [serialNumber,returnVisitDate,returnVisitType,returnVisitResult,serviceComment,advice,
        isReturnVisit,returnVisitReason], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.updateReturnVisit = function(id,serialNumber,name,tel,returnVisitDate,returnVisitType,returnVisitResult,serviceComment,advice,
                                            isReturnVisit,returnVisitReason, cb) {

    var sql = 'UPDATE returnVisit set returnVisitDate=?,returnVisitType=?,returnVisitResult=?,serviceComment=?,advice=?,'
        + 'isReturnVisit=?,returnVisitReason=? where id=?';
    db.query(sql, [returnVisitDate,returnVisitType,returnVisitResult,serviceComment,advice,
        isReturnVisit,returnVisitReason, id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.fetchAllReturnVisit = function(serialNumber,returnVisitDate,returnVisitType,currentPage,cb) {

    var parm = " on (a.serialNumber=b.id and b.id=c.serialNumber)"
    if (serialNumber != '')
        parm += " and a.serialNumber like'%" + serialNumber + "%'";
    if (returnVisitDate != '')
        parm += " and a.returnVisitDate like'%" + returnVisitDate + "%'";
    if (returnVisitType != '')
        parm += " and a.returnVisitType like'%" + returnVisitType + "%'";

    var sql_count = 'SELECT count(*) as count FROM returnVisit';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT a.id,b.name,b.tel,c.serviceDate,a.returnVisitType,a.returnVisitResult FROM returnVisit a inner join serviceMeet b inner join nursService c'+ parm +' LIMIT ?,?';

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

module.exports.fetchSingleReturnVisit =function (id, cb) {

    var sql = 'SELECT a.*,'
    + 'b.tel,b.name,b.address FROM returnVisit a inner join serviceMeet b on(a.serialNumber=b.id) WHERE a.id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
module.exports.delReturnVisit= function (id, cb) {

    var sql = 'DELETE FROM returnVisit WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}