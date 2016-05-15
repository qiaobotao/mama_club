/**
 * Created by kuanchang on 16/1/21.
 */

var laypage = require('laypage');
var service = require('../../model/service/sysResources');
var menuService = require('../../model/service/sysMenu');
/**
 * 获取资源列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res,next) {
    var currentPage = req.query.page ? req.query.page : '1';
    var textCh = req.query.textCh ? req.query.textCh : '';
    var menuId = req.query.menuId ? req.query.menuId : '';

    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;

    service.fetchAllSysResources(textCh,menuId,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.textCh = textCh;
            results.menuId = menuId;
            menuService.fetchSysMenus(0,100,function(err, menuResults) {
                if(!err) {
                    res.render('sysResources/sysResourcesList', {data : results, replytype : replytype, laypage: laypage({
                        curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData,menus:menuResults
                    });
                } else {
                    console.log(err.message);
                    res.render('error');
                }
            })
        } else {
            next();
        }
    });
}


/**
 * 跳转到编辑资源页面
 * @param req
 * @param res
 */
module.exports.edit = function (req, res,next) {
    var id = req.query.id ? req.query.id : '';
    var show = req.query.show ? req.query.show : '';
    if(id == ''){
        var sysResources = [];//系统资源
        //获取所有菜单数据
        menuService.fetchSysMenus(0,100,function(err, results) {
            if(!err) {
                res.render('sysResources/sysResourcesAdd', {data : sysResources,show:show,menus:results});
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }else{
        service.fetchSingleSysResources(id, function(err, results) {
            if (!err) {
                var sysResources = results.length == 0 ? null : results[0];
                //res.render('sysResources/sysResourcesAdd', {data : sysResources,show:show});
                //获取所有菜单数据
                menuService.fetchSysMenus(0,20,function(err, results) {
                    if(!err) {
                        res.render('sysResources/sysResourcesAdd', {data : sysResources,show:show,menus:results});
                    } else {
                        console.log(err.message);
                        res.render('error');
                    }
                })
            } else {
                next();
            }
        })
    }
}
/**
 * 保存资源
 * @param req
 * @param res
 */
module.exports.save = function (req, res,next) {
    var id = req.body.id ? req.body.id : '';
    var textCh = req.body.textCh ? req.body.textCh : '';
    var textEn = req.body.textEn ? req.body.textEn : '';
    var menuId = req.body.menuId ? req.body.menuId : '';
    var orderId = req.body.orderId ? req.body.orderId : '';
    var url = req.body.url ? req.body.url : '';

    if(id!=''){//修改
        service.updateSysResources(id,textCh,textEn,menuId,orderId,url,function(err, results) {
            if(!err) {
                //获取
                res.redirect('/jinquan/sys_resources_list?replytype=update');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }else{//添加
        service.insertSysResources(textCh,textEn,menuId,orderId,url,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/sys_resources_list?replytype=add');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }
}

/**
 * 删除资源
 * @param id
 * @param cb
 */
module.exports.del = function (req, res, next) {
    var id = req.query.id ? req.query.id :'';
    service.delSysResources(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/sys_resources_list?replytype=del');
        } else {
            next();
        }
    });

}