/**
 * Created by kuanchang on 16/1/21.
 * 角色管理
 */

var service = require('../../model/service/sysRole');
var menuService = require('../../model/service/sysMenu');
var resourcesService = require('../../model/service/sysResources');

/**
 * 获取角色列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {

    var currentPage = req.query.page ? req.query.page : '1';
    var name = req.query.name ? req.query.name : '';

    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';

    service.fetchAllSysRole(name,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            res.render('sysRole/sysRoleList', {data : results, replytype : replytype});
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
module.exports.edit = function (req, res) {
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
                        res.render('sysRole/sysRoleAdd', {sysRole : sysRole,show:show,menus:menus,resourcess:resourcess});
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
                                res.render('sysRole/sysRoleAdd', {sysRole : sysRole,show:show,menus:menus,resourcess:resourcess});
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
module.exports.save = function (req, res) {
    var id = req.body.id ? req.body.id : '';
    var name = req.body.name ? req.body.name : '';
    var describe = req.body.describe ? req.body.describe : '';

    if(id!=''){//修改
        service.updateSysRole(id,name,describe,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/sys_role_list?replytype=update');
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