/**
 * Created by qiaojoe on 16-3-13.
 */

var service = require('../../model/service/course');

module.exports.list = function (req, res, next) {
    res.render('coursePlan/coursePlanList');
}


module.exports.add = function (req, res, next) {

    res.render('coursePlan/coursePlanAdd');

}

module.exports.add = function (req, res, next) {

    res.render('coursePlan/coursePlanEdit');

}
