/**
 * Created by qiaojoe on 16-3-19.
 */
var async = require('async');
var db = require('../../common/db');
/**
 * 分页获取所有服务
 * @param cb
 */
module.exports.list = function(name,date,currentPage,cb) {

    var parm = "WHERE name LIKE '%"+name+"%' ";

    if (date != '') {
        parm = parm + " AND date ="+date;
    }

    var sql_count = 'SELECT count(*) as count FROM punchCardRecord '+parm+'  ORDER BY date DESC';
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT * FROM punchCardRecord '+parm+' ORDER BY date DESC LIMIT ?,?';

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



module.exports.insertExcelData = function (arr, cb) {

    if (arr.length == 0) {
       return;
    }
    // 第一行是表头
    var arr_res = new Array();
    for (var i=1;i<arr.length;i++) {
        var obj = {};
        obj.department = arr[i][0];
        obj.name = arr[i][1];
        obj.recordNumber = arr[i][2];
        obj.date = arr[i][3];
        obj.macid = arr[i][4];
        obj.serialNumber = arr[i][5];
        obj.compareType = arr[i][6];
        obj.cardNumber = arr[i][7];
        arr_res.push(obj);
    }

    var conn = db.db_conn();
    var obj = {};
    var insertData = 0;
    var duplicateData = 0;
    var check_sql = 'SELECT * FROM punchCardRecord WHERE date = ? AND recordNumber = ?';

    var sql = 'INSERT INTO punchCardRecord (department,name,recordNumber,date,macid,serialNumber,compareType,cardNumber,shopId) VALUES (?,?,?,?,?,?,?,?,?)';

    async.map(arr_res, function(item, callback) {

        conn.query(check_sql,[item.date,item.recordNumber],function(err, results){
            if (err) {
                db.close(conn);
                callback(err);
            } else {
                if (results.length == 0) {
                    conn.query(sql, [item.department,item.name,item.recordNumber,item.date,item.macid,item.serialNumber,item.compareType,item.cardNumber,''], function (err, results) {
                        insertData = Number(insertData) + Number(1);
                        if(err) {
                            db.close(conn);
                            callback(err);
                        } else {
                            callback(null,results);
                        }
                    });
                } else {
                    duplicateData = Number(duplicateData) + Number(1);
                    callback(null,null);
                }
            }
        });
    }, function(err,results) {
        db.close(conn);
        obj.insertData = insertData;
        obj.duplicateData = duplicateData;
        cb(err, obj);
    });
}
