/**
 * Created by kuanchang on 16/1/12.
 */

var service = require('../../model/service/staff');
var shopService = require('../../model/service/shop');
var staffLevelService = require('../../model/service/staffLevel');
/**
 * 获取员工列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {

    var currentPage = req.query.page ? req.query.page : '1';
    var name = req.query.name ? req.query.name : '';
    var serialNumber = req.query.serialNumber ? req.query.serialNumber : '';
    var tel = req.query.tel ? req.query.tel : '';

    service.fetchAllStaff(name,serialNumber,tel,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.serialNumber = serialNumber;
            results.tel = tel;
            res.render('staff/staffList', {data : results});
        } else {
            next();
        }
    });
}
/**
 * 进入添加员工页面
 * @param req
 * @param res
 */
module.exports.add = function (req, res) {
    var staff =[];
    res.render('staff/staffAdd', {staff : staff});
}
/**
 * 保存员工
 * @param req
 * @param res
 */
module.exports.save = function (req, res) {
    var id = req.body.id ? req.body.id : '';
    var name = req.body.name ? req.body.name : '';
    var serialNumber = req.body.serialNumber ? req.body.serialNumber : '';
    var tel = req.body.tel ? req.body.tel : '';
    var idCard = req.body.idCard ? req.body.idCard : '';
    var birthDate = req.body.birthDate ? req.body.birthDate : '';
    var highestEducation = req.body.highestEducation ? req.body.highestEducation : '';
    var graduationSchool = req.body.graduationSchool ? req.body.graduationSchool : '';
    var spouseName = req.body.spouseName ? req.body.spouseName : '';
    var spouseTel = req.body.spouseTel ? req.body.spouseTel : '';
    var email = req.body.email ? req.body.email : '';
    var startJobTime = req.body.startJobTime ? req.body.startJobTime : '';
    var endJobTime = req.body.endJobTime ? req.body.endJobTime : '';
    var isJob = req.body.isJob ? req.body.isJob : '';
    var shopId = req.body.shopId ? req.body.shopId : '';
    var clockCode = req.body.clockCode ? req.body.clockCode : '';
    var remarks = req.body.remarks ? req.body.remarks : '';
    var staffLevel = req.body.staffLevel ? req.body.staffLevel : '';

    if(id!=''){//修改
        service.updateStaff(id,serialNumber,name,tel,idCard,birthDate,highestEducation,graduationSchool,spouseName,spouseTel,email,startJobTime,endJobTime,isJob,shopId,clockCode,remarks,staffLevel,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/staff_list');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }else{//添加
        service.insertStaff(serialNumber,name,tel,idCard,birthDate,highestEducation,graduationSchool,spouseName,spouseTel,email,startJobTime,endJobTime,isJob,shopId,clockCode,remarks,staffLevel,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/staff_list');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }

}
/**
 * 修改
 * @param req
 * @param res
 */
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.fetchSingleStaff(id, function(err, results) {
        if (!err) {
            var staff = results.length == 0 ? null : results[0];
            if(staff == null){
                staff = {};
            }
            shopService.fetchShops(0,20,function(err, results) {
                if (!err) {
                    var shopList = results;
                    staffLevelService.fetchStaffLevels(function(err, results) {
                        if (!err) {
                            var staffLevelList = results;
                            res.render('staff/staffAdd', {staff : staff,shopList:shopList,staffLevelList:staffLevelList});
                        } else {
                            next();
                        }
                    })
                } else {
                    next();
                }
            })
        } else {
            next();
        }
    })
}

/**
 * 删除员工
 * @param req
 * @param res
 */
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delStaff(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/staff_list');
        } else {
            next();
        }
    });

}

/**
 * 弹出层，选择用户时，使用
 * @param req
 * @param res
 * @param next
 */
module.exports.selectForTrain = function (req, res, next) {

    var currentPage = req.query.page ? req.query.page : '1';
    var name = req.query.name ? req.query.name : '';
    var serialNumber = req.query.serialNumber ? req.query.serialNumber : '';
    var tel = req.query.tel ? req.query.tel : '';
    var index = req.query.index ? req.query.index : '';

    service.fetchAllStaff(name,serialNumber,tel,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.serialNumber = serialNumber;
            results.tel = tel;
            res.render('staff/staffSelectTrain', {data : results,index:index});
        } else {
            next();
        }
    });

}
module.exports.selectForServiceMeet = function (req, res, next) {

    var currentPage = req.query.page ? req.query.page : '1';
    var name = req.query.name ? req.query.name : '';
    var serialNumber = req.query.serialNumber ? req.query.serialNumber : '';
    var tel = req.query.tel ? req.query.tel : '';
    var index = req.query.index ? req.query.index : '';

    service.fetchAllStaff(name,serialNumber,tel,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.serialNumber = serialNumber;
            results.tel = tel;
            res.render('staff/staffSelectServiceMeet', {data : results,index:index});
        } else {
            next();
        }
    });

}