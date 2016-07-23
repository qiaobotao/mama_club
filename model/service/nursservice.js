/**
 * Created by Administrator on 2016/1/31.
 */
/**
 * Created by qiaojoe on 16-1-2.
 * 教室管理
 */


var db = require('../../common/db');
var async = require('async');
var utils = require('../../common/utils');
var mainDiagnosticResultClassifyId = require('../../config').mainClassifyId.diagnosticResult;
var mainMomReasonsClassifyId = require('../../config').mainClassifyId.momReasons;
var mainBabyResultClassifyId = require('../../config').mainClassifyId.babyReasons;
var mainOtherReasonsClassifyId = require('../../config').mainClassifyId.otherReasons;
var serverEvaluateId = require('../../config').mainClassifyId.serverEvaluate;//服务效果评价
var isViewLactationId = require('../../config').mainClassifyId.isViewLactation;//是否观察哺乳
var breastPumpBrandId = require('../../config').mainClassifyId.breastPumpBrand;//吸奶器品牌
var milkTotalId = require('../../config').mainClassifyId.milkTotal;//挤奶总量
var milkNumId = require('../../config').mainClassifyId.milkNum;//挤奶次数
var milkSituationId = require('../../config').mainClassifyId.milkSituation;//挤奶情况
var urineVolumeId = require('../../config').mainClassifyId.urineVolume;//尿量
var shapeId = require('../../config').mainClassifyId.shape;//形状
var feedingConditionId = require('../../config').mainClassifyId.feedingCondition;//喂养情况
var treatmentMethodId = require('../../config').mainClassifyId.treatmentMethod;//做过何种处理
var serverDemandId = require('../../config').mainClassifyId.serverDemand;//服务需求
var consts = require('../../model/utils/consts');


/**
 * 在收费单中生成护理服务单信息
 * @param serviceMeetId
 * @param serviceDate
 * @param serviceStartTime
 * @param serviceEndTime
 * @param cb
 */
module.exports.insertNursServiceByMoneyManage = function(serviceMeetId,serviceDate,serviceStartTime,serviceEndTime,cb){
    var sql = 'INSERT INTO nursService(serviceMeetId,serviceDate,startTime,endTime,dateLine) VALUES (?,?,?,?,?)';
    db.query(sql, [serviceMeetId,serviceDate,serviceStartTime,serviceEndTime,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
/**
 * 在预约单中生成护理服务单信息
 * @param nursServiceNo
 * @param serviceMeetId
 * @param serviceDate
 * @param serviceStartTime
 * @param serviceEndTime
 * @param cb
 */
module.exports.insertNursServiceByServiceMeet = function(nursServiceNo,serviceMeetId,serviceDate,serviceStartTime,status,cb){
    var sql = 'INSERT INTO nursService(nursServiceNo,serviceMeetId,serviceDate,startTime,status,dateLine) VALUES (?,?,?,?,?,?)';
    db.query(sql, [nursServiceNo,serviceMeetId,serviceDate,serviceStartTime,status,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 根据护理服务单号更新服务完成时间、护理服务单状态
 * @param nursServiceNo
 * @param nursState
 * @param serviceEndTime
 * @param cb
 */
module.exports.updateNursServiceByMoneyManage = function(nursServiceId,nursState,serviceEndTime, cb) {

    var sql = 'UPDATE nursService set endTime=?,status=?'
        + ' where id=?';
    db.query(sql, [serviceEndTime,nursState,nursServiceId], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 修改乳房示意图图片名称及路径
 * @param id
 * @param breastExplain：名称与路径用分号隔开
 * @param cb
 */
module.exports.updateBreastImage = function(id,breastExplain, cb) {

    var sql = 'UPDATE nursService set breastExplain=?'
        + ' where id=?';
    db.query(sql, [breastExplain,id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 修改回访单信息
 * @param id
 * @param returnVisitDate
 * @param returnVisitType
 * @param returnVisitStaffId
 * @param returnVisitResult
 * @param cb
 */
module.exports.updateReturnVisit = function(id,returnVisitDate,returnVisitType,returnVisitStaffId,returnVisitResult,status, cb) {

    var sql = 'UPDATE nursService set returnVisitDate=?,returnVisitType=?,returnVisitStaffId=?,returnVisitResult=?,status=? '
        + ' where id=?';
    db.query(sql, [returnVisitDate,returnVisitType,returnVisitStaffId,returnVisitResult,status,id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};


/**
 * 更新护理服务单全部字段
 * @param id
 * @param serviceMeetId
 * @param serviceDate
 * @param name
 * @param tel
 * @param startTime
 * @param endTime
 * @param serviceType
 * @param address
 * @param serviceNeeds
 * @param bowelFrequenc
 * @param deal
 * @param shape
 * @param feedSituation
 * @param urination
 * @param feedRemark
 * @param milkSituation
 * @param childCurrentMonths
 * @param milkNumber
 * @param childCurrentHeight
 * @param milkAmount
 * @param childCurrentWeight
 * @param breastpumpBrand
 * @param isCarefulNurse
 * @param referralAdvise
 * @param diagnosis
 * @param specialInstructions
 * @param childReason
 * @param breastExplain
 * @param motherReason
 * @param leaveAdvise
 * @param otherReason
 * @param isLeadTrainee
 * @param whetherAppointmentAgain
 * @param traineeName
 * @param cb
 */
module.exports.updateNursService = function(id,serviceMeetId,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
                                            bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
                                            milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
                                            diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
                                            isLeadTrainee,whetherAppointmentAgain,traineeName,noNeedVisit,evaluate,proposal, status,cb) {

    var sql = 'UPDATE nursService set serviceMeetId=?,serviceDate=?,startTime=?,endTime=?,serviceType=?,address=?,serviceNeeds=?,'
        + ' bowelFrequenc=?,deal=?,shape=?,feedSituation=?,urination=?,feedRemark=?,milkSituation=?,childCurrentMonths=?,'
        + ' milkNumber=?,childCurrentHeight=?,milkAmount=?,childCurrentWeight=?,breastpumpBrand=?,isCarefulNurse=?,referralAdvise=?,'
        + ' diagnosis=?,specialInstructions=?,childReason=?,breastExplain=?,motherReason=?,leaveAdvise=?,otherReason=?,'
        + ' isLeadTrainee=?,whetherAppointmentAgain=?,traineeName=?,noNeedVisit=?,evaluate=?,proposal=?,status=?,dateLine=?'
        + ' where id=?';
    db.query(sql, [serviceMeetId,serviceDate,startTime,endTime,serviceType,address,serviceNeeds,
        bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
        milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
        diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
        isLeadTrainee,whetherAppointmentAgain,traineeName,noNeedVisit,evaluate,proposal,status,new Date().getTime(),id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 护理服务单列表使用
 * @param shopId
 * @param name
 * @param principal
 * @param serviceDate
 * @param currentPage
 * @param cb
 */
module.exports.fetchAllNursService = function(shopId,name,principal,serviceDate,currentPage,cb) {

    var parm = " where  (a.serviceMeetId=b.id)"
    if (name != '')
        parm += " and b.name like'%" + name + "%'";
    if (shopId != '')
        parm += " and b.shopId ='" + shopId + "'";
    if (principal != '')
        parm += " and b.principal like'%" + principal + "%'";
    if (serviceDate != '')
        parm += " and a.serviceDate like'%" + serviceDate + "%'";

    var sql_count = 'SELECT  count(1) as count FROM nursService a ,serviceMeet b'+ parm;
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT a.id,b.name,b.tel,a.serviceDate,b.principal,a.status FROM nursService a ,serviceMeet b'+ parm +' ORDER BY a.dateline DESC LIMIT ?,?';

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

/**
 * 回访信息列表使用
 * @param shopId
 * @param name
 * @param principal
 * @param serviceDate
 * @param currentPage
 * @param cb
 */
module.exports.fetchAllReturnVisit = function(shopId,name,principal,serviceDate,currentPage,cb) {

    var parm = " where  (a.serviceMeetId=b.id)"
    if (name != '')
        parm += " and b.name like'%" + name + "%'";
    if (shopId != '')
        parm += " and b.shopId ='" + shopId + "'";
    if (principal != '')
        parm += " and b.principal like'%" + principal + "%'";
    if (serviceDate != '')
        parm += " and a.serviceDate like'%" + serviceDate + "%'";

    parm += " and a.status > "+consts.NURS_STATE_2;//状态在“已收费”之后的状态数据
    parm += " and a.noNeedVisit <> 'Y'";//回访状态不是“不必回访”

    var sql_count = 'SELECT  count(1) as count FROM nursService a ,serviceMeet b'+ parm;
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT a.id,b.name,b.tel,a.serviceDate,b.principal,a.status,a.returnVisitDate,' +
        "   (select name from staff s where id = a.returnVisitStaffId) as returnVisitStaffName " +
        ' FROM nursService a ,serviceMeet b'+ parm +' ORDER BY a.dateline DESC LIMIT ?,?';

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

/**
 * 获取护理服务单数据
 * 编辑护理服务单信息时使用
 * @param id
 * @param cb
 */
module.exports.fetchSingleNursService =function (id, cb) {

    var classificationPare = mainDiagnosticResultClassifyId +","+
        mainMomReasonsClassifyId +","+
        mainBabyResultClassifyId +","+
        mainOtherReasonsClassifyId +","+
        serverEvaluateId +","+
        isViewLactationId +","+
        breastPumpBrandId +","+
        milkTotalId +","+
        milkNumId +","+
        milkSituationId +","+
        urineVolumeId+","+
        shapeId+","+
        feedingConditionId+","+
        treatmentMethodId+","+
        serverDemandId;

    var nursServicesql = 'SELECT ' +
        '   a.*,' +
        '   b.serviceType,' +
        '   b.province,' +
        '   b.city,' +
        '   b.town,' +
        '   b.address,' +
        '   b.deal,' +
        '   b.serviceNeeds,' +
        '   m.memberName,' +
        '   m.tel as memberTel,' +
        '   (select name from shop where id = b.serverShopId) as shopName,' +
        '   FORMAT(datediff(str_to_date(SYSDATE(), "%Y-%m-%d") ,m.childBirthday)/30 ,1)as childMonths, ' +
        "   (select name from staff s where id = a.returnVisitStaffId) as returnVisitStaffName " +
        'FROM nursService a , serviceMeet b ,member m ' +
        'WHERE a.serviceMeetId=b.id ' +
        'AND m.id = b.memberId ' +
        'AND a.id = ? ';
    var classificationSql = 'select * from systemClassify where parentId in ('+classificationPare+')';
    //获取护理子表（服务信息）数据
    var serviceSql = "SELECT m.*," +
        "   (SELECT name from staff s WHERE s.id = m.staffId) as serviceStaffName," +
        "   (SELECT name from staff s WHERE s.id = m.traineeId) as traineeStaffName ," +
        "   (select name from service s where id = m.serviceId) as serviceName " +
        "FROM moneyManageServices m WHERE nursServiceId = ? ";
    //获取护理服务子表（商品信息）数据
    var proSql = "SELECT m.*,w.`name`,w.serialNumber FROM moneyManageWares m , wares w  WHERE m.waresId = w.id AND m.nursServiceId = ? ";


    async.series({
        //活动详情列表
        nursService : function(callback){
            db.query(nursServicesql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //获取收费子表（服务信息）数据
        moneyManageServicesData : function(callback){
            db.query(serviceSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //获取收费子表（商品信息）数据
        moneyManageWaresData : function(callback){
            db.query(proSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        //当前活动信息
        classificationData : function(callback){
            db.query(classificationSql, [], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        }
    },function(err, results) {

        if (!err) {

            //为字典表所需数据分别定义对象集合
            var diagnosticResultArr = new Array();
            var momReasonsArr = new Array();
            var babyReasonsArr = new Array();
            var otherReasonsArr = new Array();
            var serverEvaluateArr = new Array();
            var isViewLactationArr = new Array();
            var breastPumpBrandArr = new Array();
            var milkTotalArr = new Array();
            var milkNumArr = new Array();
            var milkSituationArr = new Array();
            var urineVolumeArr = new Array();
            var shapeArr = new Array();
            var feedingConditionArr = new Array();
            var treatmentMethodArr = new Array();
            var serverDemandArr = new Array();
            for(var i = 0 ; i < results.classificationData.length ; i ++){
                var classification = results.classificationData[i];
                if(mainDiagnosticResultClassifyId == classification.parentId){
                    diagnosticResultArr.push(classification);
                }else if(mainMomReasonsClassifyId == classification.parentId){
                    momReasonsArr.push(classification);
                }else if(mainBabyResultClassifyId == classification.parentId){
                    babyReasonsArr.push(classification);
                }else if(mainOtherReasonsClassifyId == classification.parentId){
                    otherReasonsArr.push(classification);
                }else if(serverEvaluateId == classification.parentId){
                    serverEvaluateArr.push(classification);
                }else if(isViewLactationId == classification.parentId){
                    isViewLactationArr.push(classification);
                }else if(breastPumpBrandId == classification.parentId){
                    breastPumpBrandArr.push(classification);
                }else if(milkTotalId == classification.parentId){
                    milkTotalArr.push(classification);
                }else if(milkNumId == classification.parentId){
                    milkNumArr.push(classification);
                }else if(milkSituationId == classification.parentId){
                    milkSituationArr.push(classification);
                }else if(urineVolumeId == classification.parentId){
                    urineVolumeArr.push(classification);
                }else if(shapeId == classification.parentId){
                    shapeArr.push(classification);
                }else if(feedingConditionId == classification.parentId){
                    feedingConditionArr.push(classification);
                }else if(treatmentMethodId == classification.parentId){
                    treatmentMethodArr.push(classification);
                }else if(serverDemandId == classification.parentId){
                    serverDemandArr.push(classification);
                }
            }
            results.diagnosticResultArr = diagnosticResultArr;
            results.momReasonsArr = momReasonsArr;
            results.babyReasonsArr = babyReasonsArr;
            results.otherReasonsArr = otherReasonsArr;
            results.serverEvaluateArr = serverEvaluateArr;
            results.isViewLactationArr = isViewLactationArr;
            results.breastPumpBrandArr = breastPumpBrandArr;
            results.milkTotalArr = milkTotalArr;
            results.milkNumArr = milkNumArr;
            results.milkSituationArr = milkSituationArr;
            results.urineVolumeArr = urineVolumeArr;
            results.shapeArr = shapeArr;
            results.feedingConditionArr = feedingConditionArr;
            results.treatmentMethodArr = treatmentMethodArr;
            results.serverDemandArr = serverDemandArr;
            cb (null, results);
        } else {
            cb(err);
        }
    });
}

/**
 * 根据id获取护理服务单基本数据
 * @param id
 * @param cb
 */
module.exports.getNurServiceById =function (id, cb) {

    var nursServicesql = 'SELECT a.* FROM nursService a where a.id = ?';
    db.query(nursServicesql, [id], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null,rows);
        } else {
            cb(err);
        }
    });
}

module.exports.delNursService= function (id, cb) {

    var sql = 'DELETE FROM nursService WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
/**
 * 根据门店id，查找本年、本月第几个服务单
 * @param id
 * @param cb
 */
module.exports.createNursNo= function (id, cb) {
    /**
     * 1、根据门店id获取门店编码
     * 2、根据门店id+4位年-2位月获取当前门店当前月共有多少个服务单
     */
    var serialNumberSql = 'select serialNumber from shop where id = ?';
    var nursServiceCountSql = 'select count(*) as nursCount from nursService t where left(t.serviceDate,7) = ? and t.shopId = ?';
    async.series({
        //根据门店id获取门店编码
        serialNumber: function(callback){
            db.query(serialNumberSql, [id], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        nursServiceCount : function(callback){
            db.query(nursServiceCountSql, [utils.date2str(new Date(),"yyyy-MM"),id], function (cbData, err, rows, fields) {

                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        }
    },function(err, results) {
        //门店编号+年份4位+月份2位+编号3位。
        var codeIndex = results.nursServiceCount[0].nursCount +1;
        codeIndex = codeIndex<10?"00"+codeIndex:(codeIndex<100?"0"+codeIndex:codeIndex)
        var nursNo = results.serialNumber[0].serialNumber+utils.date2str(new Date(),"yyyyMM")+codeIndex;
        if (!err) {
            results.nursNo = nursNo;
            cb (null, results);
        } else {
            cb(err);
        }
    });

}
/**
 * 获取前三条预约数据根据会员id 或者 姓名和电话
 * @param id
 * @param cb
 */
module.exports.getTop3NursService =function (serviceMeetIds, cb) {
    var  parm=   "and a.serviceMeetId in(" + serviceMeetIds + ")" ;
    parm+=" order by dateLine";
    var sql = 'SELECT   a.*,   b.principal AS principal FROM  nursService a,  serviceMeet b WHERE a.serviceMeetId = b.id  '+parm;
    db.query(sql, [],  function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

module.exports.getnursserviceClassify = function (cb) {
    var sql = 'SELECT id,name FROM systemClassify WHERE parentId = ?';
    async.series({
        ClassifyId1: function(callback){
            db.query(sql, [mainDiagnosticResultClassifyId], function (cbData, err, rows, fields) {

                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        ClassifyId2 : function(callback){
            db.query(sql, [mainMomReasonsClassifyId], function (cbData, err, rows, fields) {

                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },

        ClassifyId3: function(callback){
            db.query(sql, [mainBabyResultClassifyId], function (cbData, err, rows, fields) {

                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        ClassifyId4 : function(callback){
            db.query(sql, [mainOtherReasonsClassifyId], function (cbData, err, rows, fields) {

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