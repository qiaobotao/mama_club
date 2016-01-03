/**
 * Created by qiaojoe on 15-12-12.
 * 分类管理
 */

var db = require('../../common/db');

/**
 * 获取所有父级分类
 * @param cb
 */
module.exports.getAllMainClassify = function (cb) {

    var sql = "SELECT * FROM systemMainClassify ORDER BY orderCode asc";

    db.query(sql,[],function(cbData, err, rows, fields){

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });
}

/**
 * 删除主分类
 * @param id
 * @param cb
 */
module.exports.delMainClassify = function (id, cb) {

    var sql = 'DELETE FROM systemMainClassify WHERE id = ?';

    db.query(sql, [id], function (cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    })
}

/**
 * 根据父类id获取子类信息
 * @param id
 * @param cb
 */
module.exports.getSubcollectionById = function (id,cb) {

    var sql = "SELECT * FROM systemClassify WHERE  parentId = ?";
    db.query(sql, [id], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 删除子分类
 * @param id
 * @param cb
 */
module.exports.delSubcollection = function (id, cb) {

    var sql = "DELETE FROM systemClassify WHERE id = ?";
    db.query(sql, [id], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

module.exports.getAllSubcollection = function (cb) {

    var sql = "SELECT c.id,m.name as mainName,c.name FROM systemClassify c, systemMainClassify m WHERE c.parentId = m.id ORDER BY c.id asc";

    db.query(sql, [], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}


/**
 * 增加子分类
 * @param id
 * @param name
 * @param remark
 * @param cb
 */
module.exports.addSubcollection = function (parentId, name, remark, cb) {

    var sql = "INSERT INTO systemClassify(parentId,name,remark) VALUES (?,?,?)";

    db.query(sql, [parentId, name, remark], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}