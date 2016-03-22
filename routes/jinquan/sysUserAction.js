/**
 * Created by kuanchang on 16/1/21.
 */
var service = require('../../model/service/sysUser');
var roleService = require('../../model/service/sysRole');
var shopService = require('../../model/service/shop');

/**
 * 获取系统用户列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {

    var currentPage = req.query.page ? req.query.page : '1';
    var userName = req.query.userName ? req.query.userName : '';

    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';

    service.fetchAllSysUser(userName,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.userName = userName;
            res.render('sysUser/sysUserList', {data : results, replytype : replytype});
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
module.exports.edit = function (req, res) {
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
module.exports.save = function (req, res) {
    var id = req.body.id ? req.body.id : '';
    var userName = req.body.userName ? req.body.userName : '';
    var password = req.body.password ? req.body.password : '';
    var shopIds = req.body.shopIds ? req.body.shopIds : '';
    var staffId = req.body.staffId ? req.body.staffId : '';
    var roleId = req.body.roleId ? req.body.roleId : '';
    var activity = req.body.activity ? req.body.activity : '';

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
                        service.insertSysUserRole(id,roleId,function(err, results) {
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
                        service.insertSysUserRole(id,roleId,function(err, results) {
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
 * 设置系统用户属性
 * @param req
 * @param res
 */
module.exports.set = function (req, res) {
    res.render('sysUser/sysUserSet');
}
