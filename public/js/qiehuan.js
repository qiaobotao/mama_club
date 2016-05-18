var courseDate = ['8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'];
/**
 * 根据传入的日期下标，返回该下标对应的日期
 */
function getTimeByIndex(index){
    return courseDate[index];
}

/*
 *    ForDight(Dight,How):数值格式化函数，Dight要
 *    格式化的  数字，How要保留的小数位数。
 */
function  ForDight(Dight,How)
{
    Dight  =  Math.round  (Dight*Math.pow(10,How))/Math.pow(10,How);
    return  Dight;
}
function checkresources(resourcesData,resourceUrl){
    var resourcesData = '<%-JSON.stringify(resourcesData)%>';
    resourcesData = JSON.parse(resourcesData);
    for(var i = 0 ; i < resourcesData.lent ; i++){
        alert("resourcesData[i]"+resourcesData[i]);
    }
}


function checkresources1(userMenus,url){
    alert("1212"+userMenus[url]);
}
//校验手机号码
function isMobil(s) {
    var patrn = /^(13[0-9]{9})|(14[0-9])|(18[0-9])|(15[0-9][0-9]{8})$/;
    if (!patrn.exec(s)) return false
    return true
}
/**
 * list页面点击删除按钮给出的提示弹出框
 * @param url :点击确认删除后跳转的地址
 */
function delData(url){
    parent.layer.confirm('是否删除本条记录？删除后将不能恢复！', {
        btn: ['确认删除','取消'] //按钮
    }, function(){
        parent.layer.msg('正在删除', {
            icon: 3,
            time: 1000, //500毫秒后自动关闭
        });
        window.location.href=url;
    }, function(){
    });
}