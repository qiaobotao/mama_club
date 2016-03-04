/**
 * Created by Administrator on 2016/1/31.
 */

var db = require('../../common/db');
var async = require('async');

module.exports.insertComplain = function(serviceMeetId,name,tel,complainPrincipal,complainType,dealPrincipal,complainDetail, cb) {

    var complainTime = new Date();
    complainTime = complainTime.toLocaleDateString();
    var sql = 'INSERT INTO complain (serviceMeetId,complainPrincipal,complainType,dealPrincipal,complainDetail, complainTime,dateLine) '
        + ' VALUES (?,?,?,?,?,?,?)';
    db.query(sql, [serviceMeetId,complainPrincipal,complainType,dealPrincipal,complainDetail,complainTime,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.updateComplain = function(id,serviceMeetId,name,tel,complainPrincipal,complainType,dealPrincipal,complainDetail, cb) {

    var sql = 'UPDATE complain set complainPrincipal=?,complainType=?,dealPrincipal=?,complainDetail=?,dateLine=? where id=?';
    db.query(sql, [complainPrincipal,complainType,dealPrincipal,complainDetail,new Date().getTime(), id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.fetchAllComplain = function(name,complainPrincipal,complainTimeStart,complainTimeEnd,dealPrincipal,currentPage,cb) {

    var parm = " on (a.serviceMeetId=b.id)"
    if (name != '')
        parm += " where b.name like '%" + name + "%'";
    if (complainPrincipal != '')
        parm += " and a.complainPrincipal like '%" + complainPrincipal + "%'";
    if (complainTimeStart != '')
        parm += " and a.complainTime >='" + complainTimeStart + "'";
    if (complainTimeEnd != '')
        parm += " and a.complainTime <='" + complainTimeEnd + "'";
    if (dealPrincipal != '')
        parm += " and a.dealPrincipal like '%" + dealPrincipal + "%'";

    var sql_count = 'SELECT count(*) as count FROM complain';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT b.name,a.* FROM complain a inner join serviceMeet b'+ parm +' LIMIT ?,?';

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

module.exports.fetchSingleComplain =function (id, cb) {

    var sql = 'SELECT a.*,b.name,a.* FROM complain a inner join serviceMeet b on(a.serviceMeetId=b.id) WHERE a.id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
module.exports.delComplaint= function (id, cb) {

    var sql = 'DELETE FROM complain WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
/**
 * ��ȡ�������ԤԼ������ص�Ͷ�����
 * @param id
 * @param cb
 */
module.exports.getTop3Complain =function (serviceMeetIds, cb) {
    var  parm=   "where serviceMeetId in(" + serviceMeetIds + ")" ;
    parm=" order by dateLine limit 0,3";
    var sql = 'SELECT * FROM complain '+parm;
    db.query(sql, [],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}