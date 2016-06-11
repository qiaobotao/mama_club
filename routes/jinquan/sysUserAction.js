/**
 * Created by kuanchang on 16/1/21.
 */
var laypage = require('laypage');
var service = require('../../model/service/sysUser');
var roleService = require('../../model/service/sysRole');
var shopService = require('../../model/service/shop');
var menuService = require('../../model/service/sysMenu');

/**
 * 获取系统用户列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res,next) {

    var shop = req.query.shop ? req.query.shop : '';
    var account = req.query.account ? req.query.account : '';
    var password = req.query.password ? req.query.password : '';
    var currentPage = req.query.page ? req.query.page : '1';
    var userName = req.query.userName ? req.query.userName : '';

    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;

    service.fetchAllSysUser(userName,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.userName = userName;
            res.render('sysUser/sysUserList', {data : results, replytype : replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
            });
        } else {
            next();
        }
    });
}



/**
 * 跳转到编辑系统用户页面
 * @param req
 * @param res
 */
module.exports.edit = function (req, res,next) {
    var id = req.query.id ? req.query.id : '';//用户id
    var show = req.query.show ? req.query.show : '';
    var currentPage = req.query.page ? req.query.page : '1';
    service.fetchSingleSysUser(id, function(err, results) {
        if (!err) {
            var sysUser = results.length == 0 ? null : results[0];
            if(sysUser == null){
                sysUser = {};
            }
            //根据用户id获取
            roleService.fetchAllRoleByClassroomId("", function (err, results) {
                if (!err) {
                    //results.currentPage = currentPage;
                    var roleData = {};
                    roleData.data = results;
                    //获取该用户已绑定的角色
                    service.getRoleByUserId(id, function (err, roleResults) {
                        if (!err) {
                            roleData.roleResults = roleResults;
                            //获取所有门店
                            shopService.fetchShops(0,100,function (err, shopResults) {
                                if (!err) {
                                    var shopData = {};
                                    shopData.shopResults = shopResults
                                    //根据用户id获取所有已关联的门店
                                    service.getShopByUserId(id,function (err, selectShopResults) {
                                        if (!err) {
                                            shopData.selectShopResults = selectShopResults;
                                            res.render('sysUser/sysUserAdd', {data : roleData,shopData:shopData, sysUser : sysUser,show:show});
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
                    });
                } else {
                    next();
                }
            });

        } else {
            next();
        }
    })
}
/**
 * 保存系统用户
 * @param req
 * @param res
 */
module.exports.save = function (req, res,next) {
    var id = req.body.id ? req.body.id : '';
    var userName = req.body.userName ? req.body.userName : '';
    var password = req.body.password ? req.body.password : '';
    var shopIds = req.body.shopIds ? req.body.shopIds : '';
    var staffId = req.body.staffId ? req.body.staffId : '';
    var roleId = req.body.roleId ? req.body.roleId : '';
    var activity = req.body.activity ? req.body.activity : '';

    var roleIdArr = new Array();
    if (roleId instanceof Array) {
        for (var i=0;i<roleId.length;i++) {
            var obj = {};
            obj.roleId = roleId[i];
            roleIdArr.push(obj);
        }
    } else {
        var obj = {};
        obj.roleId = roleId;
        roleIdArr.push(obj);
    }


    var shopIdsArr = new Array();
    if (shopIds instanceof Array) {
        for (var i=0;i<shopIds.length;i++) {
            var obj = {};
            obj.shopIds = shopIds[i];
            shopIdsArr.push(obj);
        }
    } else {
        var obj = {};
        obj.shopIds = shopIds;
        shopIdsArr.push(obj);
    }


    if(id!=''){//修改
        service.updateSysUser(id,userName,password,staffId,activity,function(err, results) {
            if(!err) {
                service.deleteRoleByUserId(id,function(err, results) {
                    if(!err) {//删除用户——角色关联表成功
                        service.insertSysUserRole(id,roleIdArr,function(err, results) {
                            if(!err) {//添加用户——角色关联表成功
                                service.insertSysUserShop(id,shopIdsArr,function(err, results) {
                                    if(!err) {//添加用户——角色关联表成功
                                        res.redirect('/jinquan/sys_user_list?replytype=update');
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
                console.log(err.message);
                res.render('error');
            }
        })
    }else{//添加
        service.insertSysUser(userName,password,staffId,activity,function(err, results) {
            if(!err) {
                id = results.insertId;
                service.deleteRoleByUserId(id,function(err, results) {
                    if(!err) {//删除用户——角色关联表成功
                        service.insertSysUserRole(id,roleIdArr,function(err, results) {
                            if(!err) {//添加用户——角色关联表成功
                                service.insertSysUserShop(id,shopIdsArr,function(err, results) {
                                    if(!err) {//添加用户——角色关联表成功
                                        res.redirect('/jinquan/sys_user_list?replytype=update');
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
                console.log(err.message);
                res.render('error');
            }
        })
    }
    //将角色——用户关系表进行存储
    //先删除该用户下所有角色关系
    //为该用户增加对应的角色关系
}

/**
 * 删除系统用户
 * @param id
 * @param cb
 */
module.exports.del = function (req, res, next) {
    var id = req.query.id ? req.query.id :'';
    service.delSysUser(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/sys_user_list?replytype=del');
        } else {
            next();
        }
    });

}

/**
 * 跳转到个人设置界面
 * @param req
 * @param res
 */
module.exports.set = function (req, res,next) {
    var replytype = req.query.replytype ? req.query.replytype : '';
    //获取登陆用户的菜单信息
    menuService.findSysMenusByUserId(req.session.user.id,function(err, results) {
        if(!err) {
            var childMenus = results.childMenus;
            var fatherMenus = results.fatherMenus;
            res.render('sysUser/sysUserSet', {
                    fatherMenus : fatherMenus,
                    childMenus:childMenus,
                    replytype:replytype,
                    shortcutMenuId1:req.session.user.shortcutMenuId1,
                    shortcutMenuId2:req.session.user.shortcutMenuId2,
                    shortcutMenuId3:req.session.user.shortcutMenuId3,
                    shortcutMenuId4:req.session.user.shortcutMenuId4});
        } else {
            console.log(err.message);
            res.render('error');
        }
    })
}

/**
 * 保存个人设置信息
 * @param req
 * @param res
 */
module.exports.updateSetBySysUser = function (req, res,next) {
    var id = req.session.user.id;
    var oldpwd = req.body.oldpwd ? req.body.oldpwd :'';
    var newpwd = req.body.newpwd ? req.body.newpwd :'';
    var newpwd2 = req.body.newpwd2 ? req.body.newpwd2 :'';
    var shortcutMenuId1 = req.body.menuId1 ? req.body.menuId1 :'';
    var shortcutMenuId2 = req.body.menuId2 ? req.body.menuId2 :'';
    var shortcutMenuId3 = req.body.menuId3 ? req.body.menuId3 :'';
    var shortcutMenuId4 = req.body.menuId4 ? req.body.menuId4 :'';


    //设置快捷键
    service.updateshortcutMenuIdBySysUser(id,shortcutMenuId1,shortcutMenuId2,shortcutMenuId3,shortcutMenuId4,function(err, results) {
        if(!err) {//设置快捷键成功
            var user = req.session.user ;
            user.shortcutMenuId1 = shortcutMenuId1;//快捷菜单1
            user.shortcutMenuId2 = shortcutMenuId2;//快捷菜单2
            user.shortcutMenuId3 = shortcutMenuId3;//快捷菜单3
            user.shortcutMenuId4 = shortcutMenuId4;//快捷菜单4
            req.session.user = user;

            if(newpwd == '' || oldpwd == '' || newpwd2 == ''){//不需要修改密码
                //res.redirect('/jinquan/sys_user_set',{replytype:'OK'});
                res.redirect('/jinquan/sys_user_set?replytype=OK');
                return;
            }
            //修改密码
            service.updatePsdBySysUser(id,oldpwd,newpwd,function(err, results) {
                if(!err) {//设置密码成功后，继续跳转到设置页面，并提示成功
                    if(results.changedRows == 0){
                        res.redirect('/jinquan/sys_user_set?replytype=原密码错误');
                    }else{
                        res.redirect('/jinquan/sys_user_set?replytype=OK');
                    }
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
