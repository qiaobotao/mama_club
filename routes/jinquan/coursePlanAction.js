/**
 * Created by qiaojoe on 16-3-13.
 */

module.exports.list = function (req, res, next) {
    res.render('coursePlan/coursePlanList');
}


module.exports.add = function (req, res, next) {

    res.render('coursePlan/coursePlanAdd');

}
