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
            console.log(err);
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
    var sid = req.body.sid ? req.body.sid : '';  // 库房id
    var oper = req.body.oper ? req.body.oper : ''; // 操作人

    // 数组
    var arr_proId = req.body.proId ? req.body.proId : '';
    var arr_proname = req.body.proname ? req.body.proname :'';
    var arr_proNo = req.body.proNo ? req.body.proNo : '';
    var arr_count = req.body.count ? req.body.count : '';
    var arr_price = req.body.price ? req.body.price : '';

    // 处理数据
    var arr = new Array();

    if (arr_proId instanceof Array) {
        for (var i=0;i<arr_proId.length;i++) {
            var obj = {};
            obj.proId = arr_proId[i];
            obj.proName = arr_proname[i];
            obj.proSerial = arr_proNo[i];
            obj.count = arr_count[i];
            obj.price = arr_price[i];
            arr.push(obj);
        }
    } else {
        var obj = {};
        obj.proId = arr_proId;
        obj.proName = arr_proname;
        obj.proSerial = arr_proNo;
        obj.count = arr_count;
        obj.price = arr_price;
        arr.push(obj);
    }

    sotreroomOutService.addClassroom(sid,oper,arr,function(err, mid) {
        if (!err) {

            service.insertClassroom(shopId,serialNumber,name,classType,remark,mid,function(err, results) {
                if(!err) {
                    res.redirect('/jinquan/classroom_list?replytype=add');
                } else {
                    console.log(err);
                    next();
                }
            })
        } else {
            console.log(err);
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
            next();
        }
    })
}

//module.exports.preEdit = function(req, res, next) {
//
//    var id = req.query.id ? req.query.id : '';
//
//
//}

module.exports.preDel = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    var shopId = req.session.user.shopId;

    storeroomService.getAllStorerooms(shopId,function(err, storerooms){
        var data = {};
        data.id = id;
        if(!err) {
            data.storerooms = storerooms;
            service.preDel(id,shopId,function(err, results) {
               if (!err) {
                   data.detail = results;
                   res.render('classroom/classroomDel', {data : data});
               } else {
                   console.log(err);
                   next();
               }
            })
        } else {
            console.log(err);
            next();
        }
    });
}

module.exports.del = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';
    var sid = req.query.sid ? req.query.sid : '';
    var shopId = req.session.user.shopId;
    var userName = req.session.user.userName;

    service.del(id,sid,shopId,userName,function(err, results){
         if(!err) {
            res.redirect('/jinquan/classroom_list?replytype=del');
         } else {
             console.log(err);
             next();
         }
    });
}


