/**
 * Created by Administrator on 2016/1/31.
 */

var db = require('../../common/db');
var async = require('async');
var utils = require('../../common/utils');

module.exports.insertComplain = function(shopId,nursServiceId,complainStaffId,complainType,solveStaffId,complainDetail, cb) {

    var complainTime = utils.date2str(new Date(), "yyyy-MM-d h:m:s");//投诉时间
    var sql = 'INSERT INTO complain (shopId,nursServiceId,complainStaffId,complainType,solveStaffId,complainDetail,complainTime,dateLine) '
        + ' VALUES (?,?,?,?,?,?,?,?)';
    db.query(sql, [shopId,nursServiceId,complainStaffId,complainType,solveStaffId,complainDetail,complainTime,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.updateComplain = function(complainId,complainType,complainDetail, cb) {

    var sql = 'UPDATE complain set complainType=?,complainDetail=? where id=?';
    db.query(sql, [complainType,complainDetail,complainId], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.fetchAllComplain = function(shopId,complainType,complainTimeStart,complainTimeEnd,currentPage,cb) {

    var parm = " where a.nursServiceId=n.id and n.serviceMeetId = b.id ";
    if (complainTimeStart != '')
        parm += " and str_to_date(a.complainTime, '%Y-%m-%d') >=str_to_date('" + complainTimeStart + "', '%Y-%m-%d')";
    if (complainTimeEnd != '')
        parm += " and str_to_date(a.complainTime, '%Y-%m-%d') <=str_to_date('" + complainTimeEnd + "', '%Y-%m-%d')";
    if (complainType != '')
        parm += " and a.complainType like '%" + complainType + "%'";
    if (shopId != '')
        parm += " and a.shopId = '" + shopId + "'";
    var sql_count = 'SELECT count(1) as count FROM complain a , nursService n, nursService b '+ parm +' order by a.dateline  ';
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT b.name,a.*,n.nursServiceNo,' +
        '(select name from staff s where s.id = a.complainStaffId) as complainStaff,' +
        '(select name from staff s where s.id = a.solveStaffId) as solveStaff   FROM complain a , nursService n,serviceMeet b '+ parm +' order by a.dateline  LIMIT ?,?';

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
    //当前投诉单详情信息
    var sql = 'SELECT ' +
        '   a.*,n.nursServiceNo,n.id as nursServiceId,b.name,b.tel , ' +
        '   (select name from staff s where s.id = a.complainStaffId) as complainStaff,' +
        '   (select name from staff s where s.id = a.solveStaffId) as solveStaff  ' +
        'FROM complain a , nursService n,serviceMeet b ' +
        'where a.nursServiceId=n.id and n.serviceMeetId = b.id ' +
        'and a.id = ? ';

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
    parm+=" order by a.complainTime desc";
    var sql = 'SELECT   a.*,  c.name AS serviceName FROM  complain a,  serviceMeet b,  service c WHERE a.serviceMeetId = b.id  AND b.serviceId = c.id  '+parm;
    db.query(sql, [],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}