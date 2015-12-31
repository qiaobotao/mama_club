var express = require('express');
var utils = require('../common/utils');
var common = require('../common/common');
var router = express.Router();

//生成二维码
router.all('/:id', function (req, res) {
    var id = req.params.id;
    if (!utils.isNum(id) || (id > 100000) || (id < 1)) {
        return res.json("数字错误");
    }

    common.createQRCode(id,function(err, result) {
        if (!err && result) {
            var url = common.showQRCode(result.ticket);
            res.redirect(url);
        }
    });
});

module.exports = router;
