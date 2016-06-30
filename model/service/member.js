/**
 * Created by Administrator on 2016/1/31.
 */
/**
 * Created by qiaojoe on 16-1-2.
 * 教室管理
 */


var db = require('../../common/db');
var async = require('async');
var educationId = require('../../config').mainClassifyId.education;//学历id
var jobStateId = require('../../config').mainClassifyId.jobState;//工作状态id
var childbirthTypeId = require('../../config').mainClassifyId.childbirthType;//分娩方式id
var childbirthWeekId = require('../../config').mainClassifyId.childbirthWeek;//分娩时孕周id
var guardianId = require('../../config').mainClassifyId.guardian;//参与育儿id（监护人）
var secondChildExperienceId = require('../../config').mainClassifyId.secondChildExperience;//二胎经验id
var eatBreastMilkTimeId = require('../../config').mainClassifyId.eatBreastMilkTime;//父母儿时母乳吃多久id
var eatBreastMilkReasonId = require('../../config').mainClassifyId.eatBreastMilkReason;//母乳喂养理由id
var hospitalAddItemsId = require('../../config').mainClassifyId.hospitalAddItems;//住院添加id
var auxiliaryToolId = require('../../config').mainClassifyId.auxiliaryTool;//辅助工具id
var specialNoteId = require('../../config').mainClassifyId.specialNote;//特殊说明id

module.exports.insertMember = function(shopId,birthYearMonth,memberCardType,memberName,tel,contact,province,city,town,address,workStatus,motherEducation,fatherEducation,deliveryMode,
                                       deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
                                       husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,
                                       hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions, cb) {



    //memberCardType = "12";

    var sql = 'INSERT INTO member (shopId,birthYearMonth,memberCardType,memberName,tel,contact,province,city,town,address,workStatus,motherEducation,fatherEducation,deliveryMode,'
        + 'deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,'
        + 'husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,'
        + 'hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions,dateline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [shopId,age,memberCardType,memberName,tel,contact,province,city,town,address,workStatus,motherEducation,fatherEducation,deliveryMode,
        deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
        husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,
        hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.updateMember = function(id,birthYearMonth,memberCardType,memberName,tel,contact,province,city,town,address,workStatus,motherEducation,fatherEducation,deliveryMode,
                                       deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
                                       husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,understandJinQuanChannelDes,
                                       hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions, cb) {

    var sql = 'UPDATE member set birthYearMonth=?, memberCardType=?,memberName=?,tel=?,contact=?,province=?,city=?,town=?,address=?,workStatus=?,motherEducation=?,fatherEducation=?,deliveryMode=?,'
        + ' deliveryWeeks=?,deliveryHospital=?,parentTraining=?,secondChildExperience=?,secondChildExperienceRemark=?,wifeBreastfeedTime=?,'
        + ' husbandBreastfeedTime=?,breastfeedReason=?,childName=?,childSex=?,childHeight=?,childWeight=?,childBirthday=?,understandJinQuanChannel=?,understandJinQuanChannelDes=?,'
        + ' hospitalization=?,hospitalizationReason=?,assistantTool=?,useToolReason=?,specialInstructions=?'
        + ' where id=?';
    db.query(sql, [birthYearMonth,memberCardType,memberName,tel,contact,province,city,town,address,workStatus,motherEducation,fatherEducation,deliveryMode,
        deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
        husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,understandJinQuanChannelDes,
        hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions,id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
module.exports.fetchAllMember = function(shopId,serialNumber,memberName,tel,currentPage,cb) {

    var parm = " on   (a.id=b.memberId)  where 1=1"
    if (shopId != '')
        parm += " and a.shopId ='" + shopId + "'";

    if (serialNumber != '')
        parm += " and b.serialNumber like'%" + serialNumber + "%'";
    if (memberName != '')
        parm += " and a.memberName like'%" + memberName + "%'";
    if (tel != '')
        parm += " and a.tel like'%" + tel + "%'";

    var sql_count ='SELECT  count(1) as count  FROM member a left join  memberCard b'+ parm +' ORDER BY a.dateline DESC ';

    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT a.id,b.serialNumber,a.memberName,a.tel,b.type FROM member a left join  memberCard b'+ parm +' ORDER BY a.dateline DESC LIMIT ?,?';

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
module.exports.fetchAllMemberByCard = function(shopId,serialNumber,memberName,tel,currentPage,cb) {

    var parm = " "
    if (shopId != '')
        parm += " and a.shopId ='" + shopId + "'";
    if (serialNumber != '')
        parm += " and b.serialNumber like'%" + serialNumber + "%'";
    if (memberName != '')
        parm += " and a.memberName like'%" + memberName + "%'";
    if (tel != '')
        parm += " and a.tel like'%" + tel + "%'";

    var sql_count = 'SELECT count(*) as count FROM member a WHERE id NOT IN(SELECT memberId FROM memberCard WHERE memberId IS NOT NULL)';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT * FROM member a WHERE id NOT IN(SELECT memberId FROM memberCard WHERE memberId IS NOT NULL)'+ parm +' LIMIT ?,?';

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

module.exports.fetchSingleMember =function (id, cb) {

    var fetchSingSql = 'SELECT a.*,b.serialNumber FROM member a LEFT JOIN memberCard b ON b.memberId=a.id  WHERE a.id = ?';
    var classificationPare = educationId +","+
        jobStateId +","+
        childbirthTypeId +","+
        childbirthWeekId +","+
        guardianId +","+
        secondChildExperienceId +","+
        eatBreastMilkTimeId +","+
        eatBreastMilkReasonId +","+
        hospitalAddItemsId +","+
        auxiliaryToolId +","+specialNoteId;
    var classificationSql = 'select * from systemClassify where parentId in ('+classificationPare+')';



    async.series({
        //活动详情列表
        fetchSingData : function(callback){
            db.query(fetchSingSql, [id], function (cbData, err, rows, fields) {
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
            var educationArr = new Array();
            var jobStateArr = new Array();
            var childbirthTypeArr = new Array();
            var childbirthWeekArr = new Array();
            var guardianArr = new Array();
            var secondChildExperienceArr = new Array();
            var eatBreastMilkTimeArr = new Array();
            var eatBreastMilkReasonArr = new Array();
            var hospitalAddItemsArr = new Array();
            var auxiliaryToolArr = new Array();
            var specialNoteArr = new Array();
            for(var i = 0 ; i < results.classificationData.length ; i ++){
                var classification = results.classificationData[i];
                if(educationId == classification.parentId){
                    educationArr.push(classification);
                }else if(jobStateId == classification.parentId){
                    jobStateArr.push(classification);
                }else if(childbirthTypeId == classification.parentId){
                    childbirthTypeArr.push(classification);
                }else if(childbirthWeekId == classification.parentId){
                    childbirthWeekArr.push(classification);
                }else if(guardianId == classification.parentId){
                    guardianArr.push(classification);
                }else if(secondChildExperienceId == classification.parentId){
                    secondChildExperienceArr.push(classification);
                }else if(eatBreastMilkTimeId == classification.parentId){
                    eatBreastMilkTimeArr.push(classification);
                }else if(eatBreastMilkReasonId == classification.parentId){
                    eatBreastMilkReasonArr.push(classification);
                }else if(hospitalAddItemsId == classification.parentId){
                    hospitalAddItemsArr.push(classification);
                }else if(auxiliaryToolId == classification.parentId){
                    auxiliaryToolArr.push(classification);
                }else if(specialNoteId == classification.parentId){
                    specialNoteArr.push(classification);
                }
            }
            results.educationArr = educationArr;
            results.jobStateArr = jobStateArr;
            results.childbirthTypeArr = childbirthTypeArr;
            results.childbirthWeekArr = childbirthWeekArr;
            results.guardianArr = guardianArr;
            results.secondChildExperienceArr = secondChildExperienceArr;
            results.eatBreastMilkTimeArr = eatBreastMilkTimeArr;
            results.eatBreastMilkReasonArr = eatBreastMilkReasonArr;
            results.hospitalAddItemsArr = hospitalAddItemsArr;
            results.auxiliaryToolArr = auxiliaryToolArr;
            results.specialNoteArr = specialNoteArr;

            cb (null, results);
        } else {
            cb(err);
        }
    });


}
module.exports.delMember= function (id, cb) {

    var sql = 'DELETE FROM member WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
module.exports.getMemberByNameTel_bak =function (memberName,tel , cb) {

    var sql = 'SELECT * FROM member WHERE memberName = ? and tel=?';
    db.query(sql, [memberName,tel],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}
/**
 * 根据手机号查询会员信息
 * @param tel
 * @param cb
 */
module.exports.getMemberByNameTel =function (tel ,shopId, cb) {

    var sql = 'SELECT * FROM member WHERE tel=? and shopId=?';
    db.query(sql, [tel,shopId ], function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}