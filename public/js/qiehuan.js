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