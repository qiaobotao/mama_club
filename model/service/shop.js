/**
 * Created by qiaojoe on 16-1-2.
 * 门店管理
 */


var db = require('../../common/db');

/**
 * 增加门店
 * @param serialNumber
 * @param name
 * @param principal
 * @param address
 * @param remark
 * @param cb
 */
module.exports.insertShop = function(serialNumber,name,principal,tel,address,remark, cb) {

    var sql = 'INSERT INTO shop (serialNumber,name,principal,tel,address,remark,dateline,status) VALUES (?,?,?,?,?,?,?,?)';
    db.query(sql, [serialNumber,name,principal,tel,address,remark, new Date().getTime(),'1'], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除门店
 * @param id
 * @param cb
 */
module.exports.delShop= function (id, cb) {

    var sql = 'DELETE FROM shop WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 分页门店信息
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchShops = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM shop ORDER BY dateline DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取所有门店
 * @param cb
 */
module.exports.fetchAllStorerooms = function(cb) {

    var sql = 'SELECT * FROM shop ORDER BY dateline DESC';
    db.query(sql, [], function(cbData, err, rows, fields){
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });

}

/**
 * 修改门店
 * @param id
 * @param name
 * @param address
 * @param principal
 * @param cb
 */
module.exports.updateShop = function(id, name, address, principal, status, cb) {

    var sql = 'UPDATE shop SET name = ?, address = ?, principal = ?, status = ? WHERE id = ?';
    var par = [name, address, principal, status, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取门店详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleShop =function (id, cb) {

    var sql = 'SELECT * FROM shop WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 设置状态
 * @param id
 * @param status
 */
module.exports.setStatus = function (id, status, cb) {

    var sql = 'UPDATE shop  SET status = ? WHERE id = ?';
    db.query(sql, [status,id], function(cbData, err, rows, filelds) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });
}
