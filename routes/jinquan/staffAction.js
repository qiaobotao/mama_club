/**
 * Created by kuanchang on 16/1/12.
 */

var laypage = require('laypage');
var service = require('../../model/service/staff');//员工Server
var shopService = require('../../model/service/shop');//门店Server
var staffLevelService = require('../../model/service/staffLevel');//员工等级Server
var attendanceTypeService = require('../../model/service/attendanceType');//考勤类型Server
var classifyService = require('../../model/service/classify');//获取子分类信息
var educationId = require('../../config').mainClassifyId.education;//学历id
var vocationalQualificationId = require('../../config').mainClassifyId.vocationalQualification;//职业资格id
var multiparty = require('multiparty');//上传文件使用
var conf = require('../../config');
/**
 * 获取员工列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res,next) {

    var currentPage = req.query.page ? req.query.page : '1';
    var name = req.query.name ? req.query.name : '';
    var serialNumber = req.query.serialNumber ? req.query.serialNumber : '';
    var tel = req.query.tel ? req.query.tel : '';
    var highestEducation = req.query.highestEducation ? req.query.highestEducation : '';//学历
    var graduationSchool = req.query.graduationSchool ? req.query.graduationSchool : '';//毕业院校
    var startJobTimeStar = req.query.startJobTimeStar ? req.query.startJobTimeStar : '';//入职开始时间
    var startJobTimeEnd = req.query.startJobTimeEnd ? req.query.startJobTimeEnd : '';//入职截止时间
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;

    service.fetchAllStaff(name,serialNumber,tel,highestEducation,graduationSchool,startJobTimeStar,startJobTimeEnd,educationId,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.serialNumber = serialNumber;
            results.tel = tel;
            results.highestEducation = highestEducation;
            results.graduationSchool = graduationSchool;
            results.startJobTimeStar = startJobTimeStar;
            results.startJobTimeEnd = startJobTimeEnd;
            res.render('staff/staffList', {data : results, replytype : replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
            });
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
module.exports.add = function (req, res,next) {
    var staff =[];
    res.render('staff/staffAdd', {staff : staff});
}
/**
 * 保存员工
 * @param req
 * @param res
 */
module.exports.save = function (req, res,next) {
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

    //员工子女信息
    var childrenName = req.body.childrenName ? req.body.childrenName : '';
    var childrenBirth = req.body.childrenBirth ? req.body.childrenBirth : '';
    var childrenSex = req.body.childrenSex ? req.body.childrenSex : '';
    var childrenRank = req.body.childrenRank ? req.body.childrenRank : '';
    // 处理子女集合数据
    var childrenArr = new Array();
    if (childrenName instanceof Array) {
        for (var i = 0; i < childrenName.length; i++) {
            var obj = {};
            obj.childrenName = childrenName[i];
            obj.childrenBirth = childrenBirth[i];
            obj.childrenSex = childrenSex[i];
            obj.childrenRank = childrenRank[i];
            childrenArr.push(obj);
        }
    } else {
        var obj = {};
        obj.childrenName = childrenName;
        obj.childrenBirth = childrenBirth;
        obj.childrenSex = childrenSex;
        obj.childrenRank = childrenRank;
        childrenArr.push(obj);
    }

    //员工合同信息
    var contractStartDate = req.body.contractStartDate ? req.body.contractStartDate : '';
    var contractEndDate = req.body.contractEndDate ? req.body.contractEndDate : '';
    var contractRemarks = req.body.contractRemarks ? req.body.contractRemarks : '';
    var contractArr = new Array();
    if (contractStartDate instanceof Array) {
        for (var i = 0; i < contractStartDate.length; i++) {
            var obj = {};
            obj.contractStartDate = contractStartDate[i];
            obj.contractEndDate = contractEndDate[i];
            obj.contractRemarks = contractRemarks[i];
            contractArr.push(obj);
        }
    } else {
        var obj = {};
        obj.contractStartDate = contractStartDate;
        obj.contractEndDate = contractEndDate;
        obj.contractRemarks = contractRemarks;
        contractArr.push(obj);
    }
    /*
    //员工职业资格信息
    var vocationalQualifications = req.body.vocationalQualifications ? req.body.vocationalQualifications : '';
    var qualificationsTime = req.body.qualificationsTime ? req.body.qualificationsTime : '';
    var qualificationsDescribe = req.body.qualificationsDescribe ? req.body.qualificationsDescribe : '';
    var qualificationsImage = req.body.qualificationsImage ? req.body.qualificationsImage : '';
    var qualificationsArr = new Array();
    if (vocationalQualifications instanceof Array) {
        for (var i = 0; i < vocationalQualifications.length; i++) {
            var obj = {};
            obj.vocationalQualifications = vocationalQualifications[i];
            obj.qualificationsTime = qualificationsTime[i];
            obj.qualificationsDescribe = qualificationsDescribe[i];
            obj.qualificationsImage = qualificationsImage[i];
            qualificationsArr.push(obj);
        }
    } else {
        var obj = {};
        obj.vocationalQualifications = vocationalQualifications;
        obj.qualificationsTime = qualificationsTime;
        obj.qualificationsDescribe = qualificationsDescribe;
        obj.qualificationsImage = qualificationsImage;
        qualificationsArr.push(obj);
    }
    */

    //  考勤周期信息
    var attendanceId = req.body.attendanceId ? req.body.attendanceId : '';//考勤类型表id
    var attendanceStartDate = req.body.attendanceStartDate ? req.body.attendanceStartDate : '';//考勤周期开始时间
    var attendanceEndDate = req.body.attendanceEndDate ? req.body.attendanceEndDate : '';//考勤周期截止时间
    var attendanceRank = req.body.attendanceRank ? req.body.attendanceRank : '';//考勤周期备注


    var attendancesArr = new Array();
    if (attendanceId instanceof Array) {
        for (var i = 0; i < attendanceId.length; i++) {
            var obj = {};
            obj.attendanceId = attendanceId[i];
            obj.attendanceStartDate = attendanceStartDate[i];
            obj.attendanceEndDate = attendanceEndDate[i];
            obj.attendanceRank = attendanceRank[i];
            obj.attendanceOrder = i;
            attendancesArr.push(obj);
        }
    } else {
        var obj = {};
        obj.attendanceId = attendanceId;
        obj.attendanceStartDate = attendanceStartDate;
        obj.attendanceEndDate = attendanceEndDate;
        obj.attendanceRank = attendanceRank;
        obj.attendanceOrder = 0;
        attendancesArr.push(obj);
    }


    if(id!=''){//修改
        //updateStaff：先update员工基本信息、删除对应的员工、合同、职业资格信息
        service.updateStaff(id,serialNumber,name,tel,idCard,birthDate,highestEducation,graduationSchool,spouseName,spouseTel,email,startJobTime,endJobTime,isJob,shopId,clockCode,remarks,staffLevel,function(err, results) {
            if(!err) {
                //添加子女信息
                service.addStaffOhter(id,childrenArr,contractArr,attendancesArr,function(err, results) {
                    if(!err) {
                        //添加子女信息
                        res.redirect('/jinquan/staff_list?replytype=update');
                    } else {
                        console.log(err.message);
                        res.render('error');
                    }
                })
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }else{//添加
        service.insertStaff(serialNumber,name,tel,idCard,birthDate,highestEducation,graduationSchool,spouseName,spouseTel,email,startJobTime,endJobTime,isJob,shopId,clockCode,remarks,staffLevel,function(err, results) {
            if(!err) {
                //添加子女信息
                service.addStaffOhter(results.insertId,childrenArr,contractArr,attendancesArr,function(err, results) {
                    if(!err) {
                        //添加子女信息
                        res.redirect('/jinquan/staff_list?replytype=add');
                    } else {
                        console.log(err.message);
                        res.render('error');
                    }
                })
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
    //根据员工id获取员工详情信息
    service.fetchSingleStaff(id, function(err, results) {
        if (!err) {
            var staff = {};
            if(results['staff'] != null){
                staff = results['staff'][0];
            }
            if(staff == null){
                staff = {};
            }
            var children = results['children'];
            var contracts = results['contracts'];
            var certificates = results['certificates'];
            var attendanceTypes = results['attendanceTypes'];
            //获取所有门店信息
            shopService.fetchShops(0,20,function(err, results) {
                if (!err) {
                    var shopList = results;
                    //获取所有员工等级
                    staffLevelService.fetchStaffLevels(function(err, results) {
                        if (!err) {
                            var staffLevelList = results;
                            //获取员工考勤
                            attendanceTypeService.fetchAttendanceTypes(0,50,function(err, results) {
                                if (!err) {
                                    var attendanceList = results;
                                    //获取学历、职业资格集合信息
                                    classifyService.getSubcollectionById(educationId,function(err,result){
                                        if (!err) {
                                            var educationArr = result;
                                            classifyService.getSubcollectionById(vocationalQualificationId,function(err,result){
                                                if (!err) {
                                                    var vocationalQualificationArr = result;
                                                    res.render('staff/staffAdd', {
                                                        staff : staff,//员工信息
                                                        shopList:shopList,//门店集合
                                                        staffLevelList:staffLevelList,//员工等级集合
                                                        children:children,//员工子女集合
                                                        contracts:contracts,//员工合同集合
                                                        attendanceTypes:attendanceTypes,//员工考勤类型集合（记录该员工历史考勤及未来考勤情况）
                                                        certificates:certificates,//员工职业资格集合
                                                        attendanceList:attendanceList,//考勤类型集合
                                                        educationList:educationArr,//学历
                                                        vocationalQualificationList:vocationalQualificationArr//职业资格
                                                    });
                                                } else {
                                                    next();
                                                }
                                            });
                                        } else {
                                            next();
                                        }
                                    });
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
        } else {
            next();
        }
    })
}

/**
 * 跳转到编辑员工资质页面
 * @param req
 * @param res
 * @param next
 */
module.exports.editQualification = function(req, res, next) {

    var index = req.query.index ? req.query.index : '';
    var staffId = req.query.staffId ? req.query.staffId : '';

    //获取职业资格类别
    classifyService.getSubcollectionById(vocationalQualificationId,function(err,result){
        if (!err) {
            var vocationalQualificationArr = result;
            res.render('staff/editQualification', {
                index:index,
                staffId:staffId,
                vocationalQualificationList:vocationalQualificationArr//职业资格
            });
        } else {
            next();
        }
    });
}

/**
 * 保存员工资质信息
 * @param req
 * @param res
 * @param next
 */
module.exports.saveQualification = function(req, res, next) {

    var staffId = req.query.staffId ? req.query.staffId : '';//员工id
    //员工职业资格信息
    var vocationalQualifications = req.query.vocationalQualifications ? req.query.vocationalQualifications : '';
    var qualificationsTime = req.query.qualificationsTime ? req.query.qualificationsTime : '';
    var qualificationsDescribe = req.query.qualificationsDescribe ? req.query.qualificationsDescribe : '';

    var form = new multiparty.Form();//将突破上传到”./public/files/staffQualifications“目录下
    form.uploadDir = conf.uploadDir.dir;
    form.parse(req, function(err, fields, files) {
        if (!err) {
            var qualificationsSrc = "",qualificationsName="";
            for(var f = 0 ; f<files.recordfile.length ; f ++){
                var inputFile = files.recordfile[f];
                qualificationsName += inputFile.originalFilename;
                qualificationsSrc += conf.uploadDir.url +  inputFile.path.substr(inputFile.path.lastIndexOf('/'),inputFile.path.length);
            }

            service.addStaffQualifications(staffId,vocationalQualifications,qualificationsSrc,qualificationsName,qualificationsDescribe,qualificationsTime,function(err, results) {
                if(!err) {
                    res.render('welcome/success',{
                        id:results.insertId,
                        staffId:staffId,
                        vocationalQualifications:vocationalQualifications,
                        qualificationsSrc:qualificationsSrc,
                        qualificationsName:qualificationsName,
                        qualificationsDescribe:qualificationsDescribe,
                        qualificationsTime:qualificationsTime
                    });
                } else {
                    console.log(err.message);
                    res.render('error');
                }
            })
        } else {
            console.log('parse error: ' + err);
            next();
        }
    });

}

/**
 * 删除员工资质信息
 * @param req
 * @param res
 * @param next
 */
module.exports.delQualification = function(req, res, next) {

    var certificatesId = req.body.certificatesId ? req.body.certificatesId : '';//职业资格id
    service.delStaffQualifications(certificatesId,function(err, results) {
        if(!err) {
            var result={} ;
            res.json(JSON.stringify(result));
        } else {
            console.log(err.message);
            res.render('error');
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
            res.redirect('/jinquan/staff_list?replytype=del');
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
    var highestEducation = req.query.highestEducation ? req.query.highestEducation : '';
    var graduationSchool = req.query.graduationSchool ? req.query.graduationSchool : '';
    var startJobTimeStar= req.query.index ? req.query.index : '';
    var startJobTimeEnd= req.query.startJobTimeEnd ? req.query.startJobTimeEnd : '';
    var educationId= req.query.educationId ? req.query.educationId : '';

    service.fetchAllStaff(name,serialNumber,tel,highestEducation,graduationSchool,startJobTimeStar,startJobTimeEnd,educationId,currentPage ,function (err, results) {

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
    var highestEducation = req.query.highestEducation ? req.query.highestEducation : '';
    var graduationSchool = req.query.graduationSchool ? req.query.graduationSchool : '';
    var startJobTimeStar= req.query.startJobTimeStar ? req.query.startJobTimeStar : '';
    var startJobTimeEnd= req.query.startJobTimeEnd ? req.query.startJobTimeEnd : '';
    var educationId= req.query.educationId ? req.query.educationId : '';

    var url = '/jinquan'+req.url;

    service.fetchAllStaff(name,serialNumber,tel,highestEducation,graduationSchool,startJobTimeStar,startJobTimeEnd,educationId,currentPage ,function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.serialNumber = serialNumber;
            results.tel = tel;
            res.render('staff/staffSelectServiceMeet', {data : results,index:index, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages})});

        } else {
            next();
        }
    });

}