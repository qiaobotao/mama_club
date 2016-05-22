/**
 * Created by Administrator on 2016/1/31.
 */

var db = require('../../common/db');
var async = require('async');

module.exports.insertComplain = function(shopId,staffId,serviceMeetId,name,tel,complainPrincipal,complainType,dealPrincipal,complainDetail, cb) {

    var complainTime = new Date();
    complainTime = complainTime.toLocaleDateString();
    var sql = 'INSERT INTO complain (shopId,staffId,serviceMeetId,complainPrincipal,complainType,dealPrincipal,complainDetail, complainTime,dateLine) '
        + ' VALUES (?,?,?,?,?,?,?,?,?)';
    db.query(sql, [shopId,staffId,serviceMeetId,complainPrincipal,complainType,dealPrincipal,complainDetail,complainTime,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.updateComplain = function(staffId,id,serviceMeetId,name,tel,complainPrincipal,complainType,dealPrincipal,complainDetail, cb) {

    var sql = 'UPDATE complain set staffId=?,complainPrincipal=?,complainType=?,dealPrincipal=?,complainDetail=?,dateLine=? where id=?';
    db.query(sql, [staffId,complainPrincipal,complainType,dealPrincipal,complainDetail,new Date().getTime(), id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.fetchAllComplain = function(shopId,name,complainPrincipal,complainTimeStart,complainTimeEnd,dealPrincipal,currentPage,cb) {

    var parm = " where (a.serviceMeetId=b.id)"
    if (name != '')
        parm += " and  b.name like '%" + name + "%'";
    if (complainPrincipal != '')
        parm += " and a.complainPrincipal like '%" + complainPrincipal + "%'";
    if (complainTimeStart != '')
        parm += " and a.complainTime >='" + complainTimeStart + "'";
    if (complainTimeEnd != '')
        parm += " and a.complainTime <='" + complainTimeEnd + "'";
    if (dealPrincipal != '')
        parm += " and a.dealPrincipal like '%" + dealPrincipal + "%'";
    if (shopId != '')
        parm += " and a.shopId = '" + shopId + "'";
    var sql_count = 'SELECT count(1) as count FROM complain a , serviceMeet b '+ parm +' order by a.dateline  ';
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT b.name,a.* FROM complain a , serviceMeet b '+ parm +' order by a.dateline  LIMIT ?,?';

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

    var sql = 'SELECT a.*,b.name,b.tel  FROM complain a , serviceMeet b where (a.serviceMeetId=b.id)  and a.id = ?';
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
    var  parm=   "and serviceMeetId in(" + serviceMeetIds + ")" ;
    parm+=" order by dateLine";
    var sql = 'SELECT   a.*,  c.name AS serviceName FROM  complain a,  serviceMeet b,  service c WHERE a.serviceMeetId = b.id  AND b.serviceId = c.id  '+parm;
    db.query(sql, [],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}