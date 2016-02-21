
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
    var parameter2=  '';
    var parameter3=   '';
    var parameter4=   '';
    var parameter5=   '';
    var parameter6=   '';
    var parameter7=  '';
    var parameter8=   '';
    var parameter9=   '';
    if(type=='1')
    {
        //会员卡类型
          parameter1=  req.body.parameter1 ? req.body.parameter1 : '';
        //当前金额/首次应缴费金额/首次应缴费金额
          parameter2= req.body.parameter2 ? req.body.parameter2 : '';
    }
    if(type=='2')
    {
       //可使用次数
        var parameter3= req.body.parameter3 ? req.body.parameter3 : '';
         //已使用次数
        var  parameter4=req.body.parameter4 ? req.body.parameter4 : '';

        //首次应缴费金额
        var  parameter5= req.body.parameter5 ? req.body.parameter5 : '';
        //有效时间
        var parameter6= req.body.parameter6 ? req.body.parameter6 : '';
    }
    if(type=='3')
    {
        //折扣力度
          parameter7= req.body.parameter7 ? req.body.parameter7 : '';
        //首次应缴费金额
          parameter8= req.body.parameter8 ? req.body.parameter8 : '';
        //有效时间
          parameter9= req.body.parameter9 ? req.body.parameter9 : '';
    }
    if(id=='')
    {
        var createDate= new Date().getTime();
        var dateline= new Date().getTime();
        service.insertMemberCard( serialNumber  ,createDate  ,dateline  ,memberId ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5, parameter6 , parameter7 , parameter8, parameter9,function (err, results) {
            if (!err) {
                res.redirect('/jinquan/member_card_list');
            } else {
                next();
            }
        });
    }
    else
    {
        service.updateMemberCard(id,serialNumber  ,createDate  ,dateline  ,memberId ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5,parameter6 , parameter7 , parameter8,parameter9, function (err, results) {
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
