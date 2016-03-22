/**
 * Created by kuanchang on 16/2/29.
 */


var db = require('../../common/db');
var async = require('async');
/**
 * 增加系统用户
 * @param userName
 * @param password
 * @param shopId
 * @param staffId
 * @param cb
 */
module.exports.insertSysUser = function(userName,password,staffId,activity, cb) {

    var sql = 'INSERT INTO sysUser (userName,password,staffId,activity,dateline) VALUES (?,?,?,?,?)';
    db.query(sql, [userName,password,staffId,activity,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除系统用户
 * @param id
 * @param cb
 */
module.exports.delSysUser= function (id, cb) {

    var sql = 'DELETE from sysUser WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}


/**
 * 获取所有系统用户
 * @param name
 * @param currentPage
 * @param cb
 */
module.exports.fetchAllSysUser = function(userName,currentPage,cb) {

    var parm = "WHERE a.userName LIKE '%"+userName+"%' ";

    var sql_count = 'SELECT count(*) as count FROM sysUser a '+parm+'  ORDER BY a.dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'select a.id,a.userName,a.activity,st.name as `staffName`,s.name as `shopName` FROM sysUser a, shop s ,staff st '+parm+' AND st.shopId = s.id and a.staffId = st.id ORDER BY a.dateline DESC LIMIT ?,?';

    async.series({
        totalPages : function(callback){
            db.query(sql_count, [], function (cbData, err, rows, fields) {

                if (!err) {
                    var count = rows[0].count;
                    var totalPages = Math.ceil(count / 10);
                    callback(null,totalPages);
                } else {
                    callback(err);
                }
            });
        },
        data : function(callback){
            db.query(sql_data, [start, end], function (cbData, err, rows, fields) {

                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        }
    },function(err, results) {

        if (!err) {
            cb (null, results);
        } else {
            cb(err);
        }
    });
}

/**
 * 修改系统用户
 * @param id
 * @param name
 * @param cb
 */
module.exports.updateSysUser = function(id, userName,password,staffId, activity,cb) {
    var sql = 'UPDATE sysUser SET userName = ?,password=?,staffId=?,activity=? WHERE id = ?';
    var par = [userName,password,staffId,activity, id];
    db.query(sql, par, function (cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 获取系统用户详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleSysUser =function (id, cb) {
    var sql = 'SELECT a.*,s.id as `shopId`,s.name as `shopName`,st.id as `staffId`,st.name as `staffName` FROM sysUser a, shop s ,staff st ' +
        ' WHERE st.shopId = s.id AND a.staffId = st.id AND a.id = ? ';
    db.query(sql, [id],  function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}


/**
 * 增加系统用户与角色关系表
 * @param userId
 * @param roleId
 * @param cb
 */
module.exports.insertSysUserRole = function(userId,roleIds, cb) {

    var sql = 'INSERT INTO sysUserRole (userId,roleId,dateline) VALUES (?,?,?)';
    async.map(roleIds, function(item, callback) {
        db.query(sql, [userId,item,new Date().getTime()], function (cbData, err, rows, fields) {
            if (!err) {
                callback(null, rows);
            } else {
                callback(err);
            }
        });
    }, function(err,results) {
        cb(err, results);
    });
};


/**
 * 增加系统用户与门店关系表
 * @param userId
 * @param roleId
 * @param cb
 */
module.exports.insertSysUserShop = function(userId,shopIds, cb) {

    var sql = 'INSERT INTO sysUserShop (userId,shopId,dateline) VALUES (?,?,?)';
    async.map(shopIds, function(item, callback) {
        db.query(sql, [userId,item.shopIds,new Date().getTime()], function (cbData, err, rows, fields) {
            if (!err) {
                callback(null, rows);
            } else {
                callback(err);
            }
        });
    }, function(err,results) {
        cb(err, results);
    });
};


/**
 * 不分页根据用户id显示获取所有门店
 * @param userId 用户id
 * @param cb
 */
module.exports.getShopByUserId = function (userId,cb) {

    var sql = 'SELECT * FROM sysUserShop where userId = ?';
    db.query(sql, [userId],function (cbData, err, rows, fields) {
        if (!err) {
            cb (null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 查询用户所有角色
 * @param userId
 * @param cb
 */
module.exports.getRoleByUserId =function (userId, cb) {
    var sql = 'select * from sysUserRole WHERE userId = ?';
    db.query(sql, [userId],  function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}

/**
 * 删除用户所有角色、所关联门店
 * @param id
 * @param cb
 */
module.exports.deleteRoleByUserId =function (userId, cb) {
    var delRolesql = 'DELETE from sysUserRole WHERE userId = ?';
    var delShopsql = 'DELETE from sysUserShop WHERE userId = ?';

    async.series({
        totalPages : function(callback){
            db.query(delRolesql, [userId], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        data : function(callback){
            db.query(delShopsql, [userId], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        }
    },function(err, results) {

        if (!err) {
            cb (null, results);
        } else {
            cb(err);
        }
    });
}


/**
 * 根据门店名称、用户名找到用户信息
 * @param shop
 * @param checkUser
 * @param cb
 */
module.exports.checkUser = function (shop,checkUser,cb) {

    var sql = 'SELECT u.`password`,st.name as `userName`,sp.name as `shopName`,u.id FROM sysUser u,staff st,shop sp ' +
        'WHERE sp.id = st.shopId ' +
        'AND u.staffId = st.id ' +
        'AND u.userName = ? ' +
        'AND sp.`name` = ?';
    db.query(sql, [checkUser,shop],function (cbData, err, rows, fields) {
        if (!err) {
            cb (null, rows);
        } else {
            cb(err);
        }
    });

}

/**
 * 根据用户id获取用户所有菜单集合及功能按钮集合
 * @param uId
 * @param cb
 */
module.exports.getMenuAndResourcesByUserId = function(uId,cb) {

    var menusSql = "SELECT * from sysMenu m where m.id in (SELECT rm.menuId from sysUserRole r,sysRoleMenu rm where r.roleId = rm.roleId and r.userId = ?) ";

    var resourcesSql = 'SELECT * from sysResources m where m.id in (SELECT rm.resourcesId from sysUserRole r,sysRoleResources rm where r.roleId = rm.roleId and r.userId = ?)';

    async.series({
        menusData : function(callback){
            db.query(resourcesSql, [uId], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        resourcesData : function(callback){
            db.query(resourcesSql, [uId], function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        }
    },function(err, results) {

        if (!err) {
            cb (null, results);
        } else {
            cb(err);
        }
    });
}