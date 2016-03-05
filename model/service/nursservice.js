/**
 * Created by Administrator on 2016/1/31.
 */
/**
 * Created by qiaojoe on 16-1-2.
 * 教室管理
 */


var db = require('../../common/db');
var async = require('async');

module.exports.insertNursService = function(serviceMeetId,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
                                       bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
                                       milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
                                       diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
                                       isLeadTrainee,whetherAppointmentAgain,traineeName, cb) {

    var sql = 'INSERT INTO nursService(serviceMeetId,serviceDate,startTime,endTime,serviceType,address,serviceNeeds,'
        + 'bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,'
        + 'milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,'
        + 'diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,'
        + 'isLeadTrainee,whetherAppointmentAgain,traineeName,dateLine) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [serviceMeetId,serviceDate,startTime,endTime,serviceType,address,serviceNeeds,
        bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
        milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
        diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
        isLeadTrainee,whetherAppointmentAgain,traineeName,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.updateNursService = function(id,serviceMeetId,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
                                            bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
                                            milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
                                            diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
                                            isLeadTrainee,whetherAppointmentAgain,traineeName, cb) {

    var sql = 'UPDATE nursService set serviceMeetId=?,serviceDate=?,startTime=?,endTime=?,serviceType=?,address=?,serviceNeeds=?,'
        + ' bowelFrequenc=?,deal=?,shape=?,feedSituation=?,urination=?,feedRemark=?,milkSituation=?,childCurrentMonths=?,'
        + ' milkNumber=?,childCurrentHeight=?,milkAmount=?,childCurrentWeight=?,breastpumpBrand=?,isCarefulNurse=?,referralAdvise=?,'
        + ' diagnosis=?,specialInstructions=?,childReason=?,breastExplain=?,motherReason=?,leaveAdvise=?,otherReason=?,'
        + ' isLeadTrainee=?,whetherAppointmentAgain=?,traineeName=?,dateLine=?'
        + ' where id=?';
    db.query(sql, [serviceMeetId,serviceDate,startTime,endTime,serviceType,address,serviceNeeds,
        bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
        milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
        diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
        isLeadTrainee,whetherAppointmentAgain,traineeName,new Date().getTime(),id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.fetchAllNursService = function(name,principal,serviceDate,currentPage,cb) {

    var parm = " on (a.serviceMeetId=b.id)"
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

    var sql = 'SELECT a.*,b.tel,b.name,b.address FROM nursService a inner join serviceMeet b on (a.serviceMeetId=b.id) WHERE a.id = ?';
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
/**
 * 获取前三条预约数据根据会员id 或者 姓名和电话
 * @param id
 * @param cb
 */
module.exports.getTop3NursService =function (serviceMeetIds, cb) {
    var  parm=   "and a.serviceMeetId in(" + serviceMeetIds + ")" ;
    parm+=" order by dateLine";
    var sql = 'SELECT   a.*,  c.name AS serviceName,  b.principal AS principal,  d.name AS serviceType FROM  nursService a,  serviceMeet b,  service c,  systemClassify d WHERE a.serviceMeetId = b.id AND b.serviceId = c.id  AND c.classify = d.id  '+parm;
    db.query(sql, [],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
/**
 * 操作明细表
 * @param mid
 * @param arr_obj  [{},{}] 结构
 * @param cb
 */
module.exports.insertnsMX = function (mid,arr_obj,cb) {

    if (arr_obj.length == 0) {
        return;
    }

    var sql = 'INSERT INTO nursServiceMX (nursServiceId,waresSerial,waresName,count,price) VALUES (?,?,?,?,?)';
    async.map(arr_obj, function(item, callback) {

        db.query(sql, [mid,item.proSerial,item.proName,item.count,item.price], function (cbData, err, rows, fields) {
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