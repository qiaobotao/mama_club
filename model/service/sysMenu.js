/**
 * Created by kuanchang on 16/2/28.
 */

var db = require('../../common/db');
var async = require('async');
/**
 * 增加菜单
 * @param textCh
 * @param textCh
 * @param parentId
 * @param orderId
 * @param url
 * @param imageUrl
 * @param cb
 */
module.exports.insertSysMenu = function(textCh,textEn,parentId,orderId,url, cb) {

    var sql = 'INSERT INTO sysMenu (textCh,textEn,parentId,orderId,url,dateline) VALUES (?,?,?,?,?,?)';
    db.query(sql, [textCh,textEn,parentId,orderId,url, new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除菜单
 * @param id
 * @param cb
 */
module.exports.delSysMenu= function (id, cb) {

    var sql = 'DELETE from sysMenu WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 分页菜单信息
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchSysMenus = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM sysMenu ORDER BY dateline DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取所有菜单
 * @param cb
 */
module.exports.fetchAllSysMenu = function(textCh,currentPage,cb) {

    var parm = "WHERE textCh LIKE '%"+textCh+"%' ";

    var sql_count = 'SELECT count(*) as count FROM sysMenu '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT a.*,(select b.textCh from sysMenu b where a.parentId=b.id) as parentName FROM sysMenu a '+parm+' ORDER BY dateline DESC LIMIT ?,?';

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
 * 修改菜单
 * @param id
 * @param textCh
 * @param textCh
 * @param parentId
 * @param orderId
 * @param url
 * @param imageUrl
 * @param cb
 */
module.exports.updateSysMenu = function(id, textCh,textEn,parentId,orderId,url, cb) {
    var sql = 'UPDATE sysMenu SET textCh = ?, textEn = ?, parentId = ?, orderId = ?, url = ? WHERE id = ?';
    var par = [textCh,textEn,parentId,orderId,url, id];
    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取菜单详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleSysMenu =function (id, cb) {

    var sql = 'SELECT * FROM sysMenu WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 获取父菜单为空的所有菜单
 * @param id
 * @param cb
 */
module.exports.findAllParentSysMenu =function (cb) {

    var sql = 'SELECT * FROM sysMenu where parentId = 0';
    db.query(sql, [],  function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
