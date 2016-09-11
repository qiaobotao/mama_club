/**
 * Created by Administrator on 2016/1/31.
 */
/**
 * Created by qiaojoe on 16-1-2.
 * 教室管理
 */


var db = require('../../common/db');
var async = require('async');

var treatmentMethodId = require('../../config').mainClassifyId.treatmentMethod;//做过何种处理
var serverDemandId = require('../../config').mainClassifyId.serverDemand;//服务需求


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
module.exports.insertServiceMeet = function(shopId,memberId,name,tel,meetTime ,specialRemarks ,serviceType,province,city,town,address ,price ,serverShopId ,
                                            specified,recommendStaffId,recommendName,principal,staffId ,status,nursServiceId,serviceTime,deal,serviceNeeds,serviceStaffIds, serviceStaffNames,cb) {


    var sql = 'INSERT INTO serviceMeet (shopId,memberId,name,tel,meetTime ,specialRemarks ,serviceType,province,city,town,address ,price ,serverShopId ,'
        + 'specified,recommendStaffId,recommendName,principal,staffId ,status,nursServiceId,serviceTime,deal,serviceNeeds,serviceStaffIds, serviceStaffNames,dateline) ' +
        ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [shopId,memberId,name,tel,meetTime ,specialRemarks ,serviceType,province,city,town,address ,price ,serverShopId ,
        specified,recommendStaffId,recommendName,principal,staffId ,status,nursServiceId,serviceTime,deal,serviceNeeds,serviceStaffIds, serviceStaffNames,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
module.exports.updateServiceMeet = function(id,memberId,name,tel,meetTime,specialRemarks,serviceType,province,city,town,address,price,serverShopId,specified,principal,
                                            staffId,recommendStaffId,recommendName,status,nursServiceId,nursServiceNo,serviceTime,deal,serviceNeeds,serviceStaffIds,serviceStaffNames, cb) {

    var sql = 'UPDATE serviceMeet SET ' +
        ' memberId = ?,name = ?,tel = ?,meetTime = ?,specialRemarks = ?,serviceType = ?,province=?,city=?,town=?,address = ?,price = ?,serverShopId = ?,specified = ?,principal = ?,' +
        ' staffId = ?,recommendStaffId=?,recommendName=?,status = ?,nursServiceId = ?,nursServiceNo=?,serviceTime = ?,deal = ?,serviceNeeds = ?,serviceStaffIds = ?, serviceStaffNames = ?' +
        'WHERE  id  =  ?  ';
    db.query(sql, [memberId,name,tel,meetTime,specialRemarks,serviceType,province,city,town,address,price,serverShopId,specified,principal,
        staffId,recommendStaffId,recommendName,status,nursServiceId,nursServiceNo,serviceTime,deal,serviceNeeds,serviceStaffIds,serviceStaffNames,id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
/**
 * 查询预约单信息
 * @param tel
 * @param name
 * @param meetTime
 * @param status
 * @param currentPage
 * @param cb
 */
module.exports.fetchAllServiceMeet = function(shopId,tel,name,meetTime,status,currentPage,cb) {

    var myDate = new Date();
    var parm = "where sm.tel like '%" + tel + "%' and sm.name like '%" + name+ "%'" +
        " and sm.meetTime like '%" + meetTime + "%'";
    if(shopId!="")
    {
        parm+=" and sm.shopId = " + shopId ;
    }
    if(status!="")
    {
        if(status.indexOf(",")> -1 ){
            parm+=" and sm.status in (" + status +")";
        }else{
            parm+=" and sm.status = " + status ;
        }
    }
    var sql_count = 'SELECT count(*) as count FROM serviceMeet sm '+parm;
    var start = (currentPage - 1) * 10;
    var end = 10;
    /*
    var sql_data1 = "SELECT " +
        "sm.*,s.name as 'serviceName',s.content as 'serviceContent' , " +
        "s.price as 'servicePrice'," +
        "s.id as 'serviceId'," +
        "(" +
        "   select s.name from staff s where s.id = sm.staffId" +
        ") as staffName," +
        "(" +
        "select m.memberName from member m where m.id = sm.memberId " +
        ") as memberName FROM serviceMeet sm ,service s "+parm+"  ORDER BY sm.dateline DESC   LIMIT ?,?";
    */
    var sql_data = "SELECT " +
        "sm.*, " +
        "(" +
        "   select s.name from staff s where s.id = sm.staffId" +
        ") as staffName," +
        "(" +
        "select m.memberName from member m where m.id = sm.memberId " +
        ") as memberName FROM serviceMeet sm "+parm+"  ORDER BY sm.meetTime DESC   LIMIT ?,?";

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
module.exports.getByStatuServiceMeet = function(shopId,tel,name,meetTime,status,currentPage,cb) {

    var myDate = new Date();
    var parm = "where tel like '%" + tel + "%' and name like '%" + name
        + "%' and meetTime like '%" + meetTime + "%'" ;

    if(status!="")
    {
        parm+=" and status >= " + status ;
    }
    if(shopId!="")
    {
        parm+=" and shopId  = " + shopId ;
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

module.exports.fetchSingleServiceMeet =function (userId,id, cb) {
    var serviceMeetSql = 'SELECT a.* FROM serviceMeet a WHERE a.id = ?';

    var classificationPare = treatmentMethodId+","+ serverDemandId;
    var classificationSql = 'select * from systemClassify where parentId in ('+classificationPare+')';
    var shopsByUserIdSql = 'select s.* from shop s , sysUserShop us where s.id = us.shopId and us.userId = ?';

    async.series({
        //活动详情列表
        serviceMeetService : function(callback){
            db.query(serviceMeetSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //当前活动信息
        classificationData : function(callback){
            db.query(classificationSql, [], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //当前用户可以所可以查看的门店列表
        shopsByUserIdData : function(callback){
            db.query(shopsByUserIdSql, [userId], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        }
    },function(err, results) {

        if (!err) {

            //为字典表所需数据分别定义对象集合
            var treatmentMethodArr = new Array();
            var serverDemandArr = new Array();
            for(var i = 0 ; i < results.classificationData.length ; i ++){
                var classification = results.classificationData[i];
                if(treatmentMethodId == classification.parentId){
                    treatmentMethodArr.push(classification);
                }else if(serverDemandId == classification.parentId){
                    serverDemandArr.push(classification);
                }
            }
            results.treatmentMethodArr = treatmentMethodArr;
            results.serverDemandArr = serverDemandArr;
            cb (null, results);
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
module.exports.getTop3ServiceMeet =function (memberId, cb) {
//module.exports.getTop3ServiceMeet =function (memberId,name,tel, cb) {

    var parm ="";

    if(memberId !=null && memberId !="")
    {
        parm=   " and  memberId='" + memberId + "'" ;
    }
    parm+=" order by a.meetTime desc limit 0,3";
    var sql = 'SELECT a.*  FROM serviceMeet a WHERE 1=1 '+parm ;
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

