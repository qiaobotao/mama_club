/**
 * Created by kuanchang on 16/2/28.
 */

var db = require('../../common/db');
var async = require('async');
/**
 * 增加资源
 * @param textCh
 * @param textCh
 * @param menuId
 * @param orderId
 * @param url
 * @param cb
 */
module.exports.insertSysResources = function(textCh,textEn,menuId,orderId,url, cb) {

    var sql = 'INSERT INTO sysResources (textCh,textEn,menuId,orderId,url,dateline) VALUES (?,?,?,?,?,?)';
    db.query(sql, [textCh,textEn,menuId,orderId,url, new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除资源
 * @param id
 * @param cb
 */
module.exports.delSysResources= function (id, cb) {

    var sql = 'DELETE from sysResources WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 分页资源信息
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchSysResourcess = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM sysResources ORDER BY dateline DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取所有资源
 * @param cb
 */
module.exports.fetchAllSysResources = function(textCh,currentPage,cb) {

    var parm = "WHERE textCh LIKE '%"+textCh+"%' ";

    var sql_count = 'SELECT count(*) as count FROM sysResources '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT a.*,(select b.textCh from sysMenu b where a.menuId=b.id) as parentName FROM sysResources a '+parm+' ORDER BY dateline DESC LIMIT ?,?';

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
 * 修改资源
 * @param id
 * @param textCh
 * @param textCh
 * @param parentId
 * @param orderId
 * @param url
 * @param imageUrl
 * @param cb
 */
module.exports.updateSysResources = function(id, textCh,textEn,menuId,orderId,url, cb) {
    var sql = 'UPDATE sysResources SET textCh = ?, textEn = ?, menuId = ?, orderId = ?, url = ? WHERE id = ?';
    var par = [textCh,textEn,menuId,orderId,url, id];
    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取资源详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleSysResources =function (id, cb) {

    var sql = 'SELECT * FROM sysResources WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
