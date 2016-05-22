/**
 * Created by Administrator on 2016/1/31.
 */
/**
 * Created by qiaojoe on 16-1-2.
 * 教室管理
 */


var db = require('../../common/db');
var async = require('async');

module.exports.insertMember = function(shopId,age,memberCardType,memberName,tel,contact,address,workStatus,motherEducation,fatherEducation,deliveryMode,
                                       deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
                                       husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,
                                       hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions, cb) {



    //memberCardType = "12";

    var sql = 'INSERT INTO member (shopId,age,memberCardType,memberName,tel,contact,address,workStatus,motherEducation,fatherEducation,deliveryMode,'
        + 'deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,'
        + 'husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,'
        + 'hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions,dateline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [shopId,age,memberCardType,memberName,tel,contact,address,workStatus,motherEducation,fatherEducation,deliveryMode,
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

module.exports.updateMember = function(id,age,memberCardType,memberName,tel,contact,address,workStatus,motherEducation,fatherEducation,deliveryMode,
                                       deliveryWeeks,deliveryHospital,parentTraining,secondChildExperience,secondChildExperienceRemark,wifeBreastfeedTime,
                                       husbandBreastfeedTime,breastfeedReason,childName,childSex,childHeight,childWeight,childBirthday,understandJinQuanChannel,
                                       hospitalization,hospitalizationReason,assistantTool,useToolReason,specialInstructions, cb) {

    var sql = 'UPDATE member set age=?, memberCardType=?,memberName=?,tel=?,contact=?,address=?,workStatus=?,motherEducation=?,fatherEducation=?,deliveryMode=?,'
        + ' deliveryWeeks=?,deliveryHospital=?,parentTraining=?,secondChildExperience=?,secondChildExperienceRemark=?,wifeBreastfeedTime=?,'
        + ' husbandBreastfeedTime=?,breastfeedReason=?,childName=?,childSex=?,childHeight=?,childWeight=?,childBirthday=?,understandJinQuanChannel=?,'
        + ' hospitalization=?,hospitalizationReason=?,assistantTool=?,useToolReason=?,specialInstructions=?'
        + ' where id=?';
    db.query(sql, [age,memberCardType,memberName,tel,contact,address,workStatus,motherEducation,fatherEducation,deliveryMode,
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
module.exports.fetchAllMember = function(shopId,serialNumber,memberName,tel,currentPage,cb) {

    var parm = " on   (a.id=b.memberId)  where 1=1"
    if (shopId != '')
        parm += " and a.shopId like'%" + shopId + "%'";

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
        parm += " and a.shopId like'%" + shopId + "%'";
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

    var sql = 'SELECT a.*,b.serialNumber FROM member a LEFT JOIN memberCard b ON b.memberId=a.id  WHERE a.id = ?';
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