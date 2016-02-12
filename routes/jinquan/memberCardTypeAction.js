
var service = require('../../model/service/membercardtype');
/**
 * Created by kuanchang on 16/1/13.
 */
/**
 * 获取会员卡类型列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    res.render('memberCardType/memberCardTypeList');
}
/**
 * 增加员工
 * @param req
 * @param res
 */
module.exports.edit = function (req, res) {
    res.render('memberCardType/memberCardTypeEdit');
}

/**
 * 增加会员卡类型
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    var memberCardType = req.body.memberCardType ? req.body.memberCardType : '';
    var memberCardAmount = req.body.memberCardAmount ? req.body.memberCardAmount : '';
    var consumerLimit = req.body.consumerLimit ? req.body.consumerLimit : '';
    var zeroDiscounts = req.body.zeroDiscounts ? req.body.zeroDiscounts : '';
    var isManyPeopleUsed = req.body.isManyPeopleUsed ? req.body.isManyPeopleUsed : '';
    var status = req.body.status ? req.body.status : '';

    service.insertMemberCardType(memberCardType,memberCardAmount,consumerLimit,zeroDiscounts,isManyPeopleUsed,status, function (err, results) {
        if (!err) {
            results.memberCardType = memberCardType;
            results.memberCardAmount = memberCardAmount;
            results.consumerLimit = consumerLimit;
            results.zeroDiscounts = zeroDiscounts;
            results.isManyPeopleUsed = isManyPeopleUsed;
            results.status = status;
            res.render('memberCardType/memberCardTypeList', {data : results});
        } else {
            console.log(err.message);
            res.render('error', {error : err});
        }
    });
}