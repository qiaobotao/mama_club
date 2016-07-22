/**
 * Created by kuanchang on 16/4/14.
 * 金钱管理（收费管理）
 */


var db = require('../../common/db');
var consts = require('../utils/consts');
var async = require('async');
/**
 * 增加收费管理
 * @param chargeType
 * @param memberId
 * @param staffId
 * @param classMeetId
 * @param payType
 * @param receivableMoney
 * @param discountMoney
 * @param actualMoney
 * @param activityManageId
 * @param activityManageMxId
 * @param state
 * @param cb
 */
module.exports.insertMoneyManage = function(shopId,chargeType,memberId,memberCardId,staffId,classMeetId,payType,receivableMoney,discountMoney,actualMoney,activityManageId,activityManageMxId,discounts,discountsMoney,finalActualMoney,state, cb) {
    var thisDate = new Date();
    var month = thisDate.getMonth()+1 < 10 ? "0"+(thisDate.getMonth()+1):thisDate.getMonth()+1;
    var day = thisDate.getDate() < 10 ? "0"+thisDate.getDate() : thisDate.getDate();
    var chargeTime = thisDate.getFullYear()+"-"+month+"-"+day;
    var sql = 'INSERT INTO moneyManage (shopId,chargeType,memberId,memberCardId,staffId,classMeetId,payType,receivableMoney,discountMoney,actualMoney,activityManageId,activityManageMxId,chargeTime,discounts,discountsMoney,finalActualMoney,state,dateline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [shopId,chargeType,memberId,memberCardId,staffId,classMeetId,payType,receivableMoney,discountMoney,actualMoney,activityManageId,activityManageMxId,chargeTime,discounts,discountsMoney,finalActualMoney,state,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
module.exports.updateMoneyManage4ServiceId = function(moneyManageId,nursServiceId, cb) {
    var sql = 'UPDATE moneyManage SET serviceId = ? WHERE id = ?';
    var par = [nursServiceId, moneyManageId];
    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 增加收费单中商品列表
 * @param moneyManageId
 * @param proArr
 * @param cb
 */
module.exports.insertProsByMoneyManage = function(moneyManageId,nursServiceId,proArr, cb) {

    var sql = 'INSERT INTO moneyManageWares (moneyManageId,nursServiceId,waresId,count,price,subtotal,discount,insidePrice) VALUES (?,?,?,?,?,?,?,?)';
    //批量添加收货单中商品列表信息
    async.map(proArr, function(item, callback) {
        db.query(sql, [moneyManageId,nursServiceId,item.waresId,item.count,item.price,item.subtotal,item.discount,item.insidePrice], function (cbData, err, rows, fields) {
            if (!err) {
                callback(null, rows);
            } else {
                callback(err);
            }
        });
    }, function(err,results) {
        cb(err, results);
    });
};
/**
 * 增加收费单中服务列表
 * @param moneyManageId
 * @param proArr
 * @param cb
 */
module.exports.insertServiceByMoneyManage = function(moneyManageId,nursServiceId,serviceArr, cb) {
    var sql = 'INSERT INTO moneyManageServices (moneyManageId,nursServiceId,serviceId,count,price,subtotal,discount,staffId,traineeId) VALUES (?,?,?,?,?,?,?,?,?)';
    //批量添加收货单中商品列表信息
    async.map(serviceArr, function(item, callback) {
        db.query(sql, [moneyManageId,nursServiceId,item.serviceId,item.serviceCount,item.servicePrice,item.serviceSubtotal,item.serviceLessMoney,item.serviceStaffId,item.serviceTraineeId], function (cbData, err, rows, fields) {
            if (!err) {
                callback(null, rows);
            } else {
                callback(err);
            }
        });
    }, function(err,results) {
        cb(err, results);
    });
};

/**
 * 删除收费管理
 * @param id
 * @param cb
 */
module.exports.delMoneyManage= function (id, serviceId,cb) {

    var delMoneyManageSql = 'DELETE FROM moneyManage WHERE id = ?';
    var delMoneyManageWaresSql = 'DELETE FROM moneyManageWares WHERE moneyManageId = ?';
    var delMoneyManageServicesSql = 'DELETE FROM moneyManageServices WHERE moneyManageId = ?';
    var delNursServiceSql = 'DELETE FROM nursService WHERE id = ?';

    async.series({
        delMoneyManage : function(callback){
            db.query(delMoneyManageSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        delMoneyManageWares : function(callback){
            db.query(delMoneyManageWaresSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        delMoneyManageServices : function(callback){
            db.query(delMoneyManageServicesSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        delNursService : function(callback){
            db.query(delNursServiceSql, [serviceId], function (cbData, err, rows, fields) {
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
 * 获取所有收费管理
 * @param cb
 */
module.exports.fetchAllMoneyManage = function(chargeType,startDate,endDate,state,currentPage,cb) {

    var selectArr = new Array();
    var selectCountArr = new Array();
    var parm = "WHERE 1=1 ";
    if(chargeType != ''){
        parm += " AND m.chargeType = ? ";
        selectArr.push(chargeType);
        selectCountArr.push(chargeType);
    }
    if(startDate != ''){
        parm += " AND DATE_FORMAT(?,'%Y-%m-%d') <= DATE_FORMAT(m.chargeTime,'%Y-%m-%d') ";
        selectArr.push(startDate);
        selectCountArr.push(startDate);
    }
    if(endDate != ''){
        parm += " AND DATE_FORMAT(?,'%Y-%m-%d') >= DATE_FORMAT(m.chargeTime,'%Y-%m-%d') ";
        selectArr.push(endDate);
        selectCountArr.push(endDate);
    }
    if(state != ''){
        parm += " AND m.state = ?  ";
        selectArr.push(state);
        selectCountArr.push(state);
    }

    var sql_count = 'SELECT count(*) as count FROM moneyManage m '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT m.id,m.chargeTime,m.serviceId,m.chargeType,m.payType,m.receivableMoney,m.actualMoney,m.finalActualMoney,m.state,' +
        '( ' +
        '	select s.`name` from staff s where s.id = m.staffId ' +
        ') as `staffName`, ' +
        '(' +
        '	select me.memberName from member me where me.id = m.memberId' +
        ') as memberName ,' +
        '( 	' +
        '   select me.memberName from memberCard mc ,member me where me.id = mc.memberId and mc.id = m.memberCardId' +
        ') as `memberCardName`' +
        'FROM moneyManage m '+parm+' ORDER BY dateline DESC LIMIT ?,?';

    selectArr.push(start);
    selectArr.push(end);
    async.series({
        totalPages : function(callback){
            db.query(sql_count, selectCountArr, function (cbData, err, rows, fields) {

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
            db.query(sql_data, selectArr, function (cbData, err, rows, fields) {

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
 * 修改收费管理
 * 付款方式、实付金额、付费状态
 */
module.exports.updateMoneyManage = function(id, payType,actualMoney,state, cb) {

    var sql = 'UPDATE moneyManage SET payType = ?, actualMoney = ?, state = ? WHERE id = ?';
    var par = [payType,actualMoney,state, id];
    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取收费管理详情(护理服务单)
 * @param id
 * @param cb
 */
module.exports.fetchSingleMoneyManageByHuli =function (id,thisDate , cb) {

    //根据id获取收费单id
    var oneMoneyManageSql = 'SELECT s.nursServiceNo,n.serviceDate,s.serviceTime,n.endTime,b.memberName,b.tel,m.* ' +
        'from moneyManage m ,nursService n , serviceMeet s,member b ' +
        'where m.serviceId = n.id ' +
        'and n.id = s.nursServiceId ' +
        'and s.memberId = b.id ' +
        'and m.id = ?';
    //获取所有启用中的活动列表
    var enableActivityManageSql = "select * from activityManage a " +
        "where a.`status`  = ? " +
        "and str_to_date(a.effectiveTimeStart, '%Y-%m-%d') <= str_to_date(?, '%Y-%m-%d') " +
        "and  str_to_date(?, '%Y-%m-%d') <= str_to_date(a.effectiveTimeEnd, '%Y-%m-%d') ";

    //获取收费子表（服务信息）数据
    var moneyManageServicesSql = "SELECT m.*," +
        "   (SELECT name from staff s WHERE s.id = m.staffId) as serviceStaffName," +
        "   (SELECT name from staff s WHERE s.id = m.traineeId) as traineeStaffName ," +
        "   (select name from service s where id = m.serviceId) as serviceName " +
        "FROM moneyManageServices m WHERE moneyManageId = ? ";
    //获取收费子表（商品信息）数据
    var moneyManageWaresSql = "SELECT m.*,w.`name`,w.serialNumber FROM moneyManageWares m , wares w  WHERE m.waresId = w.id AND m.moneyManageId = ? ";
    //获取服务单数据
    //var nursServiceSql = "SELECT * FROM nursService WHERE moneyManageId = ? ";


    async.series({
        //收费单id
        moneyManageData : function(callback){
            db.query(oneMoneyManageSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //获取收费子表（服务信息）数据
        moneyManageServicesData : function(callback){
            db.query(moneyManageServicesSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //获取收费子表（商品信息）数据
        moneyManageWaresData : function(callback){
            db.query(moneyManageWaresSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //所有活动信息
        activityManageData : function(callback){
            db.query(enableActivityManageSql, [consts.STATE_DISABLE, thisDate,thisDate], function (cbData, err, rows, fields) {

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