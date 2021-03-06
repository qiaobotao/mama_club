/**
 * Created by Administrator on 2016/1/31.
 */

var db = require('../../common/db');
var async = require('async');
var consts = require('../../model/utils/consts');
var utils = require('../../common/utils');
var myUtils = require('../../common/utils');


module.exports.selectAllCourse = function(currentPage,cb) {

    var parm = ' on (a.classroomId=b.id)';
    var sql_count = 'SELECT count(*) as count FROM course';
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = "SELECT a.id,a.name,a.classroomId,a.courseDate,a.courseTimeStart,a.courseTimeEnd ,a.courseType,"
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

    var thisTime = utils.date2str(new Date(),"yyyy-MM-dd");
    var parm = ' where  a.classroomId=b.id ';
    parm += " and str_to_date(a.courseDate,'%Y-%m-%d') >= str_to_date('"+thisTime+"','%Y-%m-%d') ";
    if(courseType!='')
    {
        parm+='  and  a.courseType ='+courseType ;
    }
    if(courseIds!='')
    {
        parm+= ' and a.id in('+courseIds+')';
    }
    var sql_count = 'SELECT count(*) as count FROM course a ,classroom b '+ parm;

    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    //var sql_data = "SELECT a.id,a.name,a.classroomId,a.courseDate,a.courseTimeStart,a.courseTimeEnd,concat(a.courseTimeStart,'~',a.courseTimeEnd) as courseTime,a.courseType,"
    var sql_data = "SELECT a.id,a.name,a.classroomId,a.courseDate,a.courseTimeStart,a.courseTimeEnd,a.courseType,"
        +' a.content,a.memberCount,a.price, b.name as classroomName, ' +
        '(' +
        '   select GROUP_CONCAT(f.name) from staff f,courseTeacher c  where f.id = c.teacherId and c.courseId=a.id ' +
        ') as teacherName ' +
        ' FROM course a ,classroom b '+ parm +' LIMIT ?,?';

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
        var dataArr = results.data;
        for(var i = 0 ; i< dataArr.length ; i ++){
            var dataObj = dataArr[i];
            dataObj.courseTimeStart = consts.COURSE_DATE[dataObj.courseTimeStart];
            dataObj.courseTimeEnd = consts.COURSE_DATE[dataObj.courseTimeEnd];
            dataObj.courseTime = dataObj.courseTimeStart +"~"+ dataObj.courseTimeEnd;
        }
        if (!err) {
            cb (null, results);
        } else {
            cb(err);
        }
    });
};

/**
 * 课程查询，分页显示
 * @param classroomId
 * @param courseType
 * @param date
 * @param currentPage
 * @param cb
 */
module.exports.getCourseList = function (shopId,classroom,courseType,date,dateEnd,currentPage,cb) {

    var par = "WHERE r.name LIKE '%"+classroom+"%' ";
    if (courseType != '') {
        par = par + ' AND courseType='+courseType;
    }

    if (date != '') {
        par = par + " AND courseDate >= '"+date+"'";
    }

    if (dateEnd != '') {
        par = par + "AND courseDate <= '"+dateEnd+"'";
    }

    par = par + ' AND r.shopId = '+ shopId;

    var sql_count = 'SELECT count(*) as count FROM course c, classroom r '+par+' AND c.classroomId = r.id  ORDER BY c.dateline DESC';

    var start = (currentPage - 1) * 10;
    var end = 10;

    var sql_data = 'SELECT c.id, c.name AS courseName, c.courseType, c.courseDate, r.name AS classroomName FROM course c, classroom r '+par+' AND c.classroomId = r.id ORDER BY c.dateline DESC LIMIT ?,?';

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


module.exports.insertCourse_neixun = function (name,classroomid,courseDate,startTime,endTime,courseType,scorse,content,arr_staff,teacher,cb) {

    myUtils.printSystemLog('增加内训：'+name+'_'+classroomid+'_'+courseDate+'_'+startTime+'_'+endTime+'_'+courseType+'_'+scorse+'_'+content+'_'+arr_staff);

    var insert_sql = "INSERT INTO course (name,classroomId,courseDate,courseTimeStart,courseTimeEnd,courseType,scorse,content,dateline) VALUES (?,?,?,?,?,?,?,?,?)";

    db.query(insert_sql,[name,classroomid,courseDate,startTime,endTime,courseType,scorse,content,new Date().getTime()],function(cbData, err, rows, fields) {

        if (!err) {

            var insertid = rows.insertId;
            var insert_teacher = 'INSERT INTO courseTeacher (courseId,teacherId) VALUES (?,?)';
            var insert_user = 'INSERT INTO courseUser(courseId,userId) VALUES(?,?)';
            var insert_staffTran = 'INSERT INTO staffTrain(courseId,staffId,dateline,status) VALUES (?,?,?,?)';
            db.query(insert_teacher,[insertid,teacher],function(cbData, err, rows, fields){
                if(!err) {
                    async.map(arr_staff, function(item, callback) {

                        db.query(insert_user, [insertid,item.staffId], function (cbData, err, rows, fields) {
                            if (!err) {
                                callback(null, rows);
                            } else {
                                callback(err);
                            }
                        });
                    }, function(err,results) {
                         if(!err) {
                             async.map(arr_staff, function(item, callback) {

                                 db.query(insert_staffTran, [insertid,item.staffId,new Date().getTime(),'N'], function (cbData, err, rows, fields) {
                                     if (!err) {
                                         callback(null, rows);
                                     } else {
                                         callback(err);
                                     }
                                 });
                             }, function(err,results) {
                                 cb(err, results);
                             });
                         } else {
                            cb(err);
                         }
                    });
                } else {
                    cb(err);
                }
            });
        } else {
            cb(err);
        }
    });
}

module.exports.browse_neixun = function (courseId, cb) {

    var main_sql = 'SELECT * FROM course WHERE id = ?';
    var sql_staff = 'SELECT s.id AS userId, s.name,s.staffLevel,s.tel,email FROM courseUser c,staff s WHERE c.userId = s.id AND  c.courseId = ?';
    var sql_teacher = 'SELECT s.id AS teacherId, s.name FROM courseTeacher c,staff s WHERE c.teacherId = s.id AND  c.courseId = ?';

    db.query(main_sql,[courseId],function (cbData, err, rows, fields) {

        if (!err) {

            if (rows.length != 0){
                var obj = {};
                var course = rows[0];
                obj.course = course;
                db.query(sql_staff,[courseId],function(cbData, err, rows, fields) {

                    if (!err) {
                        var users = rows;
                        obj.users = users;
                        db.query(sql_teacher,[courseId],function(cbData, err, rows, fields) {
                             if (!err) {
                                 if (rows.length != 0) {
                                     obj.teacher = rows[0].name;
                                     obj.teacherId = rows[0].teacherId;
                                 } else {
                                     obj.teacher = '';
                                 }
                                 cb(null,obj);
                             } else {
                                 cb(err);
                             }
                        });
                    } else {
                        cb(err);
                    }
                });
            } else {
                cb(null,{});
            }
        }else {
            cb(err);
        }

    });

}

module.exports.insertCourse_zhuanye = function (name,classroomid,courseDate,startTime,endTime,courseType,score,content,arr_teacher,cb) {
    myUtils.printSystemLog('增加专业：'+name+'_'+classroomid+'_'+courseDate+'_'+startTime+'_'+endTime+'_'+courseType+'_'+score+'_'+content+'_'+arr_teacher);

    var insert_sql = 'INSERT INTO course(name,classroomId,courseDate,courseTimeStart,courseTimeEnd,courseType,scorse,content) VALUES (?,?,?,?,?,?,?,?)';
    db.query(insert_sql,[name,classroomid,courseDate,startTime,endTime,courseType,score,content],function(cbData, err, rows, fields) {

        if (!err) {

            var insertid = rows.insertId;
            var insert_teacher = 'INSERT INTO courseTeacher(courseId,teacherId,type,startTime,endTime,content) VALUES(?,?,?,?,?,?)';
            async.map(arr_teacher, function(item, callback) {

                db.query(insert_teacher, [insertid,item.staffId,item.func,item.teacStartTime,item.teacEndTime,item.courseContent], function (cbData, err, rows, fields) {
                    if (!err) {
                        callback(null, rows);
                    } else {
                        callback(err);
                    }
                });
            }, function(err,results) {
                cb(err, results);
            });

        } else {
            console.log(err);
            cb(err);
        }

    });
}

module.exports.browse_zhuanye = function (courseId,cb) {

    var main_sql = 'SELECT * FROM course WHERE id = ?';
    var sql = 'SELECT s.id AS  userId,s.name,c.type,c.startTime,c.endTime,c.content FROM courseTeacher c,staff s  WHERE courseId = ? AND s.id=c.teacherId';

    db.query(main_sql,[courseId],function (cbData, err, rows, fields) {

        if (!err) {

            if (rows.length != 0){
                var obj = {};
                var course = rows[0];
                obj.course = course;
                db.query(sql,[courseId],function(cbData, err, rows, fields) {

                    if (!err) {
                        var teachers = rows;
                        obj.teachers = teachers;
                        cb(null,obj);
                    } else {
                        cb(err);
                    }
                });
            } else {
                cb(null,{});
            }
        }else {
            cb(err);
        }
    });
}

module.exports.insertCourse_fumu = function(classroomId,courseDate,startTime,endTime,courseType,count,price,content,arr_fumu,cb) {

    myUtils.printSystemLog('增加父母：'+classroomId+'_'+courseDate+'_'+startTime+'_'+endTime+'_'+courseType+'_'+content+'_'+arr_fumu);

    var insert_sql = 'INSERT INTO course(classroomId,courseDate,courseTimeStart,courseTimeEnd,courseType,memberCount,price,content) VALUES (?,?,?,?,?,?,?,?)';
    db.query(insert_sql,[classroomId,courseDate,startTime,endTime,courseType,count,price,content],function(cbData, err, rows, fields) {

        if (!err) {

            var insertid = rows.insertId;
            var insert_teacher = 'INSERT INTO courseTeacher(courseId,teacherId,type,startTime,endTime,content) VALUES(?,?,?,?,?,?)';
            async.map(arr_fumu, function(item, callback) {

                db.query(insert_teacher, [insertid,item.staffId,item.func,item.teacStartTime,item.teacEndTime,item.courseContent], function (cbData, err, rows, fields) {
                    if (!err) {
                        callback(null, rows);
                    } else {
                        callback(err);
                    }
                });
            }, function(err,results) {
                cb(err, results);
            });

        } else {
            cb(err);
        }

    });
}

module.exports.browse_fumu = function (courseId,cb) {

    var main_sql = 'SELECT * FROM course WHERE id = ?';
    var sql = 'SELECT s.id AS userId, s.name,c.type,c.startTime,c.endTime,c.content FROM courseTeacher c,staff s  WHERE courseId = ? AND s.id=c.teacherId';

    db.query(main_sql,[courseId],function (cbData, err, rows, fields) {

        if (!err) {

            if (rows.length != 0){
                var obj = {};
                var course = rows[0];
                obj.course = course;
                db.query(sql,[courseId],function(cbData, err, rows, fields) {

                    if (!err) {
                        var teachers = rows;
                        obj.teachers = teachers;
                        cb(null,obj);
                    } else {
                        cb(err);
                    }
                });
            } else {
                cb(null,{});
            }
        }else {
            cb(err);
        }
    });
}

module.exports.insertCourse_huiyi = function(classroomId,courseDate,startTime,endTime,courseType,content,arr_huiyi,cb) {

    myUtils.printSystemLog('增加会议：'+classroomId+'_'+courseDate+'_'+startTime+'_'+endTime+'_'+courseType+'_'+content+'_'+arr_huiyi);

    var insert_sql = 'INSERT INTO course(classroomId,courseDate,courseTimeStart,courseTimeEnd,courseType,content) VALUES (?,?,?,?,?,?)';
    db.query(insert_sql,[classroomId,courseDate,startTime,endTime,courseType,content],function(cbData, err, rows, fields) {

        if (!err) {

            var insertid = rows.insertId;
            var insert_user = 'INSERT INTO courseUser(courseId,userId) VALUES(?,?)';
            async.map(arr_huiyi, function(item, callback) {

                db.query(insert_user, [insertid,item.staffId], function (cbData, err, rows, fields) {
                    if (!err) {
                        callback(null, rows);
                    } else {
                        callback(err);
                    }
                });
            }, function(err,results) {
                cb(err, results);
            });

        } else {
            cb(err);
        }

    });
}

module.exports.browse_huiyi = function (courseId, cb) {

    var main_sql = 'SELECT * FROM course WHERE id = ?';
    var sql = 'SELECT s.id AS userId, s.name,s.staffLevel,s.tel,email FROM courseUser c,staff s WHERE c.userId = s.id AND  c.courseId = ?';

    db.query(main_sql,[courseId],function (cbData, err, rows, fields) {

        if (!err) {

            if (rows.length != 0){
                var obj = {};
                var course = rows[0];
                obj.course = course;
                db.query(sql,[courseId],function(cbData, err, rows, fields) {

                    if (!err) {
                        var users = rows;
                        obj.users = users;
                        cb(null,obj);
                    } else {
                        cb(err);
                    }
                });
            } else {
                cb(null,{});
            }
        }else {
            cb(err);
        }

    });

}

module.exports.editCourse_huiyi = function (courseId,startTime,endTime,content,arr_huiyi,cb) {

    myUtils.printSystemLog('编辑会议：'+courseId+'_'+startTime+'_'+endTime+'_'+content+'_'+arr_huiyi);

    var update_sql = 'UPDATE course SET courseTimeStart=?,courseTimeEnd=?,content=? WHERE id= ?';

    db.query(update_sql, [startTime,endTime,content,courseId], function (cbData, err, rows, fields) {

        if (!err) {
            var del_sql = 'DELETE FROM courseUser WHERE courseId = ?';
            var insert_user = 'INSERT INTO courseUser(courseId,userId) VALUES(?,?)';
            db.query(del_sql,[courseId], function(cbData, err, rows, fields) {

                if (!err) {

                    async.map(arr_huiyi, function(item, callback) {

                        db.query(insert_user, [courseId,item.staffId], function (cbData, err, rows, fields) {
                            if (!err) {
                                callback(null, rows);
                            } else {
                                callback(err);
                            }
                        });
                    }, function(err,results) {
                        cb(err, results);
                    });

                } else {
                    cb(err);
                }
            });


        } else {
            cb(err);
        }

    });


}

module.exports.editCourse_fumu = function (courseId,count,price,startTime,endTime,content,arr_fumu,cb) {

    myUtils.printSystemLog('编辑父母：'+courseId+'_'+startTime+'_'+endTime+'_'+content+'_'+arr_fumu);

    var update_sql = 'UPDATE course SET courseTimeStart=?,courseTimeEnd=?,memberCount=?,price=?,content=? WHERE id=?';
    db.query(update_sql, [startTime,endTime,count,price,content,courseId], function (cbData, err, rows, fields) {

        if (!err) {
            var del_sql = 'DELETE FROM courseTeacher WHERE courseId = ?';
            var insert_teacher = 'INSERT INTO courseTeacher(courseId,teacherId,type,startTime,endTime,content) VALUES(?,?,?,?,?,?)';
            db.query(del_sql,[courseId], function(cbData, err, rows, fields) {

                if (!err) {

                    async.map(arr_fumu, function(item, callback) {

                        db.query(insert_teacher, [courseId,item.staffId,item.func,item.teacStartTime,item.teacEndTime,item.courseContent], function (cbData, err, rows, fields) {
                            if (!err) {
                                callback(null, rows);
                            } else {
                                callback(err);
                            }
                        });
                    }, function(err,results) {
                        cb(err, results);
                    });

                } else {
                    cb(err);
                }
            });


        } else {
            cb(err);
        }

    });

}

module.exports.editCourse_zhuanye = function (courseId,course,startTime,endTime,score,content,arr,cb) {

    myUtils.printSystemLog('编辑专业：'+courseId+'_'+startTime+'_'+endTime+'_'+content+'_'+arr);

    var update_sql = 'UPDATE course SET name=?,courseTimeStart=?,courseTimeEnd=?,content=? WHERE id= ?';
    db.query(update_sql, [course,startTime,endTime,content,courseId], function(cbData, err, rows, fields) {

        if (!err) {
            var del_sql = 'DELETE FROM courseTeacher WHERE courseId = ?';
            var insert_teacher = 'INSERT INTO courseTeacher(courseId,teacherId,type,startTime,endTime,content) VALUES(?,?,?,?,?,?)';

            db.query(del_sql,[courseId], function(cbData, err, rows, fields) {

                if (!err) {
                    console.log('删除教师表成功'+courseId);
                    async.map(arr, function(item, callback) {

                        db.query(insert_teacher, [courseId,item.staffId,item.func,item.teacStartTime,item.teacEndTime,item.courseContent], function (cbData, err, rows, fields) {
                            if (!err) {
                                callback(null, rows);
                            } else {
                                callback(err);
                            }
                        });
                    }, function(err,results) {
                        cb(err, results);
                    });

                } else {
                    console.log(err);
                    cb(err);
                }
            });
        } else {
            console.log(err);
            cb(err);
        }

    });
}

module.exports.editCourse_neixun = function (courseId,name,startTime,endTime,scorse,content,arr_staff,teacherid,cb) {

    myUtils.printSystemLog('编辑专业：'+courseId+'_'+startTime+'_'+endTime+'_'+content+'_'+arr_staff);

    var update_sql = 'UPDATE course SET name = ?,courseTimeStart=?,courseTimeEnd=?,scorse=?,content=? WHERE id = ?';
    db.query(update_sql, [name,startTime,endTime,scorse,content,courseId], function (cbData, err, rows, fields) {

        if (!err) {
            var del_sql = 'DELETE FROM courseUser WHERE courseId = ?';
            var insert_sql = 'INSERT INTO courseUser(courseId,userId) VALUES(?,?)';
            // 还需要向staffTrain插入数据
            var del_staffTran = 'DELETE FROM staffTrain WHERE courseId = ?';
            var insert_staffTran = 'INSERT INTO staffTrain(courseId,staffId,dateline,status) VALUES (?,?,?,?)';
            // 教师表
            var del_SQL = 'DELETE FROM courseTeacher WHERE courseId = ?';
            var insert_SQL = 'INSERT INTO courseTeacher (courseId, teacherId) VALUES (?,?)';

            db.query(del_SQL, [courseId], function(cbData, err, rows, fields) {

                if (!err) {

                    db.query(insert_SQL, [courseId,teacherid], function (cbData, err, rows, fields) {

                        if (!err) {

                            db.query(del_sql,[courseId], function(cbData, err, rows, fields) {

                                if (!err) {
                                    async.map(arr_staff, function(item, callback) {

                                        db.query(insert_sql, [courseId,item.staffId], function (cbData, err, rows, fields) {
                                            if (!err) {
                                                callback(null, rows);
                                            } else {
                                                console.log(err);
                                                callback(err);
                                            }
                                        });
                                    }, function(err,results) {

                                        if(!err) {
                                            db.query(del_staffTran,[courseId],function(cbData, err, rows, fields) {

                                                if (!err) {

                                                    async.map(arr_staff, function(item, callback) {

                                                        db.query(insert_staffTran, [courseId,item.staffId,new Date().getTime(),'N'], function (cbData, err, rows, fields) {
                                                            if (!err) {
                                                                callback(null, rows);
                                                            } else {
                                                                console.log(err);
                                                                callback(err);
                                                            }
                                                        });
                                                    }, function(err,results) {
                                                        cb(err, results);
                                                    });
                                                } else {
                                                    console.log(err);
                                                    cb(err);
                                                }
                                            });
                                        } else {
                                            console.log(err);
                                            cb(err);
                                        }
                                    });
                                } else {
                                    console.log(err);
                                    cb(err);
                                }
                            });


                        } else {
                            console.log(err);
                           cb(err);
                        }
                    });
                } else {
                    console.log(err);
                    cb(err);
                }
            });


        } else {
            console.log(err);
            cb(err);
        }
    });
}


module.exports.getPlan = function (classroomId,courseDate,cb) {

    var sql = 'SELECT courseType,courseTimeStart,courseTimeEnd FROM course WHERE classroomId =? AND courseDate = ?';

    db.query(sql,[classroomId,courseDate],function(cbData, err, rows, fields) {

        if (!err) {

            cb(null,rows);
        } else {
           cb(err);
        }
    });
}

module.exports.delCourse = function (courseId,type,cb) {

    myUtils.printSystemLog('删除课程：'+courseId);

    // 删除课表，先删除主表，然后从表每个表都删除一次
    var del = 'DELETE FROM course WHERE id = ?';
    var del_u = 'DELETE FROM courseUser WHERE couresId = ?';
    var del_t = 'DELETE FROM courseTeacher WHERE courseId = ?';
    var del_train = 'DELETE FROM staffTrain WHERE courseId = ?';

    /**四种会议过了时间都不能删除，但是父母课如果有预约的人员了 就不能删除了**/
    var cb_type = 0;

    var get_course = 'SELECT * FROM course WHERE id = ?';
    db.query(get_course, [courseId],function (cbData, err, rows, fields) {

        if (!err) {

            if (rows.length != 0) {

                var date = rows[0].courseDate;
                var pre_date = date.replace(/-/g,'/');
                var stmt_date = new Date(pre_date).getTime(); // 课程时间时间戳
                var now_date = new Date().getTime(); // 当前时间时间戳
                if (now_date >= stmt_date) { // 当前时间大于课程时间 ，不能删除课程
                    cb_type = 1; // 时间过期，不能删除
                    cb (null,cb_type);
                } else {
                    if (type != 3) { // 不是父母课，直接删除

                        db.query(del,[courseId], function(cbData, err, rows, fields) {

                            if (!err) {
                                db.query(del_u,[courseId],function(cbData, err, rows, fields){});
                                db.query(del_t,[courseId],function(cbData, err, rows, fields){});
                                db.query(del_train,[courseId],function(cbData, err, rows, fields){});
                                cb(null,cb_type);
                            } else {
                                cb(err);
                            }
                        });

                    } else { // 父母课，如果有人预约不能删除

                        var get_meet = 'SELECT  * FROM classMeet WHERE courseId = ?';

                        db.query(get_meet, [courseId], function(cbData, err, rows, fields) {

                            if (!err) {

                                if (rows.length != 0) {  // 有人预约，不能删除
                                    cb_type = 2;
                                    cb(null,cb_type);
                                } else {
                                    db.query(del,[courseId], function(cbData, err, rows, fields) {

                                        if (!err) {
                                            db.query(del_u,[courseId],function(cbData, err, rows, fields){});
                                            db.query(del_t,[courseId],function(cbData, err, rows, fields){});
                                            db.query(del_train,[courseId],function(cbData, err, rows, fields){});
                                            cb(null,cb_type);
                                        } else {
                                            cb(err);
                                        }
                                    });
                                }
                            } else {
                                cb(err);
                            }
                        });
                    }
                }

            } else {
                cb(null,cb_type);
            }
        } else {
            cb(err);
        }
    });
}
/**
 * 获取所在月第一天至下月最后一天的排课信息
 * @param cb
 */
module.exports.getCoursePlanList = function (shopId,cb) {

    var courseSql = 'SELECT a.id,a.courseDate,a.name,a.classroomId,a.courseTimeStart,a.courseTimeEnd,a.courseType ';
    courseSql += 'FROM course a inner join classroom b on (a.classroomId=b.id)';
    courseSql += 'where str_to_date(a.courseDate, "%Y-%m-%d") >= DATE_ADD(curdate(),interval -day(curdate())+1 day)';
    courseSql += 'and str_to_date(a.courseDate, "%Y-%m-%d") <= last_day(date_add(curdate(),interval 1 month))';
    var classRoomSql = 'SELECT * from classroom t where t.`status` = 1 AND t.shopId='+shopId;
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
            results.dataArr = getLateDays(30);
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
    date_temp.setDate(1);
    var date = new Date(date_temp);
    for (var i=0;i<par;i++) {
        date.setDate(date_temp.getDate()+i);
        var month = date.getMonth()+1;
        var day = date.getDate();
        if(date.getMonth()+1 < 10){
            month = "0"+(date.getMonth()+1);
        }
        if(date.getDate() < 10){
            day = "0"+(date.getDate());
        }
        var times = date.getFullYear()+"-"+month+"-"+day;
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

