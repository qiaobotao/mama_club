/**
 * Created by kuanchang on 16/2/21.
 */
/**
 * 跳转到demo展示代码
 * @param req
 * @param res
 */
module.exports.layui = function (req, res) {

    var time = '2016-04-10'.replace(/-/g,'/');
    console.log(time);
    var time2 = new Date(time).getTime();

    console.log(time2);

    console.log(new Date().getTime());

     res.locals.user = req.session.user;
    res.render('demo/layuiDemo');
}