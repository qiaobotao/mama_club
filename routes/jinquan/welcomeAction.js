/**
 * Created by qiaojoe on 15-12-5.
 */

module.exports.index = function (req, res) {

    var account = req.body.account ? req.body.account : '';
    var passowrd = req.body.password ? req.body.password : '';


    //var user = {};
    //user.name = '乔伯涛';
    //user.shopId = '40';


    //req.session.user = user;

    res.render('welcome/index',{user : req.session.user });

}

module.exports.Menu = function (req, res) {

    var menus = req.session.user.menus;
    //res.render('welcome/left',{menusData:menusData});
    res.render('welcome/left',{menusData:menus});

}

module.exports.Welcome = function (req, res) {

    res.render('welcome/welcome');

}
