/**
 * Created by kuanchang on 16/1/21.
 * 菜单管理
 */

var service = require('../../model/service/sysMenu');

/**
 * 获取菜单列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {

    var currentPage = req.query.page ? req.query.page : '1';
    var textCh = req.query.textCh ? req.query.textCh : '';

    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';

    service.fetchAllSysMenu(textCh,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.textCh = textCh;
            res.render('sysMenu/sysMenuList', {data : results, replytype : replytype});
        } else {
            next();
        }
    });
}



/**
 * 跳转到编辑菜单页面
 * @param req
 * @param res
 */
module.exports.edit = function (req, res) {
    var id = req.query.id ? req.query.id : '';
    var show = req.query.show ? req.query.show : '';
    if(id == ''){
        var sysMenu = [];//系统菜单
        res.render('sysMenu/sysMenuAdd', {sysMenu : sysMenu,show:show});
    }else{
        service.fetchSingleSysMenu(id, function(err, results) {
            if (!err) {
                var sysMenu = results.length == 0 ? null : results[0];
                res.render('sysMenu/sysMenuAdd', {sysMenu : sysMenu,show:show});
            } else {
                next();
            }
        })
    }
}
/**
 * 保存菜单
 * @param req
 * @param res
 */
module.exports.save = function (req, res) {
    var id = req.body.id ? req.body.id : '';
    var textCh = req.body.textCh ? req.body.textCh : '';
    var textEn = req.body.textEn ? req.body.textEn : '';
    var parentId = req.body.parentId ? req.body.parentId : '';
    var orderId = req.body.orderId ? req.body.orderId : '';
    var url = req.body.url ? req.body.url : '';
    var imageUrl = req.body.imageUrl ? req.body.imageUrl : '';

    if(id!=''){//修改
        service.updateSysMenu(id,textCh,textEn,parentId,orderId,url,imageUrl,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/sys_menu_list?replytype=update');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }else{//添加
        service.insertSysMenu(textCh,textEn,parentId,orderId,url,imageUrl,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/sys_menu_list?replytype=add');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }
}

/**
 * 删除菜单
 * @param id
 * @param cb
 */
module.exports.del = function (req, res, next) {
    var id = req.query.id ? req.query.id :'';
    service.delSysMenu(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/sys_menu_list?replytype=del');
        } else {
            next();
        }
    });

}