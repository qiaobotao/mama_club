/**
 * Created by qiaojoe on 15-12-5.
 */


var express = require('express');
var router = express.Router();

var welcomeAction = require('./welcomeAction');
var shopAction = require('./shopAction');//门店信息维护
var storeroomAction = require('./storeroomAction');//库房信息维护
var waresAction = require('./waresAction');//商品信息维护
var classifyAction = require('./classifyAction');//数据字典维护
var classroomAction = require('./classroomAction');//教室管理
var courseAction = require('./courseAction');//课程管理
var coursePlanAction = require('./coursePlanAction');//排课管理
var staffAction = require('./staffAction');//员工管理
var staffTrainAction = require('./staffTrainAction');//员工培训
var attendanceTypeAction = require('./attendanceTypeAction');//考勤类型
var attendanceChangeAction = require('./attendanceChangeAction');//考勤变更
var attendanceSearchAction = require('./attendanceSearchAction');//考勤变更
var performanceSearchAction = require('./performanceSearchAction');//绩效查询
var performanceAttendanceAction = require('./performanceAttendanceAction');//绩效考核
var staffLevelAction = require('./staffLevelAction');//员工等级管理
var memberCardTypeAction = require('./memberCardTypeAction');//会员卡类型
var activityManageAction = require('./activityManageAction');//活动管理
var memberAction = require('./memberAction');//会员管理
var classMeetAction = require('./classMeetAction');//预约课程管理
var serviceMeetAction = require('./serviceMeetAction');//预约服务管理
var nursServiceAction = require('./nursServiceAction');//护理服务管理
var moneyManageAction = require('./moneyManageAction');//费用管理
var returnVisitAction = require('./returnVisitAction');//回访信息管理
var complainAction = require('./complainAction');//投诉信息管理
var serviceAction = require('./serviceAction');//服务信息管理
var distributorAction = require('./distributorAction');//经销商管理
var storeroomInAction = require('./storeroomInAction');//入库管理
var storeroomOutAction = require('./storeroomOutAction');//出库管理
var storeroomMoveAction = require('./storeroomMoveAction');//移库管理
var inventoryAction = require('./inventoryAction');//库存管理

var sysResourcesAction = require('./sysResourcesAction');//资源管理
var sysMenuAction = require('./sysMenuAction');//菜单管理
var sysRoleAction = require('./sysRoleAction');//角色管理
var sysUserAction = require('./sysUserAction');//系统用户管理
var noticeAction = require('./noticeAction');//公告管理
var punchCardAction = require('./punchCardAction');
var brandAction = require('./brandAction');

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
router.all('/shop_pre_add',shopAction.preAdd);//添加门店
router.all('/shop_add',shopAction.add);//保存门店
router.all('/shop_del', shopAction.del);//删除门店
router.all('/shop_browse',shopAction.browse);//门店浏览
router.all('/shop_pre_edit',shopAction.preEdit);//编辑门店
router.all('/shop_update',shopAction.update);//修改门店
router.all('/check_shopseril',shopAction.checkSeril);//检查门店号是否重复
router.all('/check_shopname', shopAction.checkName);//检查门店名称是否重复
router.all('/shop_count',shopAction.shopCount);

/*********************教室及课程管理****************************/
// 教室管理
router.all('/classroom_list',classroomAction.list);
router.all('/classroom_pre_add',classroomAction.preAdd);
router.all('/classroom_add',classroomAction.Add);
router.all('/classroom_set', classroomAction.set);
router.all('/classroom_browse',classroomAction.detail);
router.all('/classroom_checkseril',classroomAction.checkSeril);
router.all('/classroom_checkname',classroomAction.checkName);
router.all('/classroom_preedit',classroomAction.preEdit);
router.all('/classroom_checkdel',classroomAction.checkdel);
router.all('/classroom_del',classroomAction.del);
router.all('/classroom_update',classroomAction.update);
router.all('/classroom_getcode',classroomAction.getCode);


// 排课情况
router.all('/course_plan',coursePlanAction.list);
router.all('/course_plan_pre_add',coursePlanAction.preadd);
router.all('/course_plan_edit',coursePlanAction.edit);
router.all('/course_plan_add',coursePlanAction.add);
router.all('/course_plan_update',coursePlanAction.update);

// 课程查询
router.all('/course_list',courseAction.list);
router.all('/course_add',courseAction.add);
router.all('/course_select',courseAction.select);
router.all('/course_select_activity',courseAction.selectForActivity);
router.all('/course_detail',courseAction.detail);
router.all('/course_del', courseAction.del);
/*********************员工管理****************************/
// 员工列表
router.all('/staff_list',staffAction.list);
router.all('/staff_add',staffAction.add);
router.all('/staff_preEdit',staffAction.preEdit);
router.all('/staff_add_qualification',staffAction.editQualification);
router.all('/staff_save_qualification',staffAction.saveQualification);
router.all('/staff_del_qualification',staffAction.delQualification);
router.all('/staff_save',staffAction.save);
router.all('/staff_del',staffAction.del);
router.all('/staff_select_train',staffAction.selectForTrain);
router.all('/staff_select_servicemeet',staffAction.selectForServiceMeet);

// 员工培训
router.all('/staff_train_list',staffTrainAction.list);
router.all('/staff_train_edit',staffTrainAction.edit);
router.all('/staff_train_save',staffTrainAction.save);

// 打卡记录
router.all('/punch_card_list',punchCardAction.list);
router.all('/punch_pre_import',punchCardAction.preimport);
router.all('/punch_import',punchCardAction.import);
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
router.all('/attendance_search_list',attendanceSearchAction.list);
// 绩效查询
router.all('/performance_search_list',performanceSearchAction.list);
// 绩效考勤
router.all('/performance_attendance_list',performanceAttendanceAction.list);
router.all('/performance_attendance_save',performanceAttendanceAction.save);
router.all('/performance_search_del',performanceAttendanceAction.del);
// 员工等级
router.all('/staff_level_list',staffLevelAction.list);
router.all('/staff_level_edit',staffLevelAction.preEdit);
router.all('/staff_level_save',staffLevelAction.save);
router.all('/staff_level_del',staffLevelAction.delStaffLevel);

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
router.all('/member_card_check', memberCardAction.checkResidue);
router.all('/member_card_select', memberCardAction.select);
// 活动管理
router.all('/activity_manage_list',activityManageAction.list);
router.all('/activity_manage_goAdd',activityManageAction.goAdd);
router.all('/activity_manage_add',activityManageAction.add);
router.all('/activity_manage_show',activityManageAction.show);
router.all('/activity_manage_preEdit',activityManageAction.preEdit);
router.all('/activity_manage_doEdit',activityManageAction.doEdit);
router.all('/activity_manage_del',activityManageAction.del);
router.all('/ajax_activity_manage_by_id',activityManageAction.fetchActivityManageById);
// 会员列表
router.all('/member_list',memberAction.list);
router.all('/member_goAdd',memberAction.goAdd);
router.all('/member_add',memberAction.add);
router.all('/member_show',memberAction.show);
router.all('/member_preEdit',memberAction.preEdit);
router.all('/member_doEdit',memberAction.doEdit);
router.all('/member_add_by_tel',memberAction.addMemberByTel);
router.all('/member_del',memberAction.del);
router.all('/member_select',memberAction.select);
router.all('/member_all_select',memberAction.selectAll);
router.all('/getMemberByMemberId',memberAction.getMemberByMemberId);
router.all('/member_select_activity',memberAction.selectForActivity);
// 预约服务
router.all('/service_meet_list',serviceMeetAction.list);
router.all('/service_meet_preEdit',serviceMeetAction.preEdit);
router.all('/service_meet_doEdit',serviceMeetAction.doEdit);
router.all('/service_meet_del',serviceMeetAction.del);
router.all('/service_meet_select', serviceMeetAction.select);

// 课程报名
router.all('/class_meet_list',classMeetAction.list);
router.all('/class_meet_goAdd',classMeetAction.goAdd);
router.all('/class_meet_add',classMeetAction.add);
router.all('/class_meet_show',classMeetAction.show);
router.all('/class_meet_preEdit',classMeetAction.preEdit);
router.all('/class_meet_doEdit',classMeetAction.doEdit);
router.all('/class_meet_del',classMeetAction.del);
router.all('/checkIsSelectCourse',classMeetAction.checkIsSelectCourse);
router.all('/class_meet_select_list',classMeetAction.classMeetSelectList);

// 护理服务
router.all('/nurs_service_list',nursServiceAction.list);
router.all('/nurs_service_list_select',nursServiceAction.select);
router.all('/nurs_service_preEdit',nursServiceAction.preEdit);//进入编辑界面
router.all('/nurs_service_doEdit',nursServiceAction.doEdit);//更新数据库信息
router.all('/nurs_service_del',nursServiceAction.del);
router.all('/nurs_service_create_no',nursServiceAction.createNo);
router.all('/open_upload_nursService_breast_image',nursServiceAction.openUploadBreastImage);//上传乳房示意图
router.all('/save_upload_nursService_breast_image',nursServiceAction.saveUploadBreastImage);//上传乳房示意图
router.all('/nurs_service_getPrincipals_serviceId',nursServiceAction.getPrincipalsByServiceId);//根据护理服务单id获取参与服务的技师人员信息

// 收费信息
router.all('/money_manage_list',moneyManageAction.list);
router.all('/money_manage_edit',moneyManageAction.edit);
router.all('/money_manage_save',moneyManageAction.save);
router.all('/money_manage_del',moneyManageAction.del);

// 回访信息
router.all('/return_visit_list',returnVisitAction.list);
router.all('/return_visit_preEdit',returnVisitAction.preEdit);//进入编辑页面
router.all('/return_visit_doEdit',returnVisitAction.doEdit);//保存数据

// 投诉信息
router.all('/complain_list',complainAction.list);
router.all('/complain_edit',complainAction.preEdit);//进入投诉新增页面
router.all('/complain_save',complainAction.save);//保存数据
router.all('/complain_del',complainAction.del);
//router.all('/complain_select', complainAction.select);


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
router.all('/service_select_activity', serviceAction.selectForActivity);
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
router.all('/wares_select_in_storeroom', waresAction.selectFromInventory);
router.all('/wares_checkseril', waresAction.check_serial);
router.all('/wares_checkname',waresAction.check_name);

// 商标管理
router.all('/brand_list',brandAction.list);
router.all('/brand_pre_add',brandAction.preAdd);
router.all('/brand_add', brandAction.add);
router.all('/brand_checkname',brandAction.checkName);
router.all('/brand_browse', brandAction.browse);
router.all('/brand_del', brandAction.del);
router.all('/brand_update',brandAction.update);
router.all('/brand_pre_update', brandAction.preUpdate);
router.all('/brand_del_check',brandAction.checkDel);

// 库房管理
router.all('/storeroom_list',storeroomAction.list);
router.all('/storeroom_add', storeroomAction.add);
router.all('/storeroom_pre_edit', storeroomAction.preEdit);
router.all('/storeroom_update', storeroomAction.update);
router.all('/storeroom_pre_add', storeroomAction.preAdd);
router.all('/storeroom_del', storeroomAction.del);
router.all('/storeroom_detail', storeroomAction.detail);
router.all('/storeroom_checkseril', storeroomAction.checkseril);
router.all('/storeroom_checkname',storeroomAction.checkName);


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
router.all('/storeroom_move_pre_add', storeroomMoveAction.preadd);
router.all('/storeroom_move_add', storeroomMoveAction.add);
router.all('/storeroom_move_detail', storeroomMoveAction.detail);
// 查看库存
router.all('/storeroom_inventory', inventoryAction.list);


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
router.all('/sys_user_set_save',sysUserAction.updateSetBySysUser);
// 公告管理
router.all('/notice_list',noticeAction.list);
router.all('/notice_user_list',noticeAction.listByUser);
router.all('/notice_edit',noticeAction.preEdit);
router.all('/notice_view',noticeAction.view);
router.all('/notice_save',noticeAction.save);
router.all('/notice_del',noticeAction.del);


//demo演示
router.all('/layui_demo',demoAction.layui);


module.exports = router;