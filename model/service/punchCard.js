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
    var end = currentPage * 10;
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
