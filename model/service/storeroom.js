/**
 * Created by qiaojoe on 15-12-12.
 * 提供仓库的数据访问接口
 */

var db = require('../../common/db');


/**
 * 增加仓库
 * @param name
 * @param address
 * @param principal
 * @param cb
 */
module.exports.insertStoreroom = function(name, address, principal, status, cb) {

    var sql = 'INSERT INTO storeroom (name, address, principal, status, dateline) VALUES (?,?,?,?,?)';
    db.query(sql, [name, address, principal, status, new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 分页获取仓库
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchStorerooms = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM storeroom ORDER BY dateline DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取所有仓库
 * @param cb
 */
module.exports.fetchAllStorerooms = function(cb) {

    var sql = 'SELECT * FROM storeroom ORDER BY dateline DESC';
    db.query(sql, [], function(cbData, err, rows, fields){
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });

}

/**
 * 修改仓库
 * @param id
 * @param name
 * @param address
 * @param principal
 * @param cb
 */
module.exports.updateStoreroom = function(id, name, address, principal, status, cb) {

    var sql = 'UPDATE storeroom SET name = ?, address = ?, principal = ?, status = ? WHERE id = ?';
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
 * 删除仓库
 * @param id
 * @param cb
 */
module.exports.delStoreroom = function (id, cb) {

    var sql = 'DELETE FROM storeroom WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取仓库详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleStoreroom =function (id, cb) {

    var sql = 'SELECT * FROM storeroom WHERE id = ?';
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

    var sql = 'UPDATE storeroom  SET status = ? WHERE id = ?';
    db.query(sql, [status,id], function(cbData, err, rows, filelds) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });
}
