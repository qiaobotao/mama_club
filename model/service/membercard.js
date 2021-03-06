/**
 * Created by Administrator on 2016/1/31.
 */
/**
 * Created by qiaojoe on 16-1-2.
 * 会员卡管理
 */


var db = require('../../common/db');
var async = require('async');
var consts = require('../../model/utils/consts');

/**
 * 添加会员卡
 * @param serialNumber
 * @param name
 * @param classCode
 * @param classType
 * @param remark
 * @param materialid
 * @param cb
 * 添加会员卡时，启用状态，默认为未启用状态（在交费处修改）
 */
module.exports.insertMemberCard = function(shopId,serialNumber  ,createDate  ,dateline  , type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5, parameter6 , parameter7 , parameter8, parameter9,cb) {

    var sql = 'INSERT INTO memberCard (shopId,serialNumber ,createDate  ,dateline  , type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5,parameter6 , parameter7 , parameter8,parameter9,isActivation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [shopId,serialNumber ,createDate  ,dateline  ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5,parameter6 , parameter7 , parameter8,parameter9,consts.STATE_DISABLE], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
/**
 * 根据各卡种生成下一个卡号
 * @param shopId
 * @param type
 * @param cb
 * 添加会员卡时，启用状态，默认为未启用状态（在交费处修改）
 */
module.exports.createMemberCardSerialNumber = function(shopId , type ,cb) {
    var sql = "select CAST(substring(serialNumber,3) AS SIGNED) as maxSerialNumber " +
        "   from memberCard t " +
        "   where t.serialNumber like '0"+type+"%' " +
        "   and t.shopId = '"+shopId+"' " +
        "   order by CAST(substring(serialNumber,3) AS SIGNED) desc  ";
    db.query(sql, [shopId], function(cbData, err, rows, fields) {
        if (!err) {
            //生成卡号
            var codeIndex = "";
            if(rows.length == 0){
                //没有自动生成单号时生成规则
                if(type == '1'){//充值卡
                    codeIndex = '0'+type+'00800';
                }else if (type == '2'){//服务次卡
                    codeIndex = '0'+type+'00100';
                }else if (type == '3'){//折扣卡
                    codeIndex = '0'+type+'00800';
                }
            }else{
                //找到最大值+1
                var nextNum = rows[0].maxSerialNumber +1;
                if(nextNum < 10 ){
                    codeIndex = '0'+type+'0000'+nextNum;
                }else if(nextNum < 100 ){
                    codeIndex = '0'+type+'000'+nextNum;
                }else if(nextNum < 1000 ){
                    codeIndex = '0'+type+'00'+nextNum;
                }else if(nextNum < 10000 ){
                    codeIndex = '0'+type+'0'+nextNum;
                }else{
                    codeIndex = '0'+type+nextNum;
                }
            }
            rows[0] = codeIndex;
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};
/**
 * 添加会员卡
 * @param serialNumber
 * @param name
 * @param classCode
 * @param classType
 * @param remark
 * @param materialid
 * @param cb
 */
module.exports.fetchAllMemberCard = function(shopId,serialNumber  ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5, parameter6 , parameter7 , parameter8, parameter9,currentPage,cb) {

    var parm = "  where a.serialNumber like '%" + serialNumber + "%' and a.type like '%" + type
        + "%' and a.parameter1 like '%" + parameter1 +"%' and a.parameter2 like '%"+ parameter2
        + "%' and a.parameter3 like '%"+ parameter3 + "%' and a.parameter4 like '%"+ parameter4
        + "%' and a.parameter5 like '%"+ parameter5 + "%' and a.parameter6 like '%"+ parameter6
        + "%' and a.parameter7 like '%"+ parameter7 + "%' and a.parameter8 like '%"+ parameter8
        + "%' and a.parameter9 like '%"+ parameter9  +"%'";
    if(shopId!='')
    {
        parm+= " and a.shopId='"+shopId+"'";
    }
    var sql_count = 'SELECT count(*) as count FROM memberCard a  '+parm;
    var sql_data = 'SELECT * FROM memberCard a '+parm;
    var start = (currentPage - 1) * 10;
    var end = 10;
    if (type=='1')
    {
        sql_count= 'SELECT  count(1) as count  FROM memberCard a  LEFT JOIN memberCardType b ON a.parameter1= b.id '+parm
        sql_data= 'SELECT a.*,b.memberCardType,b.memberCardAmount,b.consumerLimit ,b.zeroDiscounts,b.isManyPeopleUsed FROM memberCard a  LEFT JOIN memberCardType b ON a.parameter1= b.id '+parm;

    }
    sql_data+= '  ORDER BY  a.dateline DESC   LIMIT ?,?';


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

module.exports.fetchAllMemberCardBySelect = function(serialNumber,type,isActivation,currentPage,cb) {

    var parm = " where me.id = m.memberId "
    if (serialNumber != '')
        parm += " and me.memberName like '%"+serialNumber+"%'";
    if (type != '')
        parm += " and m.type =  "+type;
    if (isActivation != '')
        parm += " and m.isActivation =  "+isActivation;

    var sql_count = 'SELECT count(*) FROM memberCard m ,member me '+parm;
    var start = (currentPage - 1) * 10;
    var end = 10;
    var sql_data = 'SELECT m.id,m.serialNumber,m.type,m.parameter5,me.id as "memberId",me.tel,me.memberName,m.isActivation,parameter2 as "thisTimeMoney",' +
        '(' +
        '   select t.memberCardType from memberCardType t where t.id = m.parameter1' +
        ') as "cardTypeName",' +
        '(' +
        '   select CONCAT(t.zeroDiscounts*10,"折") from memberCardType t where t.id = m.parameter1' +
        ') as "zeroDiscounts",' +
        '(' +
        '   select CONCAT("满",t.memberCardAmount ,"减",t.consumerLimit - t.memberCardAmount) from memberCardType t where t.id = m.parameter1' +
        ') as "reductionDes"' +
        ' FROM memberCard m ,member me '+ parm +' LIMIT ?,?';

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
 * 删除
 * @param id
 * @param cb
 */
module.exports.delMembercard= function (id, cb) {

    var sql = 'DELETE FROM memberCard WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 查询菜单
 * @param pages
 * @param count
 * @param cb
 */
module.exports.fetchMembercard = function(pages, count, cb) {

    var start = pages * count;
    var end = start + count;
    var sql = 'SELECT * FROM memberCard  ORDER BY id DESC LIMIT ?, ?';
    db.query(sql, [start, end], function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}



/**
 * 修改会员卡启用状态信息

 * @param cb
 */
module.exports.updateMemberCardByActivation = function(id,isActivation,cb) {

    var sql = 'UPDATE  memberCard  SET isActivation  = ? WHERE  id  = ?';
    var par = [isActivation, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}


/**
 * 修改会员卡

 * @param cb
 */
module.exports.updateMemberCard = function(id,serialNumber ,dateline  , type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5,parameter6 , parameter7 , parameter8,parameter9,cb) {

    var sql = 'UPDATE  memberCard  SET serialNumber  = ?,  dateline  = ?,    type  = ?,   parameter1  = ?,parameter2  = ?,   parameter3  = ?,parameter4  = ?,parameter5  =? , parameter6  = ?,parameter7  = ?,parameter8  =?,parameter9  =? WHERE  id  = ?';
    var par = [serialNumber  ,dateline  , type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5,parameter6 , parameter7 , parameter8,parameter9, id];

    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取会员卡详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleMembercard =function (id ,type, cb) {


    var sql = 'SELECT a.* ,a.id as memberCardId, a.memberCardType memberCardName, c.* FROM memberCard a left join member c  on a.`memberId`=c.`id` where   a.id = ?';
    if(type=='1')
    {
        //sql='select   a.* , c.`memberName`,c.`id` AS memberId ' +
        sql='select   a.* ,a.id as memberCardId,a.memberCardType memberCardName ' +
            '   from (SELECT a.*,  b.`memberCardType`, b.`memberCardAmount`,b.`consumerLimit`,b.`zeroDiscounts`,b.`isManyPeopleUsed`,b.`status`  FROM memberCard a, memberCardType b  WHERE  a.id = ? AND a.parameter1=b.id ) as a ' +
            '   left join member c on ' +
            '   c.id=a.memberId ';
    }
    db.query(sql, [id],  function(cbData, err, rows, fields) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 设置状态
 * @param id
 * @param status
 */
module.exports.setStatus = function (id, status, cb) {

    var sql = 'UPDATE membercardtype  SET status = ? WHERE id = ?';
    db.query(sql, [status,id], function(cbData, err, rows, filelds) {

        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }

    });
}

/**
 * 设置状态
 * @param id
 * @param status
 */
module.exports.checkResidue = function (num,type, cb) {
    var sql = 'SELECT * FROM memberCard  WHERE serialNumber = ? and type=?';
    db.query(sql, [num,type], function(cbData, err, rows, filelds) {

        if (!err) {
            if (rows.length != 0) {
                cb(null, rows.length >= 1 ? true : false);
            } else {
                cb(null, false);
            }
        } else {
            cb(err);
        }

    });
}