/**
 * Created by Administrator on 2016/1/31.
 */

var db = require('../../common/db');
var async = require('async');

module.exports.insertClassMeet = function(shopId,memberId,courseId,childMonths,externPersons,weatherLeadBaby,remark,
                                          isRegisterSuccess,isPhoneConfirm,isSmConfirm,courseConfirm,ReasonForNotCome, cb) {

    var sql = 'INSERT INTO classMeet (shopId,dateline,memberId,courseId,childMonths,externPersons,weatherLeadBaby,remark,isRegisterSuccess,isPhoneConfirm,isSmConfirm,courseConfirm,ReasonForNotCome) '
        + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [shopId,new Date().getTime(),memberId,courseId,childMonths,externPersons,weatherLeadBaby,remark,
        isRegisterSuccess,isPhoneConfirm,isSmConfirm,courseConfirm,ReasonForNotCome], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.updateClassMeet = function(id,memberId,courseId,childMonths,externPersons,weatherLeadBaby,remark,
                                          isRegisterSuccess,isPhoneConfirm,isSmConfirm,courseConfirm,ReasonForNotCome, cb) {

    var sql = 'UPDATE classMeet set memberId=?,courseId=?,childMonths=?,externPersons=?,weatherLeadBaby=?,remark=?,isRegisterSuccess=?'
        + ' ,isPhoneConfirm=?,isSmConfirm=?,courseConfirm=?,ReasonForNotCome=? where id=?';
    db.query(sql, [memberId,courseId,childMonths,externPersons,weatherLeadBaby,remark,
        isRegisterSuccess,isPhoneConfirm,isSmConfirm,courseConfirm,ReasonForNotCome, id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.fetchAllClassMeet = function(shopId,memberName,courseName,courseTimeStart,currentPage,cb) {

    var parm = " on (a.memberId=b.id and a.courseId=c.id and a.courseId=d.courseId  AND f.id=d.teacherId)"
    parm += " where  b.memberName like '%" + memberName + "%'";
    parm += " and c.name like '%" + courseName + "%'";
    parm += " and c.courseDate like '%" + courseTimeStart + "%'";
    if(shopId!=''){
        parm += " and a.shopId='" + shopId + "'";
    }

    var sql_count = 'SELECT count(1) as  count FROM classMeet a inner join member b inner join course c inner join courseTeacher d  INNER JOIN staff f '+ parm +' ORDER BY a.dateline DESC ';

    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT a.id,a.memberId,a.courseId,b.memberName,b.tel,c.courseDate,c.courseTimeStart,c.courseTimeEnd,c.name `courseName`,f.name as teacherName,a.courseConfirm,c.price  FROM classMeet a inner join member b inner join course c inner join courseTeacher d   INNER JOIN staff f '+ parm +' ORDER BY a.dateline DESC LIMIT ?,?';

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

module.exports.fetchSingleClassMeet =function (id, cb) {

    var sql = 'SELECT a.*,b.memberName,c.name as courseName,c.courseTimeStart,c.courseTimeEnd,c.price as coursePrice FROM classMeet a inner join member b inner join course c on(a.memberId=b.id and a.courseId=c.id) WHERE a.id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
module.exports.delClassMeet= function (id, cb) {

    var sql = 'DELETE FROM classMeet WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}


module.exports.check = function (courseId,cb) {

    var sqlCount = "SELECT COUNT(1) as count FROM  classMeet  a WHERE a.courseId=?";

    var sqlTotalCount = "SELECT memberCount FROM  course  a WHERE a.id=?";

    db.query(sqlCount, [courseId],  function(cbData, err, rows, fields) {

        if (!err) {
            if (rows.length != 0) {
                var count = rows[0].count;
                db.query(sqlTotalCount, [courseId], function (cbData, err, rows, fields) {
                    var totalCount = rows[0].memberCount;
                    var temp=totalCount-count;
                    cb(null, temp > 0 ? true : false);
                })

            } else {
                cb(null, false);
            }
        } else {
            cb(err);
        }
    });
}


module.exports.checkIsSelectCourse= function (memberId,courseId,cb) {

    var sql = 'select count(1) as count from classMeet WHERE memberId = ? and courseId=? and isRegisterSuccess=true';
    db.query(sql, [memberId,courseId], function(cbData, err, rows, fields) {
        if (!err) {
            var count = rows[0].count;
            cb(null,  count > 0 ? true : false);
        } else {
            cb(err);
        }
    });
}