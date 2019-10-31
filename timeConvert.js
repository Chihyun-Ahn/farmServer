function convertToTime(intTime){
    if(intTime == "-"){
        return "no data";
    }else if(intTime == null){
        return "no data";
    }
    var nowTime = (new Date(intTime))*1;
    var year = nowTime.getFullYear();
    var month = nowTime.getMonth()+1;
    var date = nowTime.getDate();
    var hour = nowTime.getHours();
    var min = nowTime.getMinutes();
    var sec = nowTime.getSeconds();
    var milliSec = nowTime.getMilliseconds();

    month       = addZero(month);
    date        = addZero(date);
    hour        = addZero(hour);
    min         = addZero(min);
    sec         = addZero(sec);
    milliSec    = addZeroMilli(milliSec);

    var returnString = year+"/"+month+"/"+date+"/"+hour+":"+min+":"+sec+":"+milliSec;
    
    return returnString; 
}

function getCurrentTime(){
    var now = (new Date()) * 1;
    var result = convertToTime(now);
    return result;
}

function addZero(num){
    var x = "";
    if(num < 10){
        x = "0"+num;
    }else{
        x = ""+num;
    }
    return x;
}

function addZeroMilli(num){
    var x = "";
    if(num < 10){
        x = "00"+num;
    }else if(num >= 10 && num < 100){
        x = "0"+num;
    }else{
        x = ""+num;
    }
    return x;
}

module.exports = {
    convertToTime: convertToTime,
    addZero: addZero,
    addZeroMilli: addZeroMilli,
    getCurrentTime: getCurrentTime
};