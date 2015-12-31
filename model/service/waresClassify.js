/**
 * Created by qiaojoe on 15-12-12.
 * 商品分类接口
 */


var db = require('../../common/db');


/**
 * 增加产品分类
 * @param classifyName
 * @param remarks
 * @param cb
 */
module.exports.insertWaresClassify = function(classifyName, remarks, cb) {

    var sql = 'INSERT INTO waresClassify (classifyName, remarks, dateline) VALUES (?,?,?)';
    db.query(sql, [classifyName, remarks, new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 分页商品分类信息
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchWaresClassify = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM waresClassify ORDER BY dateline DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取所有商品分类
 * @param cb
 */
module.exports.fetchAllWaresClassify = function(cb) {

    var sql = 'SELECT * FROM waresClassify ORDER BY dateline DESC';
    db.query(sql, [], function(cbData, err, rows, fields){
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });

}

/**
 * 更新分类信息
 * @param id
 * @param classifyName
 * @param remarks
 * @param cb
 */
module.exports.updateWaresClassify = function(id, classifyName, remarks, cb) {

    var sql = 'UPDATE waresClassify SET classifyName = ?, remarks = ? WHERE id = ?';
    var par = [classifyName, remarks, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 删除商品分类
 * @param id
 * @param cb
 */
module.exports.delWaresClassify = function (id, cb) {

    var sql = 'DELETE FROM waresClassify WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取商品分类详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleWaresClassify =function (id, cb) {

    var sql = 'SELECT * FROM WaresClassify WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
