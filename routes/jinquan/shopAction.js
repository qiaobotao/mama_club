/**
 * Created by qiaojoe on 15-12-5.
 * 门店管理
 */


module.exports.list = function (req, res) {

    res.render('shop/shoplist');

}


module.exports.add = function (req, res) {

    res.render('shop/add');

}