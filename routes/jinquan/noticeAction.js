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
    var createUser = req.session.user.userName;
    var thisDate = new Date();
    var updateDate = thisDate.getFullYear()+"-"+(thisDate.getMonth() < 10 ? "0"+thisDate.getMonth() :thisDate.getMonth())+"-"+thisDate.getDate();

    var form = new multiparty.Form({uploadDir: './public/files/'});
    form.parse(req, function(err, fields, files) {
        if (!err) {
            var inputFile1 = files.recordfile[0];
            var inputFile2 = files.recordfile[1];
            // var uploadedPath = inputFile.path;
            console.log(inputFile1);
            console.log(inputFile2);
            var filename1 = '';
            var filename2 = '';
            var baseUrl = req.headers.origin;
            if (inputFile1.originalFilename != '' && inputFile1.size != 0) {
                filename1 = baseUrl + inputFile1.path.substr(inputFile1.path.indexOf('/'),inputFile1.path.length);;
            }

            if (inputFile1.originalFilename != '' && inputFile1.size != 0) {
                filename2 = baseUrl + inputFile2.path.substr(inputFile2.path.indexOf('/'),inputFile2.path.length);
            }

            if(id!=''){//修改
                service.updateNotice(id,title,startDate,endDate,content,type,updateDate,filename1,filename2,function(err, results) {
                    if(!err) {
                        res.redirect('/jinquan/notice_list?replytype=update');
                    } else {
                        console.log(err.message);
                        res.render('error');
                    }
                })
            }else{//添加
                service.insertNotice(title,startDate,endDate,content,type,updateDate,createUser,filename1,filename2,function(err, results) {
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
