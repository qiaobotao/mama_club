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
module.exports.insertServiceMeet = function(tel,name,age,principal,meetTime,problemDescription,serviceType,address,price, cb) {

    var sql = 'INSERT INTO service_meet (tel,name,age,principal,meetTime,problemDescription,serviceType,address,price) VALUES (?,?,?,?,?,?,?,?,?)';
    db.query(sql, [tel,name,age,principal,meetTime,problemDescription,serviceType,address,price], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
module.exports.updateServiceMeet = function(id,tel,name,age,principal,meetTime,problemDescription,serviceType,address,price, cb) {

    var sql = 'UPDATE   service_meet SET  tel  =  ? ,  name  =  ? , meetTime  =  ? , age  =  ? ,   principal  =  ? ,   problemDescription  =  ? ,   serviceType  =  ? ,   address  =  ? ,   price  =  ?   WHERE  id  =  ?  ';
    db.query(sql, [tel,name,meetTime,age,principal,problemDescription,serviceType,address,price,id], function(cbData, err, rows, fields) {
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
module.exports.fetchAllServiceMeet = function(tel,name,meetTime,status,currentPage,cb) {

    var myDate = new Date();
    var parm = "where tel like '%" + tel + "%' and name like '%" + name
        + "%' and meetTime like '%" + meetTime + "%' and status like '%" + status + "%'";


    var sql_count = 'SELECT count(*) as count FROM service_meet '+parm;
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT * FROM service_meet '+parm+'   LIMIT ?,?';

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
module.exports.delServiceMeet= function (id, cb) {

    var sql = 'DELETE FROM service_meet WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

module.exports.fetchSingleServiceMeet =function (id, cb) {

    var sql = 'SELECT * FROM service_meet WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

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
module.exports.fetchMembercardtype = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM memberCardType ORDER BY id DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}



/**
 * 修改教室
 * @param id
 * @param name
 * @param address
 * @param principal
 * @param cb
 */
module.exports.updateMemberCardType = function(id,memberCardType,memberCardAmount,consumerLimit,zeroDiscounts,isManyPeopleUsed,status, cb) {

    var sql = 'UPDATE  memberCardType SET memberCardType  = ?, memberCardAmount = ?,consumerLimit =?,zeroDiscounts = ?, isManyPeopleUsed =?,status =? WHERE id = ?;';
    var par = [memberCardType,memberCardAmount,consumerLimit,zeroDiscounts,isManyPeopleUsed,status, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取门店详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleMembercardtype =function (id, cb) {

    var sql = 'SELECT * FROM memberCardType WHERE id = ?';
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

    var sql = 'UPDATE memberCardType  SET status = ? WHERE id = ?';
    db.query(sql, [status,id], function(cbData, err, rows, filelds) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });
}

