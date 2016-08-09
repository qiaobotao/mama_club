/**
 * Created by kuanchang on 16/3/21.
 */

var laypage = require('laypage');
var service = require('../../model/service/notice');
var multiparty = require('multiparty');
var conf = require('../../config');
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
    var resourcesData = req.session.user.resourcesData;

    service.fetchAllNotice(title,type,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.title = title;
            results.type = type;
            res.render('notice/noticeList', {data : results,replytype:replytype, laypage: laypage({
                curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
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
module.exports.listByUser = function (req, res, next) {

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
module.exports.save = function (req, res, next) {
    var id = req.query.id ? req.query.id : '';
    var title = req.query.title ? req.query.title : '';
    var type = req.query.type ? req.query.type : '';
    var startDate = req.query.startDate ? req.query.startDate : '';
    var endDate = req.query.endDate ? req.query.endDate : '';
    var content = req.query.content ? req.query.content : '';
    var filesNames = req.query.filesNames ? req.query.filesNames : '';
    var filesUrls = req.query.filesUrls ? req.query.filesUrls : '';
    var createUser = req.session.user.userName;
    var thisDate = new Date();
    var thisMonth = thisDate.getMonth()+1;
    var updateDate = thisDate.getFullYear()+"-"+(thisMonth < 10 ? "0"+thisMonth :thisMonth)+"-"+thisDate.getDate();
    //从前天传过来的数据进行拆分分组
    filesNames = filesNames.split(",");
    filesUrls = filesUrls.split(",");

    var filename = "";
    var fileurl = "";
    var form = new multiparty.Form();
    form.uploadDir = conf.uploadDir.dir;
    service.fetchSingleNotice(id, function(err, results) {
        if (!err) {
            var notice = results.length == 0 ? null : results[0];
            form.parse(req, function(err, fields, files) {
                if (!err) {
                    for(var f = 0 ; f<files.recordfile.length ; f ++){
                        var inputFile = files.recordfile[f];
                        if(f != 0){
                            filename += ";";
                            fileurl += ";";
                        }
                        if (inputFile.originalFilename != '' && inputFile.size != 0) {
                            filename += inputFile.originalFilename;
                            // fileurl += inputFile.path.substr(inputFile.path.indexOf('/'),inputFile.path.length);
                            fileurl += conf.uploadDir.url +  inputFile.path.substr(inputFile.path.lastIndexOf('/'),inputFile.path.length);
                        }else{
                            //该文件没有变更，直接将原文件信息赋值即可
                            if(notice.filesName.indexOf(filesNames[f])>=0){
                                filename += filesNames[f];
                                fileurl += filesUrls[f];
                            }
                        }

                    }

                    if(id!=''){//修改
                        service.updateNotice(id,title,startDate,endDate,content,type,updateDate,filename,fileurl,function(err, results) {
                            if(!err) {
                                res.redirect('/jinquan/notice_list?replytype=update');
                            } else {
                                console.log(err.message);
                                res.render('error');
                            }
                        })
                    }else{//添加
                        service.insertNotice(title,startDate,endDate,content,type,updateDate,createUser,filename,fileurl,function(err, results) {
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
                } else {
                    console.log('parse error: ' + err);
                    next();
                }
            });
        } else {
            next();
        }
    })
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
