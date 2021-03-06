/**
 * Created by kuanchang on 16/1/18.
 */

var laypage = require('laypage');
var service = require('../../model/service/service');

/**
 * 获取服务列表
 * @param req
 * @param res
 * @param next
 */
module.exports.list = function (req, res, next) {

    var name = req.query.name ? req.query.name : '';    // 服务名称
    var classifyId = req.query.id ? req.query.id : '';  // 服务分类
    var currentPage = req.query.page ? req.query.page : '1';

    // 接收操作参数
    var replytype = req.query.replytype ? req.query.replytype : '';
    var index = req.query.index ? req.query.index : '';
    var url = '/jinquan'+req.url;
    var resourcesData = req.session.user.resourcesData;

    service.list(name,classifyId,currentPage, function(err, results) {

        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.classifyId = classifyId;
            service.getServiceClassify(function(err,classify) {

                if (!err) {
                    results.classify = classify;
                    res.render('service/serviceList', {data : results, replytype : replytype,index:index, laypage: laypage({
                        curr: currentPage,url: url,pages: results.totalPages}),resourcesData:resourcesData
                    });
                } else {
                    next();
                }
            });
        } else {
            next();
        }

    });

}

/**
 * 增加服务
 * @param req
 * @param res
 * @param next
 */
module.exports.preAdd = function (req, res, next) {

   service.getServiceClassify(function(err, results) {

       if (!err) {
           res.render('service/serviceAdd', {data : results});
       } else {
           next();
       }
   })
}

/**
 * 增加服务表单
 * @param req
 * @param res
 * @param next
 */
module.exports.add = function (req, res, next) {

    var name = req.body.name ? req.body.name : '';
    var content = req.body.content ? req.body.content : '';
    var cid = req.body.cid ? req.body.cid : '';
    var price = req.body.price ? req.body.price : '';
    var remark = req.body.remark ? req.body.remark : '';

    service.add(name,content,cid,price,remark,function(err, results) {
        if (!err) {
            res.redirect('/jinquan/service_list?replytype=add');
        } else {
            next();
        }
    });
}

/**
 * 查看
 * @param req
 * @param res
 * @param next
 */
module.exports.browse = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.getSingleService(id,function(err, results) {
        if (!err && results.length != 0) {
           res.render('service/serviceBrowse', {data : results[0]});
        } else {
            next();
        }
    })

}

module.exports.preEdit = function (req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.getServiceClassify(function(err, classify) {

        if (!err) {
            service.getSingleService(id, function(err, results) {

                if (!err && results.length != 0) {
                    var service = results[0];
                    res.render('service/serviceEdit', {data : service , classifys : classify});

                } else {
                    next();
                }
            })
        } else {
            next();
        }
    })

}


module.exports.update = function(req, res, next) {

    var id = req.body.sid ? req.body.sid : '';
    var name = req.body.name ? req.body.name : '';
    var content = req.body.content ? req.body.content : '';
    var cid = req.body.cid ? req.body.cid : '';
    var price = req.body.price ? req.body.price : '';
    var remark = req.body.remark ? req.body.remark : '';

    service.update(id,name,content,cid,price,remark,function(err, results) {
        if (!err) {
             res.redirect('/jinquan/service_list?replytype=update');

        } else {
            next();
        }
    })
}

module.exports.del = function(req, res, next) {

    var id = req.query.id ? req.query.id : '';

    service.del(id,function(err, results){

        if (!err) {
            res.redirect('/jinquan/service_list?replytype=del');
        } else {
            next();
        }
    });
}
module.exports.select = function(req, res, next) {
    var name = req.query.name ? req.query.name : '';    // 服务名称
    var classifyId = req.query.id ? req.query.id : '';  // 服务分类
    var currentPage = req.query.page ? req.query.page : '1';
    service.list(name,classifyId,currentPage, function(err, results) {

        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.classifyId = classifyId;
            service.getServiceClassify(function(err,classify) {
                if (!err) {
                    results.classify = classify;
                    res.render('service/serviceSelect', {data : results});
                } else {
                    next();
                }
            });
        } else {
            next();
        }

    });

}

module.exports.selectForActivity = function(req, res, next) {
    var name = req.query.name ? req.query.name : '';    // 服务名称
    var classifyId = req.query.id ? req.query.id : '';  // 服务分类
    var currentPage = req.query.page ? req.query.page : '1';
    var index = req.query.index ? req.query.index : '';
    var url = '/jinquan'+req.url;
    /*
    console.log("url="+url);
    //找到page所在第几个字符，往后截取，然后追加上来
    var urlStart = url.substring(0,url.indexOf("?"));
    var urlEnd = url.substring(url.indexOf("?"),url.length);
    urlEnd = urlEnd.replace("?","&");
    console.log("urlStart="+urlStart);
    console.log("urlEnd="+urlEnd);
    if(index.indexOf(",")<0){
        url = urlStart +"?index="+index;
    }
    console.log("urlurl="+url);
    //url += urlEnd
    console.log("urlurlEnd="+url);
    /*
    if(url.indexOf("index") == -1){
        if(url.indexOf("?") > 0){
            url += "&index="+index;
        }else{
            url += "?index="+index;
        }
    }
    */
    service.list(name,classifyId,currentPage, function(err, results) {

        if (!err) {
            results.currentPage = currentPage;
            results.name = name;
            results.classifyId = classifyId;
            service.getServiceClassify(function(err,classify) {
                if (!err) {
                    results.classify = classify;
                    res.render('service/serviceSelectActivity', {data : results,index:index, laypage: laypage({
                        curr: currentPage,url: url,pages: results.totalPages})
                    });
                } else {
                    next();
                }
            });
        } else {
            next();
        }

    });

}