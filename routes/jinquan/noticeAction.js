/**
 * Created by kuanchang on 16/3/21.
 */

var laypage = require('laypage');
var service = require('../../model/service/notice');
var multiparty = require('multiparty');
/**
 * 获取公告列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {

    var currentPage = req.query.page ? req.query.page : '1';
    var title = req.query.title ? req.query.title : '';
    var type = req.query.type ? req.query.type : '';
    var replytype = req.query.replytype ? req.query.replytype : '';
    var url = '/jinquan'+req.url;

    service.fetchAllNotice(title,type,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.title = title;
            results.type = type;
            res.render('notice/noticeList', {data : results,replytype:replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages})
            });
        } else {
            next();
        }
    });
}/**
 * 根据用户id获取公告列表
 * @param req
 * @param res
 */
module.exports.listByUser = function (req, res) {

    var currentPage = req.query.page ? req.query.page : '1';
    var url = '/jinquan'+req.url;


    service.fetchAllNoticeByUser(req.session.user.id,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            res.render('notice/noticeListByUser', {data : results, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages})
            });
        } else {
            next();
        }
    });
}

/**
 * 保存公告
 * @param req
 * @param res
 */
module.exports.save = function (req, res) {
    var id = req.body.id ? req.body.id : '';
    var title = req.body.title ? req.body.title : '';
    var type = req.body.type ? req.body.type : '';
    var content = req.body.content ? req.body.content : '';
    var thisDate = new Date();
    var updateDate = thisDate.getFullYear()+"-"+(thisDate.getMonth() < 10 ? "0"+thisDate.getMonth() :thisDate.getMonth())+"-"+thisDate.getDate();
    if(id!=''){//修改
        service.updateNotice(id,title,content,type,updateDate,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/notice_list?replytype=update');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }else{//添加
        service.insertNotice(title,content,type,updateDate,function(err, results) {
            if(!err) {
                service.insertSysUserNotice(results.newNotice.insertId,results.userData,function(err, results) {
                    if(!err) {
                        res.redirect('/jinquan/notice_list?replytype=add');
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
    /*
    var form = new multiparty.Form({uploadDir: './public/files/'});
    form.parse(req, function(err, fields, files) {
        if (!err) {
            var inputFile = files.recordfile[0];
            var uploadedPath = inputFile.path;
            var a= "";
        } else {
            console.log('parse error: ' + err);
            next();
        }

    });
    */
}
/**
 * 修改
 * @param req
 * @param res
 */
module.exports.preEdit = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';
    var show = req.query.show ? req.query.show : '';
    service.fetchSingleNotice(id, function(err, results) {
        if (!err) {
            var notice = results.length == 0 ? null : results[0];
            if(notice == null){
                notice = {};
            }
            res.render('notice/noticeEdit', {notice : notice,show:show});
        } else {
            next();
        }
    })
}

/**
 * 查看
 * @param req
 * @param res
 */
module.exports.view = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';
    service.fetchSingleNotice(id, function(err, results) {
        if (!err) {
            var notice = results.length == 0 ? null : results[0];
            if(notice == null){
                notice = {};
            }
            service.setUserNotice(id,req.session.user.id, function(err, results) {
                if (!err) {
                    res.render('notice/noticeView', {notice : notice});
                } else {
                    next();
                }
            })
        } else {
            next();
        }
    })
}

/**
 * 删除公告
 * @param req
 * @param res
 */
module.exports.del = function (req, res, next) {

    var id = req.query.id ? req.query.id :'';

    service.delNotice(id,function(err, results){
        if (!err) {
            res.redirect('/jinquan/notice_list?replytype=del');
        } else {
            next();
        }
    });

}
