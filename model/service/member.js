/**
 * Created by Administrator on 2016/1/31.
 */
/**
 * Created by qiaojoe on 16-1-2.
 * 教室管理
 */


var db = require('../../common/db');
var async = require('async');

module.exports.insertMember = function(memberCardType,memberName,tel,contact,address,workStatus,motherEducation,fatherEducation,deliveryMode,
                                       deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
                                       husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,
                                       hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions, cb) {

    var sql = 'INSERT INTO member (memberCardType,memberName,tel,contact,address,workStatus,motherEducation,fatherEducation,deliveryMode,'
        + 'deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,'
        + 'husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,'
        + 'hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [memberCardType,memberName,tel,contact,address,workStatus,motherEducation,fatherEducation,deliveryMode,
        deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
        husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,
        hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.updateMember = function(id,memberCardType,memberName,tel,contact,address,workStatus,motherEducation,fatherEducation,deliveryMode,
                                       deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
                                       husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,
                                       hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions, cb) {

    var sql = 'UPDATE member set memberCardType=?,memberName=?,tel=?,contact=?,address=?,workStatus=?,motherEducation=?,fatherEducation=?,deliveryMode=?,'
        + ' deliveryWeeks=?,deliveryHospital=?,parentTraining=?,secondChildExperience=?,secondChildExperienceRemark=?,wifeBreastfeedTime=?,'
        + ' husbandBreastfeedTime=?,breastfeedReason=?,childName=?,childSex=?,childHeight=?,childWeight=?,childBirthday=?,understandJinQuanChannel=?,'
        + ' hospitalization=?,hospitalizationReason=?,assistantTool=?,useToolReason=?,specialInstructions=?'
        + ' where id=?';
    db.query(sql, [memberCardType,memberName,tel,contact,address,workStatus,motherEducation,fatherEducation,deliveryMode,
        deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
        husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,
        hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions,id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

module.exports.fetchAllMember = function(serialNumber,memberName,tel,currentPage,cb) {

    var parm = " on (a.id=b.memberId)"
    if (serialNumber != '')
        parm += " and b.serialNumber like'%" + serialNumber + "%'";
    if (memberName != '')
        parm += " and a.memberName like'%" + memberName + "%'";
    if (tel != '')
        parm += " and a.tel like'%" + tel + "%'";

    var sql_count = 'SELECT count(*) as count FROM member';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT a.id,b.serialNumber,a.memberName,a.tel,b.type FROM member a left join memberCard b'+ parm +' LIMIT ?,?';

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

    var sql = 'SELECT * FROM member WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
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