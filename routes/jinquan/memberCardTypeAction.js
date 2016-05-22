
var laypage = require('laypage');
var service = require('../../model/service/membercardtype');
var consts = require('../../model/utils/consts');
/**
 * Created by wangjuan on 16/2/21.
 */
/**
 * 获取会员卡类型列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    var memberCardType = req.query.memberCardType ? req.query.memberCardType : '';
    var memberCardAmount = req.query.memberCardAmount ? req.query.memberCardAmount : '';
    var zeroDiscounts = req.query.zeroDiscounts ? req.query.zeroDiscounts : '';
    var currentPage = req.query.page ? req.query.page : '1';
    currentPage =currentPage<1?1:currentPage;
// 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;

    service.fetchAllMemberCardType(shopId,memberCardType,memberCardAmount,zeroDiscounts,currentPage, function (err, results) {
        if (!err) {
            results.memberCardType = memberCardType;
            results.memberCardAmount = memberCardAmount;
            results.zeroDiscounts = zeroDiscounts;
            results.currentPage = currentPage;
            res.render('memberCardType/memberCardTypeList', {data : results, replytype : replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
            });
        } else {
            console.log(err.message);
            next();
        }
    });
};
/**
 * 修改
 * @param req
 * @param res
 */
module.exports.goAdd = function(req, res,next) {
    res.render('memberCardType/memberCardTypeAdd',{"discountNames":consts.DISCOUNT_NAMES,"discountValues":consts.DISCOUNT_VALUES});

};

/**
 * 修改
 * @param req
 * @param res
 */
module.exports.goEdit = function(req, res,next) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleMembercardtype(id, function(err, results) {
        if (!err) {
            var memberCardType = results.length == 0 ? null : results[0];
            res.render('memberCardType/memberCardTypeEdit', {memberCardType : memberCardType,"discountNames":consts.DISCOUNT_NAMES,"discountValues":consts.DISCOUNT_VALUES});
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
module.exports.addOrEdit = function (req, res,next) {
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;



    var id = req.body.id ? req.body.id : '';
    var memberCardType = req.body.memberCardType ? req.body.memberCardType : '';
    var memberCardAmount = req.body.memberCardAmount ? req.body.memberCardAmount : '';
    var consumerLimit = req.body.consumerLimit ? req.body.consumerLimit : '';
    var zeroDiscounts = req.body.zeroDiscounts ? req.body.zeroDiscounts : '';
    var isManyPeopleUsed = req.body.isManyPeopleUsed ? req.body.isManyPeopleUsed : '';
    var status = req.body.status ? req.body.status : '1';
    if(id=='')
    {
        service.insertMemberCardType(shopId,memberCardType,memberCardAmount,consumerLimit,zeroDiscounts,isManyPeopleUsed,status, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/member_card_type_list?replytype=add');
            } else {
                next();
            }
        });
    }
    else
    {
        service.updateMemberCardType(id,memberCardType,memberCardAmount,consumerLimit,zeroDiscounts,isManyPeopleUsed,status, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/member_card_type_list?replytype=update');
            } else {
                next();
            }
        });
    }

};

module.exports.getMemberCartTypeById = function (req, res,next) {
    var id = req.body.memberCardTypeId ? req.body.memberCardTypeId : '';
    service.fetchSingleMembercardtype(id, function(err, results) {
        if (!err) {
            var memberCardType = results.length == 0 ? null : results[0];
            res.json(JSON.stringify(memberCardType));
        } else {
            console.log(err.message);
            next();
        }
    })
}
/**
 * 增加员工
 * @param req
 * @param res
 */
module.exports.del = function (req, res,next) {
    var id = req.query.id ? req.query.id : '';
    if(id!=''){
        service.delMembercardtype(id, function (err, results) {
            if (!err) {
                res.redirect('/jinquan/member_card_type_list?replytype=del');
            } else {
                next();
            }
        });
    }
}
