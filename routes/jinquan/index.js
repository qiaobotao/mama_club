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
var attendanceChangeAction = require('./attendanceChangeAction');//考勤变更
var memberCardTypeAction = require('./memberCardTypeAction');//会员卡类型
var activityManageAction = require('./activityManageAction');//活动管理
var memberAction = require('./memberAction');//会员管理
var classMeetAction = require('./classMeetAction');//预约课程管理
var serviceMeetAction = require('./serviceMeetAction');//预约服务管理
var nursServiceAction = require('./nursServiceAction');//护理服务管理
var returnVisitAction = require('./returnVisitAction');//回访信息管理
var complainAction = require('./complainAction');//投诉信息管理
var serviceAction = require('./serviceAction');//服务信息管理
var distributorAction = require('./distributorAction');//经销商管理
var storeroomInAction = require('./storeroomInAction');//入库管理
var storeroomOutAction = require('./storeroomOutAction');//出库管理
var storeroomMoveAction = require('./storeroomMoveAction');//移库管理

var sysResourcesAction = require('./sysResourcesAction');//资源管理
var sysMenuAction = require('./sysMenuAction');//菜单管理
var sysRoleAction = require('./sysRoleAction');//角色管理
var sysUserAction = require('./sysUserAction');//系统用户管理

var memberCardAction = require('./memberCardAction');//会员卡管理
//demo演示
var demoAction = require('./demoAction');//demo管理


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
router.all('/shop_browse',shopAction.browse);
router.all('/shop_pre_edit',shopAction.preEdit);
router.all('/shop_update',shopAction.update);

/*********************教室及课程管理****************************/
// 教室管理
router.all('/classroom_list',classroomAction.list);
router.all('/classroom_pre_add',classroomAction.preAdd);
router.all('/classroom_add',classroomAction.Add);
router.all('/classroom_set', classroomAction.set);
router.all('/classroom_browse',classroomAction.detail);

// 排课情况
// 课程查询
router.all('/course_list',courseAction.list);
router.all('/course_add',courseAction.add);

/*********************员工管理****************************/
// 员工列表
router.all('/staff_list',staffAction.list);
router.all('/staff_add',staffAction.add);
router.all('/staff_preEdit',staffAction.preEdit);
router.all('/staff_save',staffAction.save);
router.all('/staff_del',staffAction.del);
// 员工培训
router.all('/staff_train_list',staffTrainAction.list);
router.all('/staff_train_edit',staffTrainAction.edit);
// 打卡记录
// 考勤类别
router.all('/attendance_type_list',attendanceTypeAction.list);
router.all('/attendance_type_edit',attendanceTypeAction.edit);
router.all('/attendance_type_save',attendanceTypeAction.save);
router.all('/attendance_type_del',attendanceTypeAction.del);
// 考勤变更
router.all('/attendance_change_list',attendanceChangeAction.list);
router.all('/attendance_change_edit',attendanceChangeAction.edit);
router.all('/attendance_change_save',attendanceChangeAction.save);
router.all('/attendance_change_del',attendanceChangeAction.del);
// 查询考勤
// 绩效查询
// 绩效考勤

/*********************会员管理****************************/
// 会员卡类型
router.all('/member_card_type_list',memberCardTypeAction.list);
router.all('/to_member_card_type_edit',memberCardTypeAction.goEdit);
router.all('/to_member_card_type_Add',memberCardTypeAction.goAdd);
router.all('/member_card_type_del',memberCardTypeAction.del);
router.all('/member_card_type_addOrEdit',memberCardTypeAction.addOrEdit);
router.all('/getMemberCartTypeById',memberCardTypeAction.getMemberCartTypeById);

// 会员卡管理
router.all('/member_card_list',memberCardAction.list);
router.all('/to_member_card_edit',memberCardAction.goEdit);
router.all('/to_member_card_Add',memberCardAction.goAdd);
router.all('/member_card_del',memberCardAction.del);
router.all('/member_card_addOrEdit',memberCardAction.addOrEdit);
router.all('/member_card_show',memberCardAction.show);
// 活动管理
router.all('/activity_manage_list',activityManageAction.list);
router.all('/activity_manage_goAdd',activityManageAction.goAdd);
router.all('/activity_manage_add',activityManageAction.add);
router.all('/activity_manage_show',activityManageAction.show);
router.all('/activity_manage_preEdit',activityManageAction.preEdit);
router.all('/activity_manage_doEdit',activityManageAction.doEdit);
router.all('/activity_manage_del',activityManageAction.del);
// 会员列表
router.all('/member_list',memberAction.list);
router.all('/member_goAdd',memberAction.goAdd);
router.all('/member_add',memberAction.add);
router.all('/member_show',memberAction.show);
router.all('/member_preEdit',memberAction.preEdit);
router.all('/member_doEdit',memberAction.doEdit);
router.all('/member_del',memberAction.del);
router.all('/member_select',memberAction.select);
router.all('/getMemberByNameTel',memberAction.getMemberByNameTel);
// 预约服务
router.all('/service_meet_list',serviceMeetAction.list);
router.all('/service_meet_add',serviceMeetAction.add);
router.all('/service_meet_goadd',serviceMeetAction.goAdd);
router.all('/service_meet_show',serviceMeetAction.show);
router.all('/service_meet_preEdit',serviceMeetAction.preEdit);
router.all('/service_meet_doEdit',serviceMeetAction.doEdit);
router.all('/service_meet_del',serviceMeetAction.del);
router.all('/service_meet_select', serviceMeetAction.select);

// 课程报名
router.all('/class_meet_list',classMeetAction.list);
router.all('/class_meet_add',classMeetAction.add);
// 护理服务
router.all('/nurs_service_list',nursServiceAction.list);
router.all('/nurs_service_add',nursServiceAction.add);
router.all('/nurs_service_goAdd',nursServiceAction.goAdd);
router.all('/nurs_service_show',nursServiceAction.show);
router.all('/nurs_service_preEdit',nursServiceAction.preEdit);
router.all('/nurs_service_doEdit',nursServiceAction.doEdit);
router.all('/nurs_service_del',nursServiceAction.del);

// 收费信息

// 回访信息
router.all('/return_visit_list',returnVisitAction.list);
router.all('/return_visit_goAdd',returnVisitAction.goAdd);
router.all('/return_visit_add',returnVisitAction.add);
router.all('/return_visit_show',returnVisitAction.show);
router.all('/return_visit_preEdit',returnVisitAction.preEdit);
router.all('/return_visit_doEdit',returnVisitAction.doEdit);
router.all('/return_visit_del',returnVisitAction.del);

// 投诉信息
router.all('/complain_list',complainAction.list);
router.all('/complain_goAdd',complainAction.goAdd);
router.all('/complain_add',complainAction.add);
router.all('/complain_show',complainAction.show);
router.all('/complain_preEdit',complainAction.preEdit);
router.all('/complain_doEdit',complainAction.doEdit);
router.all('/complain_del',complainAction.del);



/*********************进销存管理***************************/
// 服务管理
router.all('/service_list', serviceAction.list);
router.all('/service_add', serviceAction.add);
router.all('/service_pre_add', serviceAction.preAdd);
router.all('/service_browse', serviceAction.browse);
router.all('/service_pre_edit', serviceAction.preEdit);
router.all('/service_update', serviceAction.update);
router.all('/service_del', serviceAction.del);
router.all('/service_select', serviceAction.select);
// 商品管理
router.all('/wares_list', waresAction.list);
router.all('/wares_modular', waresAction.modular);
router.all('/wares_detail', waresAction.detail);
router.all('/wares_pre_edit', waresAction.preEdit);
router.all('/wares_update', waresAction.waresUpdate);
router.all('/wares_pre_add', waresAction.preAdd);
router.all('/wares_add', waresAction.add);
router.all('/wares_del', waresAction.del);
router.all('/wares_select', waresAction.select);

// 库房管理
router.all('/storeroom_list',storeroomAction.list);
router.all('/storeroom_add', storeroomAction.add);
router.all('/storeroom_pre_edit', storeroomAction.preEdit);
router.all('/storeroom_update', storeroomAction.update);
router.all('/storeroom_pre_add', storeroomAction.preAdd);
router.all('/storeroom_del', storeroomAction.del);
router.all('/storeroom_detail', storeroomAction.detail);

// 经销商管理
router.all('/distributor_list',distributorAction.list);
router.all('/distributor_add', distributorAction.add);
router.all('/distributor_pre_add', distributorAction.preadd);
router.all('/distributor_browse', distributorAction.detail);
router.all('/distributor_del', distributorAction.del);
router.all('/distributor_pre_edit', distributorAction.preEdit);
router.all('/distributor_update', distributorAction.update);
// 入库管理
router.all('/storeroom_in_list',storeroomInAction.list);
router.all('/storeroom_in_pre_add', storeroomInAction.preAdd);
router.all('/storeroom_in_add', storeroomInAction.add);
router.all('/storeroom_in_detail', storeroomInAction.detail)
// 出库管理
router.all('/storeroom_out_list',storeroomOutAction.list);
router.all('/storeroom_out_pre_add', storeroomOutAction.preAdd);
router.all('/storeroom_out_add', storeroomOutAction.add);
router.all('/storeroom_check', storeroomOutAction.checkResidue);
router.all('/storeroom_out_detail', storeroomOutAction.detail);
// 移库管理
router.all('/storeroom_move_list',storeroomMoveAction.list);
router.all('/storeroom_move_add', storeroomMoveAction.add);


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
router.all('/sys_resources_list',sysResourcesAction.list);
router.all('/sys_resources_add', sysResourcesAction.edit);
router.all('/sys_resources_save', sysResourcesAction.save);
router.all('/sys_resources_del', sysResourcesAction.del);
// 菜单管理
router.all('/sys_menu_list',sysMenuAction.list);
router.all('/sys_menu_add', sysMenuAction.edit);//跳转适用于查看、修改、添加页面
router.all('/sys_menu_del', sysMenuAction.del);
router.all('/sys_menu_save', sysMenuAction.save);
// 角色管理
router.all('/sys_role_list',sysRoleAction.list);
router.all('/sys_role_add', sysRoleAction.edit);//跳转适用于查看、修改、添加页面
router.all('/sys_role_save', sysRoleAction.save);
router.all('/sys_role_del', sysRoleAction.del);
// 系统用户管理
router.all('/sys_user_list',sysUserAction.list);
router.all('/sys_user_add', sysUserAction.edit);
router.all('/sys_user_save', sysUserAction.save);
router.all('/sys_user_del', sysUserAction.del);
// 个人设置
router.all('/sys_user_set',sysUserAction.set);

//demo演示
router.all('/layui_demo',demoAction.layui);


module.exports = router;