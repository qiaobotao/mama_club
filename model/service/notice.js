/**
 * Created by qiaojoe on 16-3-18.
 * 公告管理
 */


var db = require('../../common/db');
var async = require('async');
/**
 * 增加公告
 * @param title
 * @param content
 * @param type
 * @param cb
 */
module.exports.insertNotice = function(title,content,type, cb) {

    var sql = 'INSERT INTO notice (`title`,`content`,`type`,dateline) VALUES (?,?,?,?)';
    db.query(sql, [title,content,type,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除公告
 * @param id
 * @param cb
 */
module.exports.delNotice= function (id, cb) {

    var sql = 'DELETE FROM notice WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}


/**
 * 获取所有公告
 * @param cb
 */
module.exports.fetchAllNotice = function(title,currentPage,cb) {

    var parm = "WHERE title LIKE '%"+title+"%'  ";

    var sql_count = 'SELECT count(*) as count FROM notice '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT * FROM notice '+parm+' ORDER BY dateline DESC LIMIT ?,?';

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
 * 修改公告
 * @param id
 * @param name
 * @param address
 * @param principal
 * @param cb
 */
module.exports.updateNotice = function(id, title,content,type, cb) {

    var sql = 'UPDATE notice SET `title` = ?, `content` = ?, type = ? WHERE id = ?';
    var par = [title,content,type, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取公告详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleNotice =function (id, cb) {

    var sql = 'SELECT * FROM notice WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 分页公告信息
 * @param cb
 */
module.exports.fetchNotices = function(cb) {

    var sql = 'SELECT * FROM notice ORDER BY dateline DESC ';
    db.query(sql, [], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}