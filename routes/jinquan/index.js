/**
 * Created by qiaojoe on 15-12-5.
 */


var express = require('express');
var router = express.Router();

var welcomeAction = require('./welcomeAction');
var shopAction = require('./shopAction');
var storeroomAction = require('./storeroomAction');
var waresAction = require('./waresAction');
var classifyAction = require('./classifyAction');

/* GET home page. */
router.all('/',welcomeAction.index);
router.all('/menu', welcomeAction.Menu);
router.all('/welcome',welcomeAction.Welcome);
// 门店管理
router.all('/shop_list',shopAction.list);
router.all('/shop_pre_add',shopAction.preAdd);
router.all('/shop_add',shopAction.add);
router.all('/shop_del', shopAction.del);
router.all('/shop_set',shopAction.setStatus);
router.all('/shop_pre_edit',shopAction.preEdit);
router.all('/shop_update',shopAction.update);

// 商品管理
router.all('/wares_list', waresAction.list);
router.all('/wares_detail', waresAction.detail);
router.all('/wares_pre_edit', waresAction.preEdit);
router.all('/wares_update', waresAction.waresUpdate);

// 库房管理
router.all('/storeroom_list',storeroomAction.list);
router.all('/storeroom_add', storeroomAction.add);
router.all('/storeroom_pre_edit', storeroomAction.preEdit);
router.all('/storeroom_update', storeroomAction.update);
router.all('/storeroom_pre_add', storeroomAction.preAdd);
router.all('/storeroom_set', storeroomAction.setStatus);
router.all('/storeroom_del', storeroomAction.del);

// 分类管理
router.all('/main_classify_list', classifyAction.list);
router.all('/main_classify_del', classifyAction.del);
router.all('/main_classify_pre_add',classifyAction.preAdd);

module.exports = router;