/**
 * Created by qiaojoe on 15-12-12.
 * 提供商品的数据访问接口
 */

var db = require('../../common/db');


/**
 * 增加商品
 * @param name
 * @param longname
 * @param brand
 * @param standard
 * @param serialNumber
 * @param remarks
 * @param lowData
 * @param cb
 */
module.exports.insertWares = function(name, longname, brand, standard, serialNumber, remarks, lowData, cb) {

    var sql = 'INSERT INTO wares (name, longname, brand, standard, serialNumber, remarks, lowData, dateline) VALUES (?,?,?,?,?,?,?,?)';
    db.query(sql, [name, longname, brand, standard, serialNumber, remarks, lowData, new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 分页商品信息
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchWares = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM wares ORDER BY dateline DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取所有商品
 * @param cb
 */
module.exports.fetchAllWares = function(cb) {

    var sql = 'SELECT * FROM wares ORDER BY dateline DESC';
            db.query(sql, [], function(cbData, err, rows, fields){
                if (!err) {
                    cb(null, rows);
                } else {
            cb(err);
        }

    });

}

/**
 * 更新商品信息
 * @param id
 * @param name
 * @param longname
 * @param brand
 * @param standard
 * @param serialNumber
 * @param remarks
 * @param lowData
 * @param cb
 */
module.exports.updateWares = function(id, name, longname, brand, standard, serialNumber, remarks, lowData, cb) {

    var sql = 'UPDATE wares SET name = ?, longname = ?, brand = ?, standard = ?, serialNumber = ?, remarks = ?, lowData = ? WHERE id = ?';
    var par = [name, longname, brand, standard, serialNumber, remarks, lowData, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 删除商品
 * @param id
 * @param cb
 */
module.exports.delWares = function (id, cb) {

    var sql = 'DELETE FROM wares WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取商品详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleWares =function (id, cb) {

    var sql = 'SELECT * FROM wares WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
