/**
 * Created by Administrator on 2016/1/31.
 */
/**
 * Created by qiaojoe on 16-1-2.
 * 教室管理
 */


var db = require('../../common/db');
var async = require('async');

module.exports.insertNursService = function(serialNumber,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
                                       bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
                                       milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
                                       diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
                                       isLeadTrainee,whetherAppointmentAgain,traineeName, cb) {

    var sql = 'INSERT INTO nursService(serialNumber,serviceDate,startTime,endTime,serviceType,address,serviceNeeds,'
        + 'bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,'
        + 'milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,'
        + 'diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,'
        + 'isLeadTrainee,whetherAppointmentAgain,traineeName) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [serialNumber,serviceDate,startTime,endTime,serviceType,address,serviceNeeds,
        bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
        milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
        diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
        isLeadTrainee,whetherAppointmentAgain,traineeName], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.updateNursService = function(id,serialNumber,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
                                            bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
                                            milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
                                            diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
                                            isLeadTrainee,whetherAppointmentAgain,traineeName, cb) {

    var sql = 'UPDATE nursService set serviceDate=?,startTime=?,endTime=?,serviceType=?,address=?,serviceNeeds=?,'
        + ' bowelFrequenc=?,deal=?,shape=?,feedSituation=?,urination=?,feedRemark=?,milkSituation=?,childCurrentMonths=?,'
        + ' milkNumber=?,childCurrentHeight=?,milkAmount=?,childCurrentWeight=?,breastpumpBrand=?,isCarefulNurse=?,referralAdvise=?,'
        + ' diagnosis=?,specialInstructions=?,childReason=?,breastExplain=?,motherReason=?,leaveAdvise=?,otherReason=?,'
        + ' isLeadTrainee=?,whetherAppointmentAgain=?,traineeName=?'
        + ' where id=?';
    db.query(sql, [serviceDate,startTime,endTime,serviceType,address,serviceNeeds,
        bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
        milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
        diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
        isLeadTrainee,whetherAppointmentAgain,traineeName,id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.fetchAllNursService = function(name,principal,serviceDate,currentPage,cb) {

    var parm = " on (a.serialNumber=b.id)"
    if (name != '')
        parm += " and b.name like'%" + name + "%'";
    if (principal != '')
        parm += " and b.principal like'%" + principal + "%'";
    if (serviceDate != '')
        parm += " and a.serviceDate like'%" + serviceDate + "%'";

    var sql_count = 'SELECT count(*) as count FROM nursService';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT a.id,b.name,b.tel,a.serviceDate,b.principal,b.status FROM nursService a inner join serviceMeet b'+ parm +' LIMIT ?,?';

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

module.exports.fetchSingleNursService =function (id, cb) {

    var sql = 'SELECT a.*,b.tel,b.name,b.address FROM nursService a inner join serviceMeet b on (a.serialNumber=b.id) WHERE a.id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
module.exports.delNursService= function (id, cb) {

    var sql = 'DELETE FROM nursService WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}