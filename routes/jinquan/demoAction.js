/**
 * Created by kuanchang on 16/2/21.
 */
/**
 * 跳转到demo展示代码
 * @param req
 * @param res
 */

var handle_db = require('../../common/db');
var async = require('async');


module.exports.layui = function (req, res,next) {

    /**
     * 手动关闭数据库实例 开始
     */

    //var insert_sql = 'INSERT INTO demoTable(file1,file2) VALUES(?,?)';
    //
    //var conn = handle_db.db_conn();
    //var arr = new Array();
    //for(var i=0;i<1000;i++) {
    //    arr.push(i);
    //}
    //console.log(arr.length);
    //async.map(arr, function(item, callback) {
    //    conn.query(insert_sql,[1,2],function(err,results) {
    //
    //        if (!err) {
    //            callback(null, results);
    //        } else {  // 有记录
    //            handle_db.close(conn);
    //            callback(err);
    //        }
    //    });
    //
    //}, function(err,results) {
    //    console.log('over');
    //    handle_db.close(conn);
    //});

    /**
     * 手动关闭数据库实例 结束
     */
     res.locals.user = req.session.user;
    res.render('demo/layuiDemo');
}