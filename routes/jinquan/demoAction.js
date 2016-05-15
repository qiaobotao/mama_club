/**
 * Created by kuanchang on 16/2/21.
 */
/**
 * 跳转到demo展示代码
 * @param req
 * @param res
 */

var handle_db = require('../../common/db');

module.exports.layui = function (req, res,next) {

    /**
     * 手动关闭数据库实例 开始
     */

    var insert_sql = 'INSERT INTO demoTable(file1,file2) VALUES(?,?)';

    var conn = handle_db.db_conn();
    conn.query(insert_sql,[1,2],function(err,results) {
        if (err) {
            console.log(err);
        }
        handle_db.close(conn);
        console.log(results);
    });
    /**
     * 手动关闭数据库实例 结束
     */
     res.locals.user = req.session.user;
    res.render('demo/layuiDemo');
}