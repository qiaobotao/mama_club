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



/**
 * 获取所在月第一天至下月最后一天的排课信息
 * @param cb
 */
module.exports.getCoursePlanList = function (cb) {

    var courseSql = 'SELECT a.id,a.courseDate,a.name,a.classroomId,a.courseTimeStart,a.courseTimeEnd,a.courseType ';
    courseSql += 'FROM course a inner join classroom b on (a.classroomId=b.id)';
    courseSql += 'where str_to_date(a.courseDate, "%Y-%m-%d") >= DATE_ADD(curdate(),interval -day(curdate())+1 day)';
    courseSql += 'and str_to_date(a.courseDate, "%Y-%m-%d") <= last_day(date_add(curdate(),interval 1 month))';
    var classRoomSql = 'SELECT * from classroom t where t.`status` = 1';
    async.series({
        courseData : function(callback){
            db.query(courseSql, [],function (cbData, err, rows, fields) {
                if (!err) {
                    callback (null, rows);
                } else {
                    callback(err);
                }
            });
        },
        classRoomData : function(callback){
            db.query(classRoomSql, [], function (cbData, err, rows, fields) {
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
 * 返回par后的日期
 * 返回格式 是数组 [2016-1-1,2016-1-2,...]
 * @param par
 */
function getLateDays (par) {

    var re = /^[0-9]*[1-9][0-9]*$/ ;
    if (!re.test(par)) {
        return [];
    }

    var arr_date = new Array();
    var date_temp = new Date();
    var date = new Date(date_temp);
    for (var i=1;i<par;i++) {
        date.setDate(date_temp.getDate()+i);
        var times = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        arr_date.push(times);
    }

    return arr_date;
}

/**
 * 返回sql中的数据串
 * 格式 ('2016-1-1','2016-1-1','2016-1-1')
 * @param arr
 */
function formatDatePar (arr) {

    if (arr.length == 0) {
        return ('()');
    }
    var temp = "(";
    for (var i=0;i<arr.length;i++) {
        if (i != arr.length - 1) {
            temp = temp +"'"+arr[i] + "',";
        } else {
            temp = temp +"'"+arr[i] + "')";
        }
    }
    return temp;
}

/**
 * 获取两个时间段之间 每30分钟的值
 * 返回数组 格式 [8:30,9:00,9:30,10:00]
 * @param startTime
 * @param endTime
 */
function getTime (startTime,endTime) {

    if(!compareTime(startTime,endTime)) {
        return [];
    }
    // endTime 是否 是半点 没关系，主要是 两个小时 之间
    var start_temp = startTime.split(':');
    var end_temp = endTime.split(':');

    var start = start_temp[0];
    var end = end_temp[0];
    var arr = new Array();
    if (start_temp[1] == '00') {
        arr.push(startTime);
    }
    while (end - start > 0 ) {
        var v = start + ':30';
        var vv = Number(start)+1 + ':00';
        arr.push(v);
        arr.push(vv);
        start = Number(start) + 1;
    }

    if (end_temp[1] == '30') {
        arr.push(endTime);
    }

    return arr;
}

/**
 * 比较两个时间段 哪个排在前边
 * 后边的比前面大返回true
 * @param startTime
 * @param endTime
 */
function compareTime (startTime, endTime) {

    var start_temp = startTime.split(':');
    var end_temp = endTime.split(':');

    var start_hour = +start_temp[0];
    var end_hour = +end_temp[0];
    var start_second = start_temp[1];
    var end_second = end_temp[1];
    if (end_hour>start_hour) {
        return true;
    } else if (end_hour == start_hour && end_second == '30' && start_second =='00') {
        return true;
    } else {
        return false;
    }
}

