/**
 * Created by qiaojoe on 15-9-29.
 */
/**
 * 服务器全局配置文件
 */

module.exports = {

    // 服务器配置
    server: {
        port: 8000,
        develop: false,
        // 微信菜单，是否重新设置菜单
        resetmenu: false
    },

    // 微信公众号信息
    wechat: {
        appId: '',
        appSecret: '',
        token: ''
    },

    // 微信公众号信息(开发版)
    wechat_develop: {
        appId: '',
        appSecret: '',
        token: ''
    },

    // 数据库连接池配置
    dbConfig: {
        host     : '*',
        database : 'mama_club',
        user     : 'root',
        password : 'q1w2e3',
        port     : 3306,
        connectionLimit : 50
    },

    // 数据库连接池配置(开发版)
    dbConfig_develop: {
        host     : '127.0.0.1',
        database : 'higuo',
        user     : 'root',
        password : '',
        port     : 3306,
        connectionLimit : 50
    },

    // 主分类id
    mainClassifyId : {
        serivce : 17,
        wares : 14,
        storeroom : 9,
        distributor : 8,
        inType : 4,
        buyType : 9,
        outType : 18,
        diagnosticResult:23,
        momReasons:21 ,
        babyReasons:20,
        otherReasons:22


    }

};