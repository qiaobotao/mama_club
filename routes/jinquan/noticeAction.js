/**
 * Created by kuanchang on 16/3/21.
 */

var service = require('../../model/service/notice');
/**
 * 获取公告列表
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {

    var currentPage = req.query.page ? req.query.page : '1';
    var title = req.query.title ? req.query.title : '';
    var replytype = req.query.replytype ? req.query.replytype : '';

    service.fetchAllNotice(title,currentPage, function (err, results) {
        if (!err) {
            results.currentPage = currentPage;
            results.title = title;
            res.render('notice/noticeList', {data : results,replytype:replytype});
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

    if(id!=''){//修改
        service.updateNotice(id,title,content,type,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/notice_list?replytype=update');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }else{//添加
        service.insertNotice(title,content,type,function(err, results) {
            if(!err) {
                res.redirect('/jinquan/notice_list?replytype=add');
            } else {
                console.log(err.message);
                res.render('error');
            }
        })
    }

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
