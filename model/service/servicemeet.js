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
module.exports.insertServiceMeet = function(specified,staffId,tel,name,age,principal,meetTime,problemDescription,serviceType,address,price, memberId,serviceId,cb) {

    var sql = 'INSERT INTO serviceMeet (specified,staffId,tel,name,age,principal,meetTime,problemDescription,serviceType,address,price,memberId,serviceId,dateline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [specified,staffId,tel,name,age,principal,meetTime,problemDescription,serviceType,address,price,memberId,serviceId,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
module.exports.updateServiceMeet = function(specified,staffId,id,tel,name,age,principal,meetTime,problemDescription,serviceType,address,price,memberId,serviceId, cb) {

    var sql = 'UPDATE   serviceMeet SET specified=? staffId=?, tel  =  ? ,  name  =  ? , meetTime  =  ? , age  =  ? ,   principal  =  ? ,   problemDescription  =  ? ,   serviceType  =  ? ,   address  =  ? ,   price  =  ? ,   memberId  =  ?  ,   serviceId  =  ? WHERE  id  =  ?  ';
    db.query(sql, [specified,staffId,tel,name,meetTime,age,principal,problemDescription,serviceType,address,price,memberId,serviceId,id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
/**
 * 添加教室
 * @param tel
 * @param name
 * @param meetTime
 * @param status
 * @param currentPage
 * @param cb
 */
module.exports.fetchAllServiceMeet = function(tel,name,meetTime,status,currentPage,cb) {

    var myDate = new Date();
    var parm = "where sm.tel like '%" + tel + "%' and sm.name like '%" + name+ "%'" +
        " and sm.meetTime like '%" + meetTime + "%'" +
        " and sm.serviceId = s.id " ;

    if(status!="")
    {
        parm+=" and sm.status = " + status ;
    }
    var sql_count = 'SELECT count(*) as count FROM serviceMeet sm ,service s '+parm;
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = "SELECT sm.*,s.name as 'serviceName',s.price as 'servicePrice',(select s.name from staff s where s.id = sm.staffId) as staffName FROM serviceMeet sm ,service s "+parm+"  ORDER BY sm.dateline DESC   LIMIT ?,?";

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
};
/**
 * 回访和处理回访选择是用到的方法
 * @param tel
 * @param name
 * @param meetTime
 * @param status
 * @param currentPage
 * @param cb
 */
module.exports.getByStatuServiceMeet = function(tel,name,meetTime,status,currentPage,cb) {

    var myDate = new Date();
    var parm = "where tel like '%" + tel + "%' and name like '%" + name
        + "%' and meetTime like '%" + meetTime + "%'" ;

    if(status!="")
    {
        parm+=" and status >= " + status ;
    }
    var sql_count = 'SELECT count(*) as count FROM serviceMeet '+parm;
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT * FROM serviceMeet '+parm+'  ORDER BY  dateline DESC   LIMIT ?,?';

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
};
/**
 * 删除教室
 * @param id
 * @param cb
 */
module.exports.delServiceMeet= function (id, cb) {

    var sql = 'DELETE FROM serviceMeet WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.fetchSingleServiceMeet =function (id, cb) {
    var sql = 'SELECT a.*,b.id as serviceId,b.name AS serviceName FROM serviceMeet a,service b WHERE a.serviceId=b.id  and a.id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
/**
 * 获取前三条预约数据根据会员id 或者 姓名和电话
 * @param id
 * @param cb
 */
module.exports.getTop3ServiceMeet =function (memberId,name,tel, cb) {

    var parm ="";

    if(memberId !=null && memberId !="")
    {
        parm=   " and  memberId='" + memberId + "'" ;
    }
    else
    {
        parm=   " and tel='" + tel + "' and name ='" + name + "'" ;
    }
    parm+=" order by dateline limit 0,3";
    var sql = 'SELECT a.*,b.`name` AS serviceName FROM serviceMeet a,service b WHERE a.serviceId=b.id  '+parm ;
    db.query(sql, [],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
/**
 * 设置状态
 * @param id
 * @param status
 */
module.exports.setStatus = function (id, status, cb) {

    var sql = 'UPDATE serviceMeet  SET status = ? WHERE id = ?';
    db.query(sql, [status,id], function(cbData, err, rows, filelds) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });
}

