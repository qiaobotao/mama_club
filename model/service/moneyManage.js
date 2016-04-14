/**
 * Created by kuanchang on 16/4/14.
 * 金钱管理（收费管理）
 */


var db = require('../../common/db');
var async = require('async');
/**
 * 增加收费管理
 * @param chargeType
 * @param memberId
 * @param staffId
 * @param classMeetId
 * @param serviceId
 * @param state：收费单状态包括：未收费、已收费
 * @param cb
 */
module.exports.insertMoneyManage = function(chargeType,memberId,staffId,classMeetId,serviceId,state, cb) {

    var sql = 'INSERT INTO moneyManage (chargeType,memberId,staffId,classMeetId,serviceId,state,dateline) VALUES (?,?,?,?,?,?,?)';
    db.query(sql, [chargeType,memberId,staffId,classMeetId,serviceId,state,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
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
module.exports.fetchAllMoneyManage = function(name,principal,number,currentPage,cb) {

    var parm = "WHERE 1=1 ";

    var sql_count = 'SELECT count(*) as count FROM moneyManage '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT * FROM moneyManage '+parm+' ORDER BY dateline DESC LIMIT ?,?';

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
module.exports.fetchSingleMoneyManage =function (id, cb) {

    var sql = 'SELECT * FROM moneyManage WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}