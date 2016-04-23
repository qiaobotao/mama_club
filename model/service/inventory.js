/**
 * Created by qiaojoe on 16-3-13.
 */



var db = require('../../common/db');
var async = require('async');

module.exports.list = function (shopId,sid,currentPage,cb) {

    var sql = '';
    var count_sql = '';

    if (sid == '') {
        sql = 'SELECT sum(i.count) AS data_count, w.name AS waresName, w.serialNumber  FROM  inventory i, wares w, storeroom s WHERE s.id = i.storeroomId AND s.shopId = '+shopId+' AND i.waresId = w.id GROUP BY waresId LIMIT ?,?';
        count_sql = 'SELECT count(*) AS count FROM inventory i, wares w, storeroom s WHERE i.waresId = w.id AND s.id = i.storeroomId AND s.shopId = '+shopId+' GROUP BY waresId ';
    } else {
        sql = 'SELECT count AS data_count, w.name AS waresName,w.serialNumber  FROM  inventory i, wares w, storeroom s WHERE s.id = i.storeroomId AND s.shopId = '+shopId+' AND i.waresId = w.id AND i.storeroomId = '+sid + ' LIMIT ?,?';
        count_sql = 'SELECT count(*) AS count FROM  inventory i, wares w, storeroom s WHERE s.id = i.storeroomId AND s.shopId = '+shopId+' AND i.waresId = w.id AND i.storeroomId = '+sid;
    }

    var start = (currentPage - 1) * 10;
    var end = 10;

    async.series({
        totalPages : function(callback){
            db.query(count_sql, [], function (cbData, err, rows, fields) {

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
            db.query(sql, [start, end], function (cbData, err, rows, fields) {

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
