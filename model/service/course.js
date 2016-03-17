/**
 * Created by Administrator on 2016/1/31.
 */

var db = require('../../common/db');
var async = require('async');

module.exports.selectAllCourse = function(currentPage,cb) {

    var parm = ' on (a.classroomId=b.id)';
    var sql_count = 'SELECT count(*) as count FROM course';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = "SELECT a.id,a.name,a.classroomId,a.courseDate,concat(a.courseTimeStart,'~',a.courseTimeEnd) as courseTime,a.courseType,"
        +' a.content,a.memberCount,a.price, b.name as classroomName FROM course a inner join classroom b'+ parm +' LIMIT ?,?';

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


module.exports.selectCourseByType = function(currentPage,courseIds,courseType,cb) {

    var parm = ' where  a.classroomId=b.id  and c.courseId=a.id';
    if(courseType!='')
    {
        parm+='  and  a.courseType ='+courseType ;
    }
    if(courseIds!='')
    {
        parm+= ' and a.id in('+courseIds+')';
    }
    var sql_count = 'SELECT count(*) as count FROM course where courseType='+courseType;
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = "SELECT a.id,a.name,a.classroomId,a.courseDate,concat(a.courseTimeStart,'~',a.courseTimeEnd) as courseTime,a.courseType,"
        +' a.content,a.memberCount,a.price, b.name as classroomName, c.teacherName as teacherName FROM course a ,classroom b, courseTeacher c'+ parm +' LIMIT ?,?';

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
