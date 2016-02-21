/**
 * Created by Administrator on 2016/1/31.
 */
/**
 * Created by qiaojoe on 16-1-2.
 * 教室管理
 */


var db = require('../../common/db');
var async = require('async');
/**
 * 添加教室
 * @param serialNumber
 * @param name
 * @param classCode
 * @param classType
 * @param remark
 * @param materialid
 * @param cb
 */
module.exports.insertMemberCard = function(serialNumber  ,createDate  ,dateline  ,memberId ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5, cb) {

    var sql = 'INSERT INTO memberCard (serialNumber  ,createDate  ,dateline  ,memberId ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5) VALUES (?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [serialNumber  ,createDate  ,dateline  ,memberId ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
/**
 * 添加教室
 * @param serialNumber
 * @param name
 * @param classCode
 * @param classType
 * @param remark
 * @param materialid
 * @param cb
 */
module.exports.fetchAllMemberCard = function(memberCardType, memberCardAmount, zeroDiscounts, currentPage, cb) {

    var parm = "where memberCardType like '%" + memberCardType + "%' and memberCardAmount like '%" + memberCardAmount
        + "%' and zeroDiscounts like '%" + zeroDiscounts + "%'";

    var sql_count = 'SELECT count(*) as count FROM memberCardType '+parm;
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT * FROM memberCardType '+parm+'   LIMIT ?,?';

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
 * 删除教室
 * @param id
 * @param cb
 */
module.exports.delMembercard= function (id, cb) {

    var sql = 'DELETE FROM memberCard WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 查询菜单
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchMembercard = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM memberCard  ORDER BY id DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}



/**
 * 修改会员卡

 * @param cb
 */
module.exports.updateMemberCard = function(id,serialNumber  ,createDate  ,dateline  ,memberId ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5, cb) {

    var sql = 'UPDATE  memberCard  SET serialNumber  = ?,createDate  = ?,   dateline  = ?,   memberId  = ?,  type  = ?,   parameter1  = ?,parameter2  = ?,   parameter3  = ?,parameter4  = ?,parameter5  =? WHERE  id  = ?;';
    var par = [serialNumber  ,createDate  ,dateline  ,memberId ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取会员卡详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleMembercard =function (id, cb) {

    var sql = 'SELECT * FROM membercard  WHERE id = ?';
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

    var sql = 'UPDATE membercardtype  SET status = ? WHERE id = ?';
    db.query(sql, [status,id], function(cbData, err, rows, filelds) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });
}

