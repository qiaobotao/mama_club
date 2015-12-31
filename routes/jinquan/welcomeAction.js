/**
 * Created by qiaojoe on 15-12-5.
 */

module.exports.index = function (req, res) {

    res.render('welcome/index');

}

module.exports.Menu = function (req, res) {

    res.render('welcome/left');

}

module.exports.Welcome = function (req, res) {

    res.render('welcome/welcome');

}
