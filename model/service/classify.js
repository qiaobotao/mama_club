/**
 * Created by qiaojoe on 15-12-12.
 * 分类管理
 */

var db = require('../../common/db');
var async = require('async');

/**
 * 获取所有父级分类
 * @param cb
 */
module.exports.getAllMainClassify = function (keywords,currentPage, cb) {

    var parm = "WHERE name LIKE '%"+keywords+"%'";
    var sql_count = 'SELECT count(*) as count FROM systemMainClassify ' + parm + ' ORDER BY orderCode DESC';;
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT * FROM systemMainClassify '+parm+' ORDER BY orderCode DESC LIMIT ?,?';

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
 * 增加主分类
 * @param name
 * @param remark
 * @param orderNumner
 * @param cb
 */
module.exports.addMainClassify = function (name, remark, orderNumner, cb) {

    var sql = "INSERT INTO systemMainClassify(name,remark,orderCode) VALUES (?,?,?)";

    db.query(sql, [name,remark,orderNumner], function (cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取单个主分类
 * @param id
 * @param cb
 */
module.exports.getMainClassifyById = function (id, cb) {

    var sql = "SELECT * FROM systemMainClassify WHERE id = ?";

    db.query(sql, [id], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 修改保存主分类
 * @param id
 * @param name
 * @param remark
 * @param orderCode
 * @param cb
 */
module.exports.mainClassifyUpdate = function (id, name, remark, orderCode, cb) {

    var sql = "UPDATE systemMainClassify SET name = ?, remark = ?, orderCode = ? WHERE id = ?";

    db.query(sql, [name, remark, orderCode, id], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
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

/**
 * 所有子分类
 * @param id
 * @param cb
 */
module.exports.getAllSubcollection = function (id, keywords, currentPage, cb) {



    var parm = "WHERE name LIKE '%"+keywords+"%' and parentId = ?";

    var sql_count = 'SELECT count(*) as count FROM systemClassify ' + parm + ' ORDER BY orderCode DESC';;
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT * FROM systemClassify '+parm+' ORDER BY orderCode DESC LIMIT ?,?';

    async.series({
        totalPages : function(callback){
            db.query(sql_count, [id], function (cbData, err, rows, fields) {

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
            db.query(sql_data, [id,start, end], function (cbData, err, rows, fields) {

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

/**
 * 获取一个子分类
 * @param id
 * @param cb
 */
module.exports.getSingleSubClassifyById = function (id, cb) {

    var sql = 'SELECT * FROM systemClassify WHERE id = ?';

    db.query(sql, [id], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 修改子分类
 * @param id
 * @param parentId
 * @param name
 * @param remark
 * @param cb
 */
module.exports.subUpdate = function (id, name ,remark, cb) {

    var sql = 'UPDATE systemClassify SET name = ?,remark = ? WHERE id = ?';

    db.query(sql, [name,remark,id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}