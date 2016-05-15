/**
 * Created by kuanchang on 16/1/21.
 * 角色管理
 */

var laypage = require('laypage');
var service = require('../../model/service/sysRole');
var menuService = require('../../model/service/sysMenu');
var resourcesService = require('../../model/service/sysResources');
var sysUserService = require('../../model/service/sysUser');

/**
 * 获取角色列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res,next) {

    var currentPage = req.query.page ? req.query.page : '1';
    var name = req.query.name ? req.query.name : '';

    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;

    service.fetchAllSysRole(name,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            res.render('sysRole/sysRoleList', {data : results, replytype : replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
            });
        } else {
            next();
        }
    });
}



/**
 * 跳转到编辑角色页面
 * @param req
 * @param res
 */
module.exports.edit = function (req, res,next) {
    var id = req.query.id ? req.query.id : '';
    var show = req.query.show ? req.query.show : '';
    if(id == ''){
        var sysRole = [];//系统菜单

        //获取所有菜单数据
        menuService.fetchSysMenus(0,100,function(err, results) {
            if(!err) {
                var menus = results;
                //获取所有资源数据
                resourcesService.fetchSysResourcess(0,200,function(err, results) {
                    if(!err) {
                        var resourcess = results;
                        var menusByRole = {};
                        var resourcesByRole = {};
                        res.render('sysRole/sysRoleAdd', {sysRole : sysRole,show:show,menus:menus,resourcess:resourcess,menusByRole:menusByRole,resourcesByRole:resourcesByRole});
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
    }else{
        service.fetchSingleSysRole(id, function(err, results) {
            if (!err) {
                var sysRole = results.length == 0 ? null : results[0];
                //获取所有菜单数据
                menuService.fetchSysMenus(0,100,function(err, results) {
                    if(!err) {
                        var menus = results;
                        //获取所有资源数据
                        resourcesService.fetchSysResourcess(0,200,function(err, results) {
                            if(!err) {
                                var resourcess = results;
                                //获取当前用户所拥有的菜单、资源
                                service.getMenuAndResourcesByRoleId(id,function(err, results){
                                    if(!err) {
                                        var menusByRole = results.menusByRole;
                                        var resourcesByRole = results.resourcesByRole;
                                        res.render('sysRole/sysRoleAdd', {sysRole : sysRole,show:show,menus:menus,resourcess:resourcess,menusByRole:menusByRole,resourcesByRole:resourcesByRole});
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
 * 保存角色
 * @param req
 * @param res
 */
module.exports.save = function (req, res,next) {
    var id = req.body.id ? req.body.id : '';
    var name = req.body.name ? req.body.name : '';
    var describe = req.body.describe ? req.body.describe : '';
    var selectMenus = req.body.selectMenus ? req.body.selectMenus : '';//选中菜单
    var selectResources = req.body.selectResources ? req.body.selectResources : '';//选中资源
    selectMenus = selectMenus.split(",");
    selectResources = selectResources.split(",");

    // 处理菜单、资源ids数据
    var selectMenusArr = new Array();
    var selectResourcesArr = new Array();
    for (var i=0;i<selectMenus.length;i++) {
        var obj = {};
        obj.menuId = selectMenus[i];
        selectMenusArr.push(obj);
    }
    for (var i=0;i<selectResources.length;i++) {
        var obj = {};
        obj.resourcesId = selectResources[i];
        selectResourcesArr.push(obj);
    }

    if(id!=''){//修改，同时对菜单、资源一并保存
        service.updateSysRole(id,name,describe,function(err, results) {
            if(!err) {
                //添加角色与菜单、资源之间的关系
                //res.redirect('/jinquan/sys_role_list?replytype=update');
                service.addRoleByMenus(id,selectMenusArr,function(err, results) {
                    if(!err) {
                        service.addRoleByResources(id,selectResourcesArr,function(err, results) {
                            if (!err) {
                                var user = req.session.user;
                                sysUserService.getMenuAndResourcesByUserId(user.id,function(err,menuAndResources) {
                                    if (!err) {
                                        //记录用户信息：用户id、用户所在门店、用户名称
                                        var resourcesObj = {};
                                        if (menuAndResources.resourcesData[0] == null) {
                                            user.resourcesData = {};
                                        } else {
                                            var resourcesDataList = menuAndResources.resourcesData[0].url.split(",");
                                            for (var i = 0; i < resourcesDataList.length; i++) {
                                                var resourcesDataObj = resourcesDataList[i];
                                                resourcesObj[resourcesDataObj] = "1";
                                            }
                                        }
                                        user.resourcesData = resourcesObj;//拥有资源
                                        user.menus = menuAndResources.menusData;//拥有菜单
                                        req.session.user = user;
                                        res.redirect('/jinquan/sys_role_list?replytype=OK');
                                        //res.redirect('/jinquan');
                                    } else {
                                        res.redirect("/");
                                    }
                                });
                            }
                        })

                        //res.redirect('/jinquan/sys_role_list?replytype=update');
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
        service.insertSysRole(name,describe,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/sys_role_list?replytype=add');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }
}

/**
 * 删除角色
 * @param id
 * @param cb
 */
module.exports.del = function (req, res, next) {
    var id = req.query.id ? req.query.id :'';
    service.delSysRole(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/sys_role_list?replytype=del');
        } else {
            next();
        }
    });

}