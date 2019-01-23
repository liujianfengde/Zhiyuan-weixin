function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}
function getLoopArray(start, end,temp) {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    if(temp=="Y"){
      array.push(withData(i)+"年");
    }else if(temp=="M"){
      array.push(withData(i) + "月");
    }else if(temp=="D"){
      array.push(withData(i) + "日");
    }else if(temp=="H"){
      array.push(withData(i) + "时");
    }else if(temp=="m"){
      array.push(withData(i) + "分");
    }else if(temp=="s"){
      array.push(withData(i) + "秒");
    }
    
  }
  return array;
}
function getMonthDay(year, month,temp) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(1, 31,temp)
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(1, 30,temp)
      break;
    case '02':
      array = flag ? getLoopArray(1, 29,temp) : getLoopArray(1, 28,temp)
      break;
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array;
}
function getNewDateArry() {
  // 当前时间的处理
  var newDate = new Date();
  var year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    hour = withData(newDate.getHours()),
    minu = withData(newDate.getMinutes()),
    seco = withData(newDate.getSeconds());

  return [year, mont, date, hour, minu, seco];
}
function dateTimePicker(startYear, endYear, date) {
  // 返回默认显示的数组和联动数组的声明
  var dateTime = [], dateTimeArray = [[], [], [], [], [], []];
  var start = startYear || 1978;
  var end = endYear || 2100;
  // 默认开始显示数据
  var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();
  // 处理联动列表数据
  /*年月日 时分秒*/
  dateTimeArray[0] = getLoopArray(start, end,"Y");
  dateTimeArray[1] = getLoopArray(1, 12,"M");
  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1],"D");
  dateTimeArray[3] = getLoopArray(0, 23,"H");
  dateTimeArray[4] = getLoopArray(0, 59,"m");
  dateTimeArray[5] = getLoopArray(0, 59,"s");

  dateTimeArray.forEach((current, index) => {
    current = current.toString().replace(/年/g, "").replace(/月/g, "").replace(/日/g, "").replace(/时/g, "").replace(/分/g, "").replace(/秒/g, "").split(",");
    dateTime.push(current.indexOf(defaultDate[index]));
  });

  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
}
module.exports = {
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay
}