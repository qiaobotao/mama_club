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
        connectionLimit : 200
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
        classroomType : 19,
        diagnosticResult:23,
        momReasons:21 ,
        babyReasons:20,
        otherReasons:22,
        /**********应用在会员信息中 start**********/
        education:24,//学历
        vocationalQualification:25,//职业资格
        jobState:26,//工作状态
        childbirthType:27,//分娩方式
        childbirthWeek:35,//分娩时孕周
        guardian:28,//参与育儿id（监护人）
        secondChildExperience:29,//二胎经验
        eatBreastMilkTime:30,//父母儿时母乳吃多久
        eatBreastMilkReason:31,//母乳喂养理由
        hospitalAddItems:32,//住院添加
        auxiliaryTool:33,//辅助工具
        specialNote:34,//特殊说明
        /**********应用在会员信息中 end**********/

        /**********应用在护理服务信息中 start**********/
        serverEvaluate:36,//服务效果评价
        isViewLactation:37,//是否观察哺乳
        breastPumpBrand:38,//吸奶器品牌
        milkTotal:39,//挤奶总量
        milkNum:40,//挤奶次数
        milkSituation:41,//挤奶情况
        urineVolume:42,//尿量
        shape:43,//形状
        feedingCondition:44,//喂养情况
        treatmentMethod:45,//做过何种处理
        serverDemand:46,//服务需求
        /**********应用在护理服务信息中 end**********/


        printSystemLogFlag:true
    }

};