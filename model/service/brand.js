/**
 * Created by qiaojoe on 16/4/23.
 */

var db = require('../../common/db');
var async = require('async');

module.exports.getAllBrand = function (did,currentPage, cb) {

    var parm = '';
    if(did != '') {
        parm = " WHERE distributorId ="+did;
    }
    var sql_count = 'SELECT count(*) as count FROM brand ' + parm + ' ORDER BY id DESC';;
    var start = (currentPage - 1) * 10;
    var end = 10;

    var sql_data = '';
    if (did != '') {
        sql_data = 'SELECT d.id, d.name,dis.name AS dname FROM brand d, distributor dis '+parm+' AND d.distributorId = dis.id ORDER BY id DESC LIMIT ?,?';
    } else {
        sql_data = 'SELECT d.id, d.name,dis.name AS dname FROM brand d, distributor dis WHERE d.distributorId = dis.id ORDER BY id DESC LIMIT ?,?';
    }
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


module.exports.add = function(name,did,remarks,cb) {

    var sql = "INSERT INTO brand(name,distributorId,remarks)VALUES (?,?,?)";
    db.query(sql,[name,did,remarks],function(cbData, err, rows, fields) {

        if (!err) {
            cb(null,rows);
        } else {
            cb(err);
        }
    });
}

module.exports.checkName = function(name, cb) {

    var sql = 'SELECT * FROM brand WHERE name = ?';

    db.query(sql ,[name], function(cbData, err, rows, fields) {

        if (!err) {
            if (rows.length != 0) {
                cb(null,false);
            } else {
                cb(null,true);
            }
        } else {
            cb(err);
        }
    });
}

module.exports.browse = function(id, cb) {

    var sql = 'SELECT d.name, dis.name AS dname, d.remarks FROM brand d, distributor dis WHERE d.id = ? AND d.distributorId = dis.id';

    db.query(sql, [id], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null,rows);
        } else {
            cb(err);
        }
    });
}

module.exports.del = function(id, cb) {

    var sql = 'DELETE FROM brand WHERE id = ?';

    db.query(sql ,[id], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null,rows);
        } else {
            cb(err);
        }

    });

}

module.exports.preUpdate = function (id, cb) {

    var sql = 'SELECT * FROM brand WHERE id = ?';
    db.query(sql, [id], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null,rows);
        } else {
            cb(err);
        }
    });
}

module.exports.update = function (id, name, did, remarks, cb) {

    var sql = 'UPDATE brand SET name = ?, distributorId = ?, remarks = ? WHERE id = ?';

    db.query(sql, [name,did,remarks,id], function (cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });
}

module.exports.getAllBrands = function (cb) {

    var sql = "SELECT * FROM brand ORDER BY id desc";
    db.query(sql,[],function(cbData, err, rows, fields){

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

module.exports.checkDel = function(id,cb) {

    var sql = "SELECT * FROM wares WHERE brand = ?";

    db.query(sql ,[id], function(cbData, err, rows, fields) {

        if (!err) {
            if (rows.length != 0) {
                cb(null,false);
            } else {
                cb(null,true);
            }
        } else {
            cb(err);
        }
    });

}
