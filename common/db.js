/**
 * Created by qiaojoe on 15-9-29.
 */


var config = require('../config');
var mysql = require('mysql');
/**
 * 创建数据库连接池
 * @param dbConfig {Object} 数据库连池参数
 */
exports.createPool = function(dbConfig){
    if (this.dbPool === undefined) {
        this.dbPool = require('mysql').createPool(dbConfig);
        // TODO: 需要做错误处理
    }
};

/**
 * 执行数据库查询操作
 * @param sql {String} SQL语句
 * @param values {Array} SQL语句相关变量
 * @param callback {Function} 回调函数
 * @param callbackData {Object} 回调函数参数
 * @param autoReleaseConnection {Boolean} 是否自动释放连接(默认为自动翻放)
 */
// TODO: 读mysql模块Readme.md了解连接池相关所有原理, 进行改进
exports.query = function(sql, values, callback, callbackData, autoReleaseConnection){
    if (typeof this.dbPool === 'undefined') {
        console.log('Database connection pool not configured, Call "createPool" function first.');
        return;
    }

    if (typeof sql !== 'string') {
        console.log('Invalid parameter.');
        return;
    }

    this.dbPool.getConnection(function(err, connection){
        if (err) {
            console.log('Database connection pool error: ' + err);
            throw err;
        }

        // 执行SQL查询并通过回调返回结果(只支持单次查询)
        if (typeof this.dbPool !== 'undefined') {
            callbackData.connection = connection;
            callbackData.db = this;
        }
        connection.query(sql, values, function(err, rows, fields) {
            if (typeof callback == 'function') {
                callback(callbackData, err, rows, fields);
            }
        });

        if (typeof autoReleaseConnection === 'undefined' || (typeof autoReleaseConnection === 'boolean' && autoReleaseConnection)) {
            connection.release();
        }
    });
};

/** 当需要map处理sql，尤其是做事务操作的时候，可能由于nodejs原来的非阻塞的机制导致
 *  数据库连接不能及时关闭，此情况可以用以下机制，手动关闭数据库。
 **/

var db_options ={
    host: config.dbConfig.host,
    user: config.dbConfig.user,
    password: config.dbConfig.password,
    database: config.dbConfig.database,
    port: 3306
};

/**
 * 单条sql，如 insert into tablename（file1,file2）Values(1,2);
 * @returns {*}
 */
exports.db_conn = function () {
    return   mysql.createConnection(db_options);

}

exports.close = function (conn) {
    if (conn != null) {
        conn.end();
    }
}

/**
 * 处理多条sql 如 insert into tablename（file1，file2）values（1，2）；insert into tablename（file1，file2）values（1，2）；
 * 语句间用分号隔开
 * @returns {*}
 */
exports.db_conn_multiple = function(){//处理多条sql语句

    db_options.multipleStatements = true;

    return mysql.createConnection(db_options);

}



