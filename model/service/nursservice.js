/**
 * Created by Administrator on 2016/1/31.
 */
/**
 * Created by qiaojoe on 16-1-2.
 * 教室管理
 */


var db = require('../../common/db');
var async = require('async');
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


/**
 * 在收费单中生成护理服务单信息
 * @param serviceMeetId
 * @param serviceDate
 */
module.exports.insertNursServiceByMoneyManage = function(serviceMeetId,cb){
    var sql = 'INSERT INTO nursService(serviceMeetId,dateLine) VALUES (?,?)';
    db.query(sql, [serviceMeetId,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 2016年05月04日
 * 此方法以后将不被使用：业务上，由收费功能生成护理服务单；护理服务单可以自行修改
 * @param cb
 */
module.exports.insertNursService = function(shopId,outLogId,serviceMeetId,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
                                       bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
                                       milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
                                       diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
                                       isLeadTrainee,whetherAppointmentAgain,traineeName, cb) {

    var sql = 'INSERT INTO nursService(shopId,outLogId,serviceMeetId,serviceDate,startTime,endTime,serviceType,address,serviceNeeds,'
        + 'bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,'
        + 'milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,'
        + 'diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,'
        + 'isLeadTrainee,whetherAppointmentAgain,traineeName,dateLine) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [shopId,outLogId,serviceMeetId,serviceDate,startTime,endTime,serviceType,address,serviceNeeds,
        bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
        milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
        diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
        isLeadTrainee,whetherAppointmentAgain,traineeName,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.updateNursService = function(outLogId,id,serviceMeetId,serviceDate,name,tel,startTime,endTime,serviceType,address,serviceNeeds,
                                            bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
                                            milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
                                            diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
                                            isLeadTrainee,whetherAppointmentAgain,traineeName, cb) {

    var sql = 'UPDATE nursService set outLogId=?,serviceMeetId=?,serviceDate=?,startTime=?,endTime=?,serviceType=?,address=?,serviceNeeds=?,'
        + ' bowelFrequenc=?,deal=?,shape=?,feedSituation=?,urination=?,feedRemark=?,milkSituation=?,childCurrentMonths=?,'
        + ' milkNumber=?,childCurrentHeight=?,milkAmount=?,childCurrentWeight=?,breastpumpBrand=?,isCarefulNurse=?,referralAdvise=?,'
        + ' diagnosis=?,specialInstructions=?,childReason=?,breastExplain=?,motherReason=?,leaveAdvise=?,otherReason=?,'
        + ' isLeadTrainee=?,whetherAppointmentAgain=?,traineeName=?,dateLine=?'
        + ' where id=?';
    db.query(sql, [outLogId,serviceMeetId,serviceDate,startTime,endTime,serviceType,address,serviceNeeds,
        bowelFrequenc,deal,shape,feedSituation,urination,feedRemark,milkSituation,childCurrentMonths,
        milkNumber,childCurrentHeight,milkAmount,childCurrentWeight,breastpumpBrand,isCarefulNurse,referralAdvise,
        diagnosis,specialInstructions,childReason,breastExplain,motherReason,leaveAdvise,otherReason,
        isLeadTrainee,whetherAppointmentAgain,traineeName,new Date().getTime(),id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

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
    var sql_data = 'SELECT a.id,b.name,b.tel,a.serviceDate,b.principal,b.status FROM nursService a ,serviceMeet b'+ parm +' ORDER BY a.dateline DESC LIMIT ?,?';

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

module.exports.fetchSingleNursService =function (id, cb) {

    var nursServicesql = 'SELECT a.*,b.tel,b.name,b.address FROM nursService a inner join serviceMeet b on (a.serviceMeetId=b.id) WHERE a.id = ?';

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
    var classificationSql = 'select * from systemClassify where parentId in ('+classificationPare+')';


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
 * 获取前三条预约数据根据会员id 或者 姓名和电话
 * @param id
 * @param cb
 */
module.exports.getTop3NursService =function (serviceMeetIds, cb) {
    var  parm=   "and a.serviceMeetId in(" + serviceMeetIds + ")" ;
    parm+=" order by dateLine";
    var sql = 'SELECT   a.*,  c.name AS serviceName,  b.principal AS principal,  d.name AS serviceType FROM  nursService a,  serviceMeet b,  service c,  systemClassify d WHERE a.serviceMeetId = b.id AND b.serviceId = c.id  AND c.classify = d.id  '+parm;
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