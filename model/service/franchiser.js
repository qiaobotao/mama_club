/**
 * Created by qiaojoe on 15-12-12.
 * 经销商数据接口
 */

var db = require('../../common/db');


/**
 * 增加经销商
 * @param name
 * @param address
 * @param remarks
 * @param cb
 */
module.exports.insertFranchiser = function(name, address, remarks, cb) {

    var sql = 'INSERT INTO franchiser (name, address, remarks, dateline) VALUES (?,?,?,?)';
    db.query(sql, [name, address, remarks, new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 分页获取经销商
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchFranchisers = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM franchiser ORDER BY dateline DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取所有经销商
 * @param cb
 */
module.exports.fetchAllFranchisers = function(cb) {

    var sql = 'SELECT * FROM franchiser ORDER BY dateline DESC';
    db.query(sql, [], function(cbData, err, rows, fields){
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });

}

/**
 * 修改经销商
 * @param id
 * @param name
 * @param address
 * @param remarks
 * @param cb
 */
module.exports.updateFranchiser = function(id, name, address, remarks, cb) {

    var sql = 'UPDATE franchiser SET name = ?, address = ?, remarks = ? WHERE id = ?';
    var par = [name, address, remarks, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 删除经销商
 * @param id
 * @param cb
 */
module.exports.delFranchiser = function (id, cb) {

    var sql = 'DELETE FROM franchiser WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取经销商详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleFranchiser =function (id, cb) {

    var sql = 'SELECT * FROM franchiser WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
