/**
 * Created by kuanchang on 16/3/21.
 * 绩效查询
 */

var service = require('../../model/service/performanceSearch');
var attendanceTypeService = require('../../model/service/attendanceType');
/**
 * 获取绩效查询数据
 * @param req
 * @param res
 */
module.exports.list = function (req, res) {
    var workDate = ['8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30'];
    var staffId = req.query.staffId ? req.query.staffId : '';//员工名称
    var staffName = req.query.staffName ? req.query.staffName : '';//员工名称
    var performanceDate = req.query.performanceDate ? req.query.performanceDate : '';//考勤时间
    if(staffId == ''){
        res.render('performanceSearch/performanceSearchList',{data : {}});
        return;
    }
    /**
     * 1、查找该月份的打卡记录
     * 2、查找该月份用到的考勤类别
     * 3、查找该月份内的考勤变更信息
     * 4、遍历所有打卡记录，找到正常考勤天数等表格所需数据
     */
    var curMonthDays = new Date(performanceDate.split("-")[0], performanceDate.split("-")[1], 0).getDate();
    service.fetchPerformanceSearch(staffId,performanceDate+"-01", performanceDate+"-"+curMonthDays,function (err, results) {
        if (!err) {
            results.staffId = staffId;
            results.staffName = staffName;
            results.performanceDate = performanceDate;
            var attendanceIds = "";
            for(var attId = 0 ; attId < results.staffAttendanceDatas.length ; attId ++){
                attendanceIds = results.staffAttendanceDatas[attId].attendanceId+",";
            }
            attendanceIds = attendanceIds == ""?attendanceIds:attendanceIds.substring(0,attendanceIds.length-1);
            //根据员工考勤周期信息获取对应考勤详情
            attendanceTypeService.getCategoryMXByIds(attendanceIds,function (err, categoryMXList) {
                if (!err) {

                    /**
                     * 对打卡记录单独处理，判断在此时间段内，有多少次正常考勤天数
                     * 1、遍历打卡数据集合
                     * 2、找到同一天打卡的开始、截止时间
                     * 3、判断这天是否考勤正常
                     */
                    var attendanceNum = 0 ;
                    for(var i = 0 ; i < results.attendanceDatas.length ; i ++){//遍历打卡记录
                        var signDate = results.attendanceDatas[i].date;//打卡日期
                        var signMinTime = results.attendanceDatas[i].minTime;//上班打卡时间
                        var signMaxTime = results.attendanceDatas[i].maxTime;//下班打卡时间
                        if(signMinTime != signMaxTime ){//上下班打卡时间不一样
                            /**
                             * 开始、截止时间不一致
                             * 1、根据某打卡日期（星期几）找到该天是否上班
                             * 2、如果上班，判断是否在当天考核周期呢
                             * 3、在当天考核周期内（出勤天数+1）；不在考核周期内，判断是否有请假，有则对应处理
                             *
                             */
                            for(var j = 0 ; j < results.staffAttendanceDatas.length ; j ++){//找到打卡时间对应的哪个考勤周期
                                var attendanceId = results.staffAttendanceDatas[j].attendanceId;//考勤表id
                                var attendanceStartDate = results.staffAttendanceDatas[j].attendanceStartDate;
                                var attendanceEndDate = results.staffAttendanceDatas[j].attendanceEndDate;
                                if(Date.parse(attendanceStartDate) <= Date.parse(signDate) && Date.parse(signDate) <= Date.parse(attendanceEndDate)){
                                    //找到该周期内的考勤情况
                                    for(var k = 0 ; k < categoryMXList.length ; k ++){//遍历子表各星期情况来对比工作时长
                                        if(categoryMXList[k].attendanceCategoryId == attendanceId
                                            && categoryMXList[k].weekNum == new Date(signDate).getDay()){//找到考勤，并比对星期，进行判断
                                            //上班时间、下班时间，是否在考勤期内
                                            var startJobTime = signDate +" "+workDate[categoryMXList[k].startDate]+":00";
                                            var endJobTime = signDate + " " + workDate[categoryMXList[k].endDate] + ":00";
                                            if(Date.parse(signMinTime) <= Date.parse(startJobTime) && Date.parse(endJobTime) <= Date.parse(signMaxTime)){
                                                attendanceNum++;
                                                continue;//当确定该日期考勤正常进行下一天处理
                                            }
                                        }
                                    }
                                }
                            }

                        }

                        // 在考勤变更中查看是否已经请假
                    }
                    results.attendanceNum = attendanceNum;//考勤时间
                    res.render('performanceSearch/performanceSearchList', {data : results});
                } else {
                    console.log(err.message);
                    res.render('error');
                }
            });
        } else {
            console.log(err.message);
            res.render('error');
            // next();
        }
    });
}