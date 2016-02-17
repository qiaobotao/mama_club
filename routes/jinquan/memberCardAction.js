
var service = require('../../model/service/membercard');
/**
 * Created by kuanchang on 16/1/13.
 */
/**
 * 获取会员卡类型列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {

    var memberCardType = req.query.memberCardType ? req.query.memberCardType : '';
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
            res.render('error', {error : err});
        }
    });
};
/**
 * 修改
 * @param req
 * @param res
 */
module.exports.goAdd = function(req, res) {

    res.render('memberCard/memberCardAdd' );

};

/**
 * 修改
 * @param req
 * @param res
 */
module.exports.goEdit = function(req, res) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleMembercard(id, function(err, results) {
        if (!err) {
            var memberCardType = results.length == 0 ? null : results[0];

            res.render('memberCard/memberCardEdit', {memberCardType : memberCardType});


        } else {
            console.log(err.message);
            res.render('error', {message : err});
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
    var memberCardType = req.body.memberCardType ? req.body.memberCardType : '';
    var memberCardAmount = req.body.memberCardAmount ? req.body.memberCardAmount : '';
    var consumerLimit = req.body.consumerLimit ? req.body.consumerLimit : '';
    var zeroDiscounts = req.body.zeroDiscounts ? req.body.zeroDiscounts : '';
    var isManyPeopleUsed = req.body.isManyPeopleUsed ? req.body.isManyPeopleUsed : '';
    var status = req.body.status ? req.body.status : '';
    if(id=='')
    {
        service.insertMemberCard(memberCardType,memberCardAmount,consumerLimit,zeroDiscounts,isManyPeopleUsed,status, function (err, results) {
            if (!err) {
                /*results.memberCardType = memberCardType;
                 results.memberCardAmount = memberCardAmount;
                 results.consumerLimit = consumerLimit;
                 results.zeroDiscounts = zeroDiscounts;
                 results.isManyPeopleUsed = isManyPeopleUsed;
                 results.status = status;
                 res.render('memberCardType/memberCardTypeList', {data : results});*/
                var memberCardType = '';
                var memberCardAmount = '';
                var zeroDiscounts = '';
                var page = 1;

                service.fetchAllMemberCard(memberCardType,memberCardAmount,zeroDiscounts,page, function (err, results) {
                    if (!err) {
                        results.memberCardType = memberCardType;
                        results.memberCardAmount = memberCardAmount;
                        results.zeroDiscounts = zeroDiscounts;
                        res.render('memberCard/memberCardList', {data : results});
                    } else {
                        console.log(err.message);
                        res.render('error', {error : err});
                    }
                });
            } else {
                console.log(err.message);
                res.render('error', {error : err});
            }
        });
    }
    else
    {
        service.updateMemberCard(id,memberCardType,memberCardAmount,consumerLimit,zeroDiscounts,isManyPeopleUsed,status, function (err, results) {
            if (!err) {
                var memberCardType = '';
                var memberCardAmount = '';
                var zeroDiscounts = '';
                var page = 1;

                service.fetchAllMemberCard(memberCardType,memberCardAmount,zeroDiscounts,page, function (err, results) {
                    if (!err) {
                        results.memberCardType = memberCardType;
                        results.memberCardAmount = memberCardAmount;
                        results.zeroDiscounts = zeroDiscounts;
                        res.render('memberCard/memberCardList', {data : results});
                    } else {
                        console.log(err.message);
                        res.render('error', {error : err});
                    }
                });
            } else {
                console.log(err.message);
                res.render('error', {error : err});
            }
        });
    }

};


/**
 * 增加员工
 * @param req
 * @param res
 */
module.exports.del = function (req, res) {
    var id = req.query.id ? req.query.id : '';
    if(id!=''){
        service.delMembercardtype(id, function (err, results) {
            if (!err) {

                var memberCardType = '';
                var memberCardAmount = '';
                var zeroDiscounts = '';
                var page = 1;

                service.fetchAllMemberCard(memberCardType,memberCardAmount,zeroDiscounts,page, function (err, results) {
                    if (!err) {
                        results.memberCardType = memberCardType;
                        results.memberCardAmount = memberCardAmount;
                        results.zeroDiscounts = zeroDiscounts;
                        res.render('memberCard/memberCardList', {data : results});
                    } else {
                        console.log(err.message);
                        res.render('error', {error : err});
                    }
                });
            } else {
                console.log(err.message);
                res.render('error', {error: err});
            }
        });
    }
}
