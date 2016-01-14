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
var classroomAction = require('./classroomAction');//教室管理
var courseAction = require('./courseAction');//课程管理
var staffAction = require('./staffAction');//员工管理
var staffTrainAction = require('./staffTrainAction');//员工培训
var attendanceTypeAction = require('./attendanceTypeAction');//考勤类型
var memberCardTypeAction = require('./memberCardTypeAction');//会员卡类型
var activityManageAction = require('./activityManageAction');//活动管理

/* GET home page. */
router.all('/',welcomeAction.index);
router.all('/menu', welcomeAction.Menu);
router.all('/welcome',welcomeAction.Welcome);
/*********************门店管理****************************/
// 门店管理
router.all('/shop_list',shopAction.list);
router.all('/shop_pre_add',shopAction.preAdd);
router.all('/shop_add',shopAction.add);
router.all('/shop_del', shopAction.del);
router.all('/shop_set',shopAction.setStatus);
router.all('/shop_pre_edit',shopAction.preEdit);
router.all('/shop_update',shopAction.update);

/*********************教室及课程管理****************************/
// 教室管理
router.all('/classroom_list',classroomAction.list);
router.all('/classroom_add',classroomAction.add);
// 排课情况
// 课程查询
router.all('/course_list',courseAction.list);
router.all('/course_add',courseAction.add);

/*********************员工管理****************************/
// 员工列表
router.all('/staff_list',staffAction.list);
router.all('/staff_add',staffAction.add);
// 员工培训
router.all('/staff_train_list',staffTrainAction.list);
router.all('/staff_train_edit',staffTrainAction.edit);
// 打卡记录
// 考勤类别
router.all('/attendance_type_list',attendanceTypeAction.list);
router.all('/attendance_type_edit',attendanceTypeAction.edit);
// 考勤变更
// 查询考勤
// 绩效查询
// 绩效考勤

/*********************会员管理****************************/
// 会员卡类型
router.all('/member_card_type_list',memberCardTypeAction.list);
router.all('/member_card_type_edit',memberCardTypeAction.edit);
// 会员卡管理
// 活动管理
router.all('/activity_manage_list',activityManageAction.list);
router.all('/activity_manage_edit',activityManageAction.edit);
// 会员列表
// 预约服务
// 课程报名
// 护理服务
// 收费信息
// 回访信息
// 投诉信息


/*********************进销存管理***************************/
// 服务管理
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

// 经销商管理
// 入库管理
// 出库管理
// 移库管理
// 盘点库存

/*********************权限管理******************************/
// 分类管理
router.all('/main_classify_list', classifyAction.list);
router.all('/main_classify_del', classifyAction.del);
router.all('/main_classify_pre_add',classifyAction.preAdd);
router.all('/main_classify_add',classifyAction.add);
router.all('/main_classify_pre_edit',classifyAction.preEdit);
router.all('/main_classify_update', classifyAction.update);
router.all('/sub_classify_list', classifyAction.subList);
router.all('/sub_classify_del', classifyAction.delSubClassify);
router.all('/sub_classify_pre_add', classifyAction.preSubAddClassify);
router.all('/sub_classify_add',classifyAction.addSubClassify);
router.all('/sub_classify_pre_edit',classifyAction.preSubEdit);
router.all('/sub_classify_update',classifyAction.subUpdate);

// 资源按钮管理
// 菜单管理
// 角色管理
// 系统用户管理
// 个人设置


module.exports = router;