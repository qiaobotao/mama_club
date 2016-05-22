
var laypage = require('laypage');
var service = require('../../model/service/membercard');
var service1 = require('../../model/service/membercardtype');
var moment = require('moment');
var consts = require('../../model/utils/consts');
/**
 * Created by wangjuan on 16/1/13.
 */

/**
 * 查询会员卡——用于会员卡收费
 * @param req
 * @param res
 * @param next
 */
module.exports.select = function (req, res, next) {
    var serialNumber = req.query.serialNumber ? req.query.serialNumber : '';
    var type = req.query.type ? req.query.type : '';
    var isActivation = req.query.isActivation ? req.query.isActivation : '';
    var currentPage = req.query.page ? req.query.page : 1;
    var index = req.query.index ? req.query.index : '';
    var url = '/jinquan'+req.url;

    service.fetchAllMemberCardBySelect(serialNumber,type,isActivation,currentPage, function (err, results) {
        if (!err) {
            results.serialNumber = serialNumber;
            results.type = type;
            results.isActivation = isActivation;
            results.currentPage = currentPage;
            res.render('memberCard/memberCardSelect', {data : results,index:index, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages})
            });
        } else {
            next();
        }
    });

}



/**
 * 获取会员卡类型列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    var parameter1= '';
    var parameter2=  '';
    var parameter3=   '';
    var parameter4=   '';
    var parameter5=   '';
    var parameter6=   '';
    var parameter7=  '';
    var parameter8=   '';
    var parameter9=   '';
    var type=  req.query.type ? req.query.type : '1';
    var serialNumber=  req.query.serialNumber ? req.query.serialNumber : '';
    var currentPage = req.query.page ? req.query.page : '1';
    currentPage =currentPage<1?1:currentPage;
    var resourcesData = req.session.user.resourcesData;
// 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    if(type=='1')
    {
        //会员卡类型
        parameter1=  req.query.parameter1 ? req.query.parameter1 : '';
        //当前金额/首次应缴费金额/首次应缴费金额
        parameter2= req.query.parameter2 ? req.query.parameter2 : '';
    }
    if(type=='2')
    {
        //可使用次数
        parameter3= req.query.parameter3 ? req.query.parameter3 : '';
        //已使用次数
        parameter4=req.query.parameter4 ? req.query.parameter4 : '';

        //首次应缴费金额
        parameter5= req.query.parameter5 ? req.query.parameter5 : '';
        //有效时间
        parameter6= req.query.parameter6 ? req.query.parameter6 : '';
    }
    if(type=='3')
    {
        //折扣力度
        parameter7= req.query.parameter7 ? req.query.parameter7 : '';
        //首次应缴费金额
        parameter8= req.query.parameter8 ? req.query.parameter8 : '';
        //有效时间
        parameter9= req.query.parameter9 ? req.query.parameter9 : '';
    }
    var status=  req.query.status ? req.query.status : '1';
    service.fetchAllMemberCard(shopId,serialNumber  ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5, parameter6 , parameter7 , parameter8, parameter9,currentPage, function (err, results) {
        if (err) {
            console.log(err.message);
            next();
        } else {
            for (var i=0;i<results.data.length;i++) {
                var dateline = results.data[i].createDate;
                if (dateline != '') {
                    var temp = moment(dateline).format('YYYY-MM-DD');
                    results.data[i].createDate = temp;
                }
            }
            service1.fetchMembercardtypeByStatus(shopId,status, function (err, datas) {
                if (!err && datas.length != 0) {
                    results.serialNumber = serialNumber;
                    results.type = type;
                    results.parameter1 = parameter1;
                    results.parameter2 = parameter2;
                    results.parameter3 = parameter3;
                    results.parameter4 = parameter4;
                    results.parameter5 = parameter5;
                    results.parameter6 = parameter6;
                    results.parameter7 = parameter7;
                    results.parameter8 = parameter8;
                    results.parameter9 = parameter9;
                    results.currentPage = currentPage;
                    res.render('memberCard/memberCardList', {memberCardTypes: datas, data: results, replytype : replytype, laypage: laypage({
                        curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
                    });
                }
                else {
                    next();
                }
            });
        }

    });
};
/**
 * 跳转新增页面
 * @param req
 * @param res
 */
module.exports.goAdd = function(req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var status=  req.query.status ? req.query.status : '1';
    var type=  req.query.type ? req.query.type : '1';

    service1.fetchMembercardtypeByStatus(shopId,status, function (err, results) {
        if (!err) {
            results.type = type;
            res.render('memberCard/memberCardAdd' , {data : results,"discountNames":consts.DISCOUNT_NAMES,"discountValues":consts.DISCOUNT_VALUES});
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
module.exports.goEdit = function(req, res,next) {
    var id = req.query.id ? req.query.id : '';
    var type = req.query.type ? req.query.type : '';
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var status=  req.query.status ? req.query.status : '1';
    service.fetchSingleMembercard(id,type, function(err, results) {
        if (!err) {
            service1.fetchMembercardtypeByStatus(shopId,status, function (err, datas) {
                if (!err && datas.length != 0) {
                    var memberCard = results.length == 0 ? null : results[0];
                    res.render('memberCard/memberCardEdit', {memberCard: memberCard, data: datas,"discountNames":consts.DISCOUNT_NAMES,"discountValues":consts.DISCOUNT_VALUES});
                }
                else {
                    next();
                }
            });
        } else {
            next();
        }
    })

};

/**
 * 增加会员卡类型
 * @param req
 * @param res
 */
module.exports.addOrEdit = function (req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    var id = req.body.id ? req.body.id : '';
    var serialNumber = req.body.memberCardNumber ? req.body.memberCardNumber : '';
    var type= req.body.type ? req.body.type : '';
    var  memberId = req.body.memberId ? req.body.memberId : '';
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
          parameter3= req.body.parameter3 ? req.body.parameter3 : '';
         //已使用次数
           parameter4=req.body.parameter4 ? req.body.parameter4 : '';

        //首次应缴费金额
           parameter5= req.body.parameter5 ? req.body.parameter5 : '';
        //有效时间
          parameter6= req.body.parameter6 ? req.body.parameter6 : '';
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
        service.insertMemberCard( shopId,serialNumber  ,createDate  ,dateline  , memberId ,type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5, parameter6 , parameter7 , parameter8, parameter9,function (err, results) {
            if (!err) {
                res.redirect('/jinquan/member_card_list?replytype=add');
            } else {
                next();
            }
        });
    }
    else
    {
        var dateline= new Date().getTime();
        service.updateMemberCard(id,serialNumber ,dateline  ,memberId ,  type , parameter1 , parameter2 , parameter3 , parameter4 , parameter5,parameter6 , parameter7 , parameter8,parameter9, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/member_card_list?replytype=update');
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
module.exports.del = function (req, res,next) {
    var id = req.query.id ? req.query.id : '';
        service.delMembercard(id, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/member_card_list?replytype=del');
            } else {
                next();
            }
        });
};
/**
 * 查看页面
 * @param req
 * @param res
 * @param next
 */
module.exports.show = function(req, res,next) {

    var id = req.query.id ? req.query.id : '';
    var type = req.query.type ? req.query.type : '';

    service.fetchSingleMembercard(id,type, function(err, results) {
        if (!err) {
            var memberCard  = results.length == 0 ? null : results[0];
            res.render('memberCard/memberCardDetail', {memberCard : memberCard});
        } else {
            next();
        }
    })
};
/**
 * 校验会员卡编码唯一性
 * @param req
 * @param res
 * @param next
 */
module.exports.checkResidue = function (req, res, next) {

    var num = req.body.memberCardNumber ? req.body.memberCardNumber : 0;
    var type = req.body.type ? req.body.type : 0;
    service.checkResidue(num,type,function (err, flag) {
        if (!err) {
            res.json({flag : flag});
        } else {
            next();
        }
    });
}