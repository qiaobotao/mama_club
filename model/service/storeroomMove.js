/**
 * Created by qiaojoe on 16-3-6.
 */

var db = require('../../common/db');
var async = require('async');
var moment = require('moment');
var mainInTypeClassifyId = require('../../config').mainClassifyId.inType;



module.exports.list = function (outId,oper,inId,moveDate,currentPage,cb) {

    var parm = "WHERE s.oper LIKE '%"+oper+"%' ";

    if (outId != '') {
        parm = parm + " AND s.outStoreroomId ="+outId;
    }

    if (inId != '') {
        parm = parm + " AND s.inStoreroomId ="+inId;
    }

    if (moveDate != '') {
        parm = parm + " AND s.moveDate ="+moveDate;
    }

    var sql_count = 'SELECT count(*) as count FROM storeroomMoveLog s '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;

    var sql_data = 'SELECT s.*, r.name AS inStoreroomName, rr.name AS outStoreName FROM storeroomMoveLog AS s,  storeroom AS r, storeroom AS rr  '+parm+' AND  s.inStoreroomId = r.id AND s.outStoreroomId = rr.id ORDER BY dateline DESC LIMIT ?,?';
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
