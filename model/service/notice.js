/**
 * Created by qiaojoe on 16-3-18.
 * 公告管理
 */


var db = require('../../common/db');
var async = require('async');
/**
 * 往公告主表添加记录
 * @param title
 * @param content
 * @param type
 * @param cb
 */
module.exports.insertNotice = function(title,content,type, cb) {
    //往公告主表中增加一条记录
    var insertSql = 'INSERT INTO notice (`title`,`content`,`type`,dateline) VALUES (?,?,?,?)';
    //查询系统用户所对应的id
    var selectUserSql = "select id from sysUser where activity = 'Y'";

    async.series({
        newNotice : function(callback){
            db.query(insertSql, [title,content,type,new Date().getTime()], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        userData : function(callback){
            db.query(selectUserSql, [], function (cbData, err, rows, fields) {

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

};

/**
 * 往系统用户和公告表中增加记录
 * @param noticeId
 * @param userIds
 * @param cb
 */
module.exports.insertSysUserNotice = function(noticeId,userIds, cb) {
    //往公告主表中增加一条记录
    var insertSql = 'INSERT INTO sysUserNotice (`noticeId`,`userId`,`isread`) VALUES (?,?,?)';
    //批量添加员工的职业资格信息
    async.map(userIds, function(item, callback) {
        db.query(insertSql, [noticeId,item.id,'0'], function (cbData, err, rows, fields) {
            if (!err) {
                callback(null, rows);
            } else {
                callback(err);
            }
        });
    }, function(err,results) {
        cb(err, results);
    });
};

/**
 * 删除公告
 * 删除用户及公告对应关系数据
 * @param id
 * @param cb
 */
module.exports.delNotice= function (id, cb) {

    var delNoticeSql = 'DELETE FROM notice WHERE id = ?';
    var delNoticeByUserSql = 'DELETE FROM sysUserNotice WHERE noticeId = ?';

    async.series({
        delNotice : function(callback){
            db.query(delNoticeSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        delNoticeByUser : function(callback){
            db.query(delNoticeByUserSql, [id], function (cbData, err, rows, fields) {

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
 * 获取所有公告
 * @param cb
 */
module.exports.fetchAllNotice = function(title,type,currentPage,cb) {

    var parm = "WHERE title LIKE '%"+title+"%'  ";
    var parmArr = new Array();
    var parmCountArr = new Array();
    if(type != ''){
        parm += " AND type = ? ";
        parmArr.push(type);
        parmCountArr.push(type);
    }

    var sql_count = 'SELECT count(*) as count FROM notice '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT * FROM notice '+parm+' ORDER BY dateline DESC LIMIT ?,?';
    parmArr.push(start);
    parmArr.push(end);
    async.series({
        totalPages : function(callback){
            db.query(sql_count, parmCountArr, function (cbData, err, rows, fields) {

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
            db.query(sql_data, parmArr, function (cbData, err, rows, fields) {

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