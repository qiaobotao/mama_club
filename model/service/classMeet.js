/**
 * Created by Administrator on 2016/1/31.
 */

var db = require('../../common/db');
var async = require('async');

module.exports.insertClassMeet = function(memberId,courseId,childMonths,externPersons,weatherLeadBaby,remark,
                                          isRegisterSuccess,isPhoneConfirm,isSmConfirm,courseConfirm,ReasonForNotCome, cb) {

    var sql = 'INSERT INTO classMeet (memberId,courseId,childMonths,externPersons,weatherLeadBaby,remark,isRegisterSuccess,isPhoneConfirm,isSmConfirm,courseConfirm,ReasonForNotCome) '
        + ' VALUES (?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [memberId,courseId,childMonths,externPersons,weatherLeadBaby,remark,
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

module.exports.fetchAllClassMeet = function(memberName,courseName,courseTimeStart,currentPage,cb) {

    var parm = " on (a.memberId=b.id and a.courseId=c.id and a.courseId=d.courseId)"
    parm += " and b.memberName like '%" + memberName + "%'";
    parm += " and c.name like '%" + courseName + "%'";
    parm += " and c.courseTimeStart like '%" + courseTimeStart + "%'";

    var sql_count = 'SELECT count(*) as count FROM classMeet';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT a.id,a.memberId,a.courseId,b.memberName,b.tel,c.courseTimeStart,c.courseTimeEnd,d.teacherName,a.courseConfirm FROM classMeet a inner join member b inner join course c inner join courseTeacher d '+ parm +' LIMIT ?,?';

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

    var sql = 'SELECT a.*,b.memberName,c.name as courseName,c.courseTimeStart,c.price as coursePrice FROM classMeet a inner join member b inner join course c on(a.memberId=b.id and a.courseId=c.id) WHERE a.id = ?';
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

/**
 * 根据报名人数看好是否还可以报名
 * @param storeroomId
 * @param waresId
 * @param num
 * @param cb
 */
module.exports.check = function (courseId,cb) {
    //根据课程id查询已报名人数
    var sqlCount = 'SELECT COUNT(1) as count FROM  classMeet  a WHERE a.courseId=?';
    //根据课程id查询所在教室的人数
    var sqlTotalCount = 'SELECT memberCount FROM  course  a WHERE a.id=?';

    db.query(sqlCount, [courseId], function (cbData, err, rows, fields) {

        if (!err) {
            if (rows.length != 0) {
                var count = rows[0].count;
                db.query(sqlTotalCount, [courseId], function (cbData, err, rowdata, fields) {
                    var totalCount = rowdata[0].memberCount;
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