/**
 * Created by kuanchang on 16/1/7.
 */
/**
 * 获取教室列表
 * @param req
 * @param res
 */
var laypage = require('laypage');
var service = require('../../model/service/classroom');

var storeroomService = require('../../model/service/storeroom');
var sotreroomOutService = require('../../model/service/storeroomOut');
var myUtils = require('../../common/utils');

module.exports.list = function (req, res,next) {

    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    var currentPage = req.query.page ? req.query.page : '1';
    var classRoomName = req.query.classRoomName ? req.query.classRoomName : '';
    var classRoomCode = req.query.classRoomCode ? req.query.classRoomCode : '';

    var url = '/jinquan'+req.url;
    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';

    var resourcesData = req.session.user.resourcesData;
    service.fetchAllCLassRoom(shopId,classRoomName,classRoomCode,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.classRoomName = classRoomName;
            results.classRoomCode = classRoomCode;
            res.render('classroom/classroomList', {data : results, replytype : replytype,laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData});
        } else {
            myUtils.printSystemLog(err);
            next();
        }
    });

};

/**
 * 跳转心中页面教室
 * @param req
 * @param res
 */
module.exports.preAdd = function (req, res,next) {

    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    service.getClassroomClassify(function (err, results) {
        if (!err) {
            var data = {};
            data.classify = results;
            storeroomService.getAllStorerooms(shopId,function(err, results) {
                if (!err) {
                    data.storeroom = results;
                    res.render('classroom/classroomAdd', {data : data});
                } else {
                    console.log(err);
                    next();
                }
            });
        } else {
            myUtils.printSystemLog(err);
            next();
        }
    });
};
/**
 * 添加
 * @param req
 * @param res
 */
module.exports.Add = function (req, res,next) {

    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    var serialNumber = req.body.serialNumber ? req.body.serialNumber : '';
    var name = req.body.name ? req.body.name : '';
    var classType = req.body.cid ? req.body.cid : '';
    var remark = req.body.remark ? req.body.remark : '';
    var oper = req.body.oper ? req.body.oper : ''; // 操作人

    // 数组
    var arr_proId = req.body.proId ? req.body.proId : '';
    var arr_proname = req.body.proname ? req.body.proname :'';
    var arr_proNo = req.body.proNo ? req.body.proNo : '';
    var arr_count = req.body.count ? req.body.count : '';
    var arr_bname = req.body.price ? req.body.price : '';
    var arr_storeroomId = req.body.sids ? req.body.sids : '';

    // 处理数据
    var arr = new Array();

    if (arr_proId instanceof Array) {
        for (var i=0;i<arr_proId.length;i++) {
            var obj = {};
            obj.proId = arr_proId[i];
            obj.proName = arr_proname[i];
            obj.proSerial = arr_proNo[i];
            obj.count = arr_count[i];
            obj.bname = arr_bname[i];
            obj.storeroom = arr_storeroomId[i];
            arr.push(obj);
        }
    } else {
        var obj = {};
        obj.proId = arr_proId;
        obj.proName = arr_proname;
        obj.proSerial = arr_proNo;
        obj.count = arr_count;
        obj.bname = arr_bname;
        obj.storeroom = arr_storeroomId;
        arr.push(obj);
    }

    // 添加教室，首先要添加教室的表头和教室物资明细
    // 然后形成出库单，从多个库中选择商品，涉及多少个仓库就形成多少个出库单

    storeroomService.getAllStorerooms(shopId,function(err, results) { // 查出所有仓库，然后跟传上来的仓库对比，
        if (!err) {
           var arr_total = new Array(); // 数据结构 [{storeroomId,[obj,obj,obj]},{storeroomId,[obj,obj,obj]}.....]
           for (var i=0;i<results.length;i++) { // 处理仓库结果集
               var sameStoreroom_obj = {}; // 相同storeroomId 对象
               var arr_obj = new Array();
               sameStoreroom_obj.storeroomId = results[i].id;
               for (var n=0;n<arr.length;n++) {
                   if (results[i].id == arr[n].storeroom) {
                       arr_obj.push(arr[n]);
                   }
               }
               sameStoreroom_obj.data = arr_obj;
               arr_total.push(sameStoreroom_obj);
           }
            // arr_total 有多少个结果，就生成多少个出库单

            service.insertClassroom(shopId, serialNumber,name,classType,remark,oper,function(err, results) {

                if (!err) {
                    var classroomId = results.insertId; // 新增教室的iD
                    // 插入明细表
                    service.insertClassroomMX(classroomId,arr,function(err, results) {
                        if (!err) {
                            // 形成出库单 ,及库存变化
                            sotreroomOutService.addClassroom_AddOutLog(name,classroomId,arr_total,function(err, results) {
                                if (!err) {
                                    res.redirect('/jinquan/classroom_list?replytype=add');
                                } else {
                                    myUtils.printSystemLog(err);
                                    next();
                                }
                            });
                        } else {
                            myUtils.printSystemLog(err);
                            next();
                        }
                    });
                } else {
                    myUtils.printSystemLog(err);
                    next();
                }
            });
        } else {
            myUtils.printSystemLog(err);
            next();
        }
    });
};

module.exports.set = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';
    var type = req.query.type ? req.query.type : '';

    service.setClassroomStatus(id, type, function (err, results) {

        if (!err) {
            res.redirect('/jinquan/classroom_list');
        } else {
            myUtils.printSystemLog(err);
            next();
        }
    })
}

module.exports.detail = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.detail(id,function(err, results) {

        if (!err) {

            res.render('classroom/classroomDetail', {data : results});

        } else {
            myUtils.printSystemLog(err);
            next();
        }
    });
}

module.exports.checkSeril = function (req, res, next) {

    var seril = req.body.serial ? req.body.serial : '';
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    service.checkSeril(shopId,seril,function(err, results) {
        if (!err) {
            res.json({flag:results});
        } else {
            myUtils.printSystemLog(err);
            next();
        }
    });

}

module.exports.checkName = function (req, res, next) {

    var name = req.body.name ? req.body.name : '';
    // 从session 中获取门店id
    var shopId = req.session.user.shopId;

    service.checkName(shopId,name,function (err, results) {
        if (!err) {
            res.json({flag:results});
        } else {
            myUtils.printSystemLog(err);
            next();
        }
    })
}

module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';
    var shopId = req.session.user.shopId;

    service.preEdit(id,function(err, results) {
        if(!err) {
            storeroomService.getAllStorerooms(shopId,function(err, storeroomResult) {
                if (!err) {
                    service.getClassroomClassify(function(err, classroomClassfiy) {
                        if (!err) {
                            res.render('classroom/classroomEdit',{data : results,storeroomData:storeroomResult,classify:classroomClassfiy});
                        } else {
                            myUtils.printSystemLog(err);
                            next();
                        }
                    })
                } else {
                    myUtils.printSystemLog(err);
                    next();
                }
            });
        }else {
            myUtils.printSystemLog(err);
            next();
        }
    });
}

/**
 * 如果教室里有物品是不能删除的
 * @param req
 * @param res
 * @param next
 */
module.exports.checkdel = function(req, res, next) {

    var id = req.body.id ? req.body.id : '';

    service.checkDel(id,function(err, flag) {
        if(!err) {
            res.json({flag:flag});
        } else {
            myUtils.printSystemLog(err);
            next();
        }
    });
}

module.exports.del = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';
    var shopId = req.session.user.shopId;

    service.del(id,shopId,function(err, results){
         if(!err) {
            res.redirect('/jinquan/classroom_list?replytype=del');
         } else {
             myUtils.printSystemLog(err);
             next();
         }
    });
}


module.exports.update = function(req, res, next) {

    // 从session 中获取门店id
    var shopId = req.session.user.shopId;
    // 先判断是删除还是添加物资
    var sub_type = req.body.sub_type ? req.body.sub_type : ''; // 请求方式


    // 主表数据
    var id = req.body.id ? req.body.id : '';   // 教室id
    var name = req.body.name ? req.body.name : ''; // 名称
    var classType = req.body.cid ? req.body.cid : '';
    var remark = req.body.remark ? req.body.remark : '';
    var oper = req.body.oper ? req.body.oper : ''; // 操作人

    service.updateClassroom(id,shopId,name,classType,remark,oper,function(err,results){
        if (!err) {
            if (sub_type == "del") {  // 删除物资
                myUtils.printSystemLog("删除物资开始--------------");
                // 入库库房
                var d_sid = req.body.d_sid ? req.body.d_sid : '';
                // 删除数据 proid , 如果选中了一个也要变成数组
                var delProId = req.body.delProId ? req.body.delProId : '';
                var arr_delProId = new Array();
                if(!delProId instanceof Array) {
                    arr_delProId.push(delProId);
                } else {
                    arr_delProId = delProId;
                }

                service.inStoreroomForDelWares(id,oper,d_sid,arr_delProId,function(err, results) {
                    if(!err) {

                        res.redirect('/jinquan/classroom_list?replytype=update');

                    } else {
                        myUtils.printSystemLog(err);
                        next();
                    }
                });
            } else if (sub_type == "add") { // 添加物资
                myUtils.printSystemLog("添加物资开始--------------");

                // 数组
                var arr_proId = req.body.proId ? req.body.proId : '';
                var arr_proname = req.body.proname ? req.body.proname :'';
                var arr_proNo = req.body.proNo ? req.body.proNo : '';
                var arr_count = req.body.count ? req.body.count : '';
                var arr_price = req.body.price ? req.body.price : '';
                var arr_sids = req.body.sids ? req.body.sids : '';

                // 处理数据
                var arr = new Array();

                if (arr_proId instanceof Array) {
                    for (var i=0;i<arr_proId.length;i++) {
                        var obj = {};
                        obj.proId = arr_proId[i];
                        obj.proName = arr_proname[i];
                        obj.proSerial = arr_proNo[i];
                        obj.count = arr_count[i];
                        obj.bname = arr_price[i];
                        obj.storeroom = arr_sids[i];
                        arr.push(obj);
                    }
                } else {
                    var obj = {};
                    obj.proId = arr_proId;
                    obj.proName = arr_proname;
                    obj.proSerial = arr_proNo;
                    obj.count = arr_count;
                    obj.bname = arr_price;
                    obj.storeroom = arr_sids
                    arr.push(obj);
                }

                storeroomService.getAllStorerooms(shopId,function(err, results) { // 查出所有仓库，然后跟传上来的仓库对比，
                    if (!err) {
                        var arr_total = new Array(); // 数据结构 [{storeroomId,[obj,obj,obj]},{storeroomId,[obj,obj,obj]}.....]
                        for (var i=0;i<results.length;i++) { // 处理仓库结果集
                            var sameStoreroom_obj = {}; // 相同storeroomId 对象
                            var arr_obj = new Array();
                            sameStoreroom_obj.storeroomId = results[i].id;
                            for (var n=0;n<arr.length;n++) {
                                if (results[i].id == arr[n].storeroom) {
                                    arr_obj.push(arr[n]);
                                }
                            }
                            sameStoreroom_obj.data = arr_obj;
                            arr_total.push(sameStoreroom_obj);
                        }
                        // arr_total 有多少个结果，就生成多少个出库单

                                // 插入明细表
                        service.insertClassroomMX(id,arr,function(err, results) {
                            if (!err) {
                                  // 形成出库单 ,及库存变化
                                sotreroomOutService.addClassroom_AddOutLog(name,id,arr_total,function(err, results) {
                                    if (!err) {
                                        res.redirect('/jinquan/classroom_list?replytype=update');
                                    } else {
                                        myUtils.printSystemLog(err);
                                        next();
                                    }
                                });
                            } else {
                                myUtils.printSystemLog(err);
                                next();
                            }
                        });
                    } else {
                        myUtils.printSystemLog(err);
                        next();
                    }
                });
            }
        } else {
            myUtils.printSystemLog(err);
            next();
        }
    });
}


