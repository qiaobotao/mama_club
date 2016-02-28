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
module.exports.insertMemberCard = function(serialNumber  ,createDate  ,dateline  ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5,parameter6 , parameter7 , parameter8, parameter9,cb) {

    var sql = 'INSERT INTO memberCard (serialNumber  ,createDate  ,dateline  ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5,parameter6 , parameter7 , parameter8 ,parameter9) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [serialNumber  ,createDate  ,dateline  ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5 ,parameter6 , parameter7 , parameter8,parameter9], function(cbData, err, rows, fields) {
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
module.exports.fetchAllMemberCard = function(serialNumber  ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5, parameter6 , parameter7 , parameter8, parameter9,currentPage,cb) {

    var parm = "where serialNumber like '%" + serialNumber + "%' and type like '%" + type
        + "%' and parameter1 like '%" + parameter1 +"%' and parameter2 like '%"+ parameter2
        + "%' and parameter3 like '%"+ parameter3 + "%' and parameter4 like '%"+ parameter4
        + "%' and parameter5 like '%"+ parameter5 + "%' and parameter6 like '%"+ parameter6
        + "%' and parameter7 like '%"+ parameter7 + "%' and parameter8 like '%"+ parameter8
        + "%' and parameter9 like '%"+ parameter9  +"%'";

    var sql_count = 'SELECT count(*) as count FROM memberCard '+parm;
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT * FROM memberCard '+parm+'   LIMIT ?,?';

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
 * 删除
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
module.exports.updateMemberCard = function(id,serialNumber  ,createDate  ,dateline   ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5, parameter6 , parameter7 , parameter8,parameter9,cb) {

    var sql = 'UPDATE  memberCard  SET serialNumber  = ?,createDate  = ?,   dateline  = ?,    type  = ?,   parameter1  = ?,parameter2  = ?,   parameter3  = ?,parameter4  = ?,parameter5  =? , parameter6  = ?,parameter7  = ?,parameter8  =?,parameter9  =? WHERE  id  = ?;';
    var par = [serialNumber  ,createDate  ,dateline  , type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5,parameter6 , parameter7 , parameter8,parameter9, id];

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
module.exports.fetchSingleMembercard =function (id ,type, cb) {


    var sql = 'SELECT * FROM memberCard  WHERE id = ?';
    if(type=='1')
    {
        sql='SELECT * FROM memberCard a, memberCardType b WHERE a.id = ? AND a.parameter1=b.id';
    }
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

