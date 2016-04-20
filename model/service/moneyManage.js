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
 * @param serviceId
 * @param payType
 * @param receivableMoney
 * @param discountMoney
 * @param actualMoney
 * @param activityManageId
 * @param activityManageMxId
 * @param state
 * @param cb
 */
module.exports.insertMoneyManage = function(chargeType,memberId,staffId,classMeetId,serviceId,payType,receivableMoney,discountMoney,actualMoney,activityManageId,activityManageMxId,state, cb) {
    var thisDate = new Date();
    var month = thisDate.getMonth()+1 < 10 ? "0"+(thisDate.getMonth()+1):thisDate.getMonth()+1;
    var day = thisDate.getDate() < 10 ? "0"+thisDate.getDate() : thisDate.getDate();
    var chargeTime = thisDate.getFullYear()+"-"+month+"-"+day;
    var sql = 'INSERT INTO moneyManage (chargeType,memberId,staffId,classMeetId,serviceId,payType,receivableMoney,discountMoney,actualMoney,activityManageId,activityManageMxId,chargeTime,state,dateline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [chargeType,memberId,staffId,classMeetId,serviceId,payType,receivableMoney,discountMoney,actualMoney,activityManageId,activityManageMxId,chargeTime,state,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 增加收费单中商品列表
 * @param chargeType
 * @param memberId
 * @param staffId
 * @param classMeetId
 * @param serviceId
 * @param state：收费单状态包括：未收费、已收费
 * @param cb
 */
module.exports.insertProsByMoneyManage = function(moneyManageId,proArr, cb) {

    var sql = 'INSERT INTO moneyManageWares (moneyManageId,waresId,count,price,subtotal,discount) VALUES (?,?,?,?,?,?)';
    //批量添加收货单中商品列表信息
    async.map(proArr, function(item, callback) {
        db.query(sql, [moneyManageId,item.waresId,item.count,item.price,item.subtotal,item.discount], function (cbData, err, rows, fields) {
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
module.exports.delMoneyManage= function (id, cb) {

    var sql = 'DELETE FROM moneyManage WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
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
    var sql_data = 'SELECT m.id,m.chargeTime,m.chargeType,m.payType,m.receivableMoney,m.actualMoney,m.state,' +
        '( ' +
        '	select s.`name` from staff s where s.id = m.staffId ' +
        ') as `staffName`, ' +
        '(' +
        '	select me.memberName from member me where me.id = m.memberId' +
        ') as memberName ' +
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
 * @param id
 * @param name
 * @param address
 * @param principal
 * @param cb
 */
module.exports.updateMoneyManage = function(id, chargeType,memberId,staffId,classMeetId,serviceId,state, cb) {

    var sql = 'UPDATE moneyManage SET serialNumber = ?, name = ?, tel = ?, address = ?, principal = ?, remark = ? WHERE id = ?';
    var par = [serialNumber, name, tel, address, principal, remark, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取收费管理详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleMoneyManage =function (id,thisDate , cb) {

    //根据id获取收费单id
    var oneMoneyManageSql = 'SELECT * FROM moneyManage WHERE id = ? ';
    //获取所有启用中的活动列表
    var enableActivityManageSql = "select * from activityManage a " +
        "where a.`status`  = ? " +
        "and str_to_date(a.effectiveTimeStart, '%Y-%m-%d') <= str_to_date(?, '%Y-%m-%d') " +
        "and  str_to_date(?, '%Y-%m-%d') <= str_to_date(a.effectiveTimeEnd, '%Y-%m-%d') ";

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
        //
        //activityManageData : function(callback){
        //    db.query(enableActivityManageSql, [consts.STATE_ENABLE, thisDate,thisDate], function (cbData, err, rows, fields) {
        //
        //        if (!err) {
        //            callback(null,rows);
        //        } else {
        //            callback(err);
        //        }
        //    });
        //},
    },function(err, results) {

        if (!err) {
            cb (null, results);
        } else {
            cb(err);
        }
    });


}