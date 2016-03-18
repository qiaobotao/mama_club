/**
 * Created by kuanchang on 16/2/29.
 */


var db = require('../../common/db');
var async = require('async');
/**
 * 增加角色
 * @param name
 * @param cb
 */
module.exports.insertSysRole = function(name,describe, cb) {

    var sql = 'INSERT INTO sysRole (name,describe,dateline) VALUES (?,?,?)';
    db.query(sql, [name,describe,new Date().getTime()], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * 删除角色
 * @param id
 * @param cb
 */
module.exports.delSysRole= function (id, cb) {

    var sql = 'DELETE from sysRole WHERE id = ?';
    db.query(sql, [id], function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}


/**
 * 获取所有角色
 * @param name
 * @param currentPage
 * @param cb
 */
module.exports.fetchAllSysRole = function(name,currentPage,cb) {

    var parm = "WHERE name LIKE '%"+name+"%' ";

    var sql_count = 'SELECT count(*) as count FROM sysRole '+parm+'  ORDER BY dateline DESC';
    var start = (currentPage - 1) * 10;
    var end = currentPage * 10;
    var sql_data = 'SELECT * FROM sysRole '+parm+' ORDER BY dateline DESC LIMIT ?,?';

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
 * 根据角色id，获取该角色拥有的菜单及按钮资源
 * @param id
 * @param name
 * @param cb
 */
module.exports.getMenuAndResourcesByRoleId = function(id,cb) {
    //根据角色id获取菜单、资源信息
    var getMenusByRoleIdSql = 'select * from sysRoleMenu where roleId = ?';
    var getRoleResourcesByRoleIdSql = 'select * from sysRoleResources where roleId = ?';
    var roleIdPar = [id];
    async.series({
        menusByRole : function(callback){
            db.query(getMenusByRoleIdSql, roleIdPar, function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        resourcesByRole : function(callback){
            db.query(getRoleResourcesByRoleIdSql, roleIdPar, function (cbData, err, rows, fields) {
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
 * 修改角色
 * @param id
 * @param name
 * @param cb
 */
module.exports.updateSysRole = function(id, name,describe,cb) {
    //修改角色信息
    var updateRoleSql = 'UPDATE sysRole SET `name` = ?,`describe` = ? WHERE `id` = ?';
    var updateRolePar = [name,describe, id];
    //删除角色与之对应的菜单关系
    var deleteRoleMenuSql = 'delete from sysRoleMenu WHERE roleId = ?';
    var deleteRoleMenuPar = [id];
    //删除角色与之对应的资源关系
    var deleteRoleResourcesSql = 'delete from sysRoleResources WHERE roleId = ?';
    var deleteRoleResourcesPar = [id];
    async.series({
        updateCount : function(callback){
            db.query(updateRoleSql, updateRolePar, function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        deleteRoleMenuCount : function(callback){
            db.query(deleteRoleMenuSql, deleteRoleMenuPar, function (cbData, err, rows, fields) {
                if (!err) {
                    callback(null,rows);
                } else {
                    callback(err);
                }
            });
        },
        deleteRoleResourcesCount : function(callback){
            db.query(deleteRoleResourcesSql, deleteRoleResourcesPar, function (cbData, err, rows, fields) {
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
 * 添加角色与菜单、资源之间的关系
 * @param id
 * @param name
 * @param cb
 */
module.exports.addRoleByMenuAndResources = function(id,selectMenus,selectResources,cb) {
    //添加角色与之对应的菜单关系
    var addRoleMenuSql = 'insert into sysRoleMenu(roleId,menuId,dateline) VALUES (?,?,?)';
    //添加角色与之对应的资源关系
    var addRoleResourcesSql = 'insert into sysRoleResources(roleId,resourcesId,dateline) VALUES (?,?,?)';
    //批量添加角色对应菜单
    async.map(selectMenus, function(item, callback) {
        db.query(addRoleMenuSql, [id,item.menuId,new Date().getTime()], function (cbData, err, rows, fields) {
            if (!err) {
                callback(null, rows);
            } else {
                callback(err);
            }
        });
    }, function(err,results) {
        //callback(err, results);
    });
    //批量添加角色对应资源按钮
    async.map(selectResources, function(item, callback) {
        db.query(addRoleResourcesSql, [id,item.resourcesId,new Date().getTime()], function (cbData, err, rows, fields) {
            if (!err) {
                callback(null, rows);
            } else {
                callback(err);
            }
        });
    }, function(err,results) {
        cb(err, results);
    });
}

/**
 * 获取角色详情
 * @param id
 * @param cb
 */
module.exports.fetchSingleSysRole =function (id, cb) {
    var sql = 'SELECT * FROM sysRole WHERE id = ?';
    db.query(sql, [id],  function(cbData, err, rows, fields) {
        if (!err) {
            cb(null, rows);
        } else {
            cb(err);
        }
    });
}