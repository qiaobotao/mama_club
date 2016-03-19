/**
 * Created by Administrator on 2016/1/31.
 */
/**
 * Created by qiaojoe on 16-1-2.
 * 教室管理
 */


var db = require('../../common/db');
var async = require('async');

module.exports.insertActivityManage = function(proIds,courseIds,memberIds,serviceIds,activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,describe,status, cb) {

    var sql = 'INSERT INTO activityManage(proIds,courseIds,memberIds,serviceIds,activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,`describe`,`status`) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [proIds,courseIds,memberIds,serviceIds,activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,describe,status], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.insertActivityMX = function (mid,arr_obj,cb) {

        if (arr_obj.length == 0) {
            return;
        }

        var sql = 'INSERT INTO activityManageMX (activityId,totalCount,usedCount,activityDynamics,dateLine) VALUES (?,?,?,?,?)';
        async.map(arr_obj, function(item, callback) {

            db.query(sql, [mid, item.totalCount,item.usedCount,item.activityDynamics,new Date().getTime()], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null, rows);
                } else {
                    callback(err);
                }
            });
        }, function(err,results) {
            cb(err, results);
        });
}

module.exports.updateActivityManage = function(id,activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,describe,status,proIds,courseIds,memberIds,serviceIds,cb) {

    var sql = 'UPDATE activityManage set activityName=?,activityType=?,memberCardType=?,effectiveTimeStart=?,effectiveTimeEnd=?,`describe`=?,`status`=?,proIds=?,courseIds=?,memberIds=?,serviceIds=? where id=?';
    db.query(sql, [activityName,activityType,memberCardType,effectiveTimeStart,effectiveTimeEnd,describe,status,proIds,courseIds,memberIds,serviceIds,id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
module.exports.fetchAllActivityManage = function(activityName,activityType,effectiveTimeStart,effectiveTimeEnd,status,currentPage,cb) {

    var parm = 'WHERE 1=1';
    if (activityName != '')
        parm += " and" +
            " activityName like '%" + activityName + "%'";
    if (activityType != '')
        parm += " and activityType = '" + activityType + "'";
    if (effectiveTimeStart != '')
        parm += " and effectiveTimeStart >= '" + effectiveTimeStart + "'";
    if (effectiveTimeEnd != '')
        parm += " and effectiveTimeEnd <= '" + effectiveTimeEnd + "'";
    if (status != '')
        parm += " and status = '" + status + "'";

    var sql_count = 'SELECT count(*) as count FROM activityManage';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = "SELECT id,activityName,activityType,memberCardType,CONCAT(effectiveTimeStart,'~',effectiveTimeEnd) AS effectiveTime,`describe`,`status` FROM activityManage "+ parm +' LIMIT ?,?';

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
module.exports.fetchSingleActivityManage =function (id, cb) {

    var sql = 'SELECT * FROM activityManage WHERE id = ?';
    var detail_sql = 'SELECT * FROM activityManageMX Where activityId = ?';
    var proIds_sql ="select * from wares where 1=1";
    var courseIds_sql ="SELECT a.*,b.teacherName FROM course a ,courseTeacher b WHERE a.id=b.courseId";
    var memberIds_sql ="SELECT  id,memberName,tel FROM member where 1=1";
    var serviceIds_sql ="SELECT  id,name,content FROM  service  where 1=1";

    db.query(sql, [id], function (cbData, err, rows, fields) {

        if (!err) {
            if (rows.length != 0) {

                var activityManage = rows[0];
                db.query(detail_sql, [id], function (cbData, err, rows, fields) {

                    if (!err) {
                        var obj = {};
                        obj.activityManage = activityManage;
                        obj.activityManageMxs = rows;

                        var proIds =activityManage.proIds;
                        var courseIds =activityManage.courseIds;
                        var memberIds =activityManage.memberIds;
                        var serviceIds =activityManage.serviceIds;
                        if(proIds!='')
                        {
                            proIds_sql+=" and id in("+proIds+")";
                            db.query(proIds_sql, [], function (cbData, err, rows, fields) {
                                obj.pros=rows;
                                if(courseIds!='')
                                {
                                    courseIds_sql+=" and a.id in("+courseIds+")";
                                    db.query(courseIds_sql, [], function (cbData, err, rows, fields) {
                                        obj.courses = rows;
                                        if(memberIds!='')
                                        {
                                            memberIds_sql+=" and id in("+memberIds+")";
                                            db.query(memberIds_sql, [], function (cbData, err, rows, fields) {
                                                obj.members = rows;
                                                if(serviceIds!='')
                                                {
                                                    serviceIds_sql+=" and id in("+serviceIds+")";
                                                    db.query(serviceIds_sql, [], function (cbData, err, rows, fields) {
                                                        obj.services = rows;
                                                        cb(null, obj);
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }

                    } else {
                        cb(err);
                    }
                });
            } else { // 主表没有，直接返回空对象
                cb(null, {});
            }
        } else {
            cb(err);
        }
    });
}
module.exports.delActivityManage= function (id, cb) {

    var sql = 'DELETE FROM activityManage WHERE id = ?';
    db.query(sql, [id], function (err, results) {
        console.error(new Error('删除活动表信息'));
    });
}
/**根据主表id删除
 **/
module.exports.delActivityManageMX= function (mid, cb) {

    var sql = 'DELETE FROM activityManageMX WHERE activityId= ?';
    db.query(sql, [mid], function (err, results) {
        console.error(new Error('删除活动明细表信息'));
    });
}