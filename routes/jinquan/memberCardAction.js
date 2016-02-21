
var service = require('../../model/service/membercard');
var service1 = require('../../model/service/membercardType');
/**
 * Created by wangjuan on 16/1/13.
 */
/**
 * 获取会员卡类型列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {

    var memberCardType = req.query.memberCardType ? req.query.memberCardType : '1';
    var memberCardAmount = req.query.memberCardAmount ? req.query.memberCardAmount : '';
    var zeroDiscounts = req.query.zeroDiscounts ? req.query.zeroDiscounts : '';
    var page = 1;

    service.fetchAllMemberCard(memberCardType,memberCardAmount,zeroDiscounts,page, function (err, results) {
        if (!err) {
            results.memberCardType = memberCardType;
            results.memberCardAmount = memberCardAmount;
            results.zeroDiscounts = zeroDiscounts;
            res.render('memberCard/memberCardList', {data : results});
        } else {
            console.log(err.message);
            next();
        }
    });
};
/**
 * 跳转新增页面
 * @param req
 * @param res
 */
module.exports.goAdd = function(req, res) {

    var status ="0";
    service1.fetchMembercardtypeByStatus(status, function (err, results) {
        if (!err) {
            res.render('memberCard/memberCardAdd' , {data : results});
        } else {
            console.log(err.message);
            next();
        }
    });
};

/**
 * 跳转修改页面
 * @param req
 * @param res
 */
module.exports.goEdit = function(req, res) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleMembercard(id, function(err, results) {
        if (!err) {
            var memberCard  = results.length == 0 ? null : results[0];
            res.render('memberCard/memberCardEdit', {memberCard : memberCard});

        } else {
            console.log(err.message);
            next();
        }
    })
};

/**
 * 增加会员卡类型
 * @param req
 * @param res
 */
module.exports.addOrEdit = function (req, res) {
    var id = req.body.id ? req.body.id : '';
    var serialNumber = req.body.memberCardNumber ? req.body.memberCardNumber : '';
    var memberId= req.body.memberId ? req.body.memberId : '';
    var type= req.body.type ? req.body.type : '';
    var parameter1= '';
    var parameter2= '';
    var parameter3= '';
    var parameter4= '';
    var parameter5= '';
    if(type=='1')
    {
        //会员卡类型
          parameter1= req.body.memberCardTypeId ? req.body.memberCardTypeId : '';
        //当前金额/首次应缴费金额/首次应缴费金额
          parameter2= req.body.currentAmount ? req.body.currentAmount : '';
    }
    if(type=='2')
    {
        var parameter3= req.body.canUseTimes ? req.body.canUseTimes : '';
        //已使用次数
        var  parameter4= req.body.usedTimes ? req.body.usedTimes : '';
        //有效时间/有效时间
        var  parameter5= req.body.effectiveTime ? req.body.effectiveTime : '';
    }
    if(type=='3')
    {
        parameter2=req.body.firstPaymentAmount3?req.body.firstPaymentAmount3:'';
        //可使用次数/折扣力度
        var parameter3= req.body.discountIntensity ? req.body.discountIntensity : '';
        //有效时间/有效时间
        var  parameter5= req.body.effectiveTime3 ? req.body.effectiveTime3 : '';
    }
    if(id=='')
    {
        var createDate= new Date().getTime();
        var dateline= new Date().getTime();
        service.insertMemberCard( serialNumber  ,createDate  ,dateline  ,memberId ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/member_card_list');
            } else {
                next();
            }
        });
    }
    else
    {
        service.updateMemberCard(id,serialNumber  ,createDate  ,dateline  ,memberId ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/member_card_list');
            } else {
                next();
            }
        });
    }

};


/**
 * 删除会员卡
 * * @param req
 * @param res
 */
module.exports.del = function (req, res) {
    var id = req.query.id ? req.query.id : '';
    if(id!=''){
        service.delMembercardtype(id, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/member_card_list');
            } else {
                next();
            }
        });
    }
}
