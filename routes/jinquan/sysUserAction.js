/**
 * Created by kuanchang on 16/1/21.
 */
var service = require('../../model/service/sysUser');
var roleService = require('../../model/service/sysRole');

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
    var id = req.query.id ? req.query.id : '';
    var show = req.query.show ? req.query.show : '';
    var currentPage = req.query.page ? req.query.page : '1';
    if(id == ''){
        var sysUser = [];//系统用户
        roleService.fetchAllSysRole("",currentPage, function (err, results) {
            if (!err) {
                results.currentPage = currentPage;
                res.render('sysUser/sysUserAdd', {data : results, sysUser : sysUser,show:show});
            } else {
                next();
            }
        });
    }else{
        service.fetchSingleSysUser(id, function(err, results) {
            if (!err) {
                var sysUser = results.length == 0 ? null : results[0];
                roleService.fetchAllSysRole("",currentPage, function (err, results) {
                    if (!err) {
                        results.currentPage = currentPage;

                        service.getRoleByUserId(id, function (err, roleResults) {
                            if (!err) {
                                results.currentPage = currentPage;
                                results.roleResults = roleResults;
                                res.render('sysUser/sysUserAdd', {data : results, sysUser : sysUser,show:show});
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
    var shopId = req.body.shopId ? req.body.shopId : '';
    var staffId = req.body.staffId ? req.body.staffId : '';
    var roleId = req.body.roleId ? req.body.roleId : '';


    if(id!=''){//修改
        service.updateSysUser(id,userName,password,shopId,staffId,function(err, results) {
            if(!err) {
                service.deleteRoleByUserId(id,function(err, results) {
                    if(!err) {//删除用户——角色关联表成功
                        service.insertSysUserRole(id,roleId,function(err, results) {
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
    }else{//添加
        service.insertSysUser(userName,password,shopId,staffId,function(err, results) {
            if(!err) {
                //员工时，不需要员工id
                service.insertSysUserRole(results.insertId,roleId,function(err, results) {
                    if(!err) {//添加用户——角色关联表成功
                        res.redirect('/jinquan/sys_user_list?replytype=add');
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
