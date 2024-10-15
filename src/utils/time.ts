import dayjs from "dayjs";
import type { RangePickerProps } from "antd/es/date-picker";
// 日期选择器时间的禁用
export const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
export const disabledDate: RangePickerProps["disabledDate"] = (
  current: any
) => {
  // Can not select days before today and today
  return current && current < dayjs().startOf("day");
};
export const disabledRangeTime: RangePickerProps["disabledTime"] = (
  _,
  type: string
) => {
  if (type === "start") {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56],
  };
};
//当日只能选择当前时间之后的时间点
export const disabledTime = (date: any) => {
  const currentDay = dayjs().date(); //当下的时间
  const currentHours = dayjs().hour();
  const currentMinutes = dayjs().minute(); //设置的时间
  const currentSeconds = dayjs().second(); //设置的时间
  const settingHours = dayjs(date).hour();
  const settingDay = dayjs(date).date();

  if (date && settingDay === currentDay && settingHours === currentHours) {
    // 这里需要分几种情况去禁用秒针
    return {
      disabledHours: () => range(0, currentHours), //设置为当天现在这小时，禁用该小时，该分钟之前的时间
      disabledMinutes: () => range(0, currentMinutes),
      // disabledSeconds: () => range(0, currentSeconds),
    };
  } else if (date && settingDay === currentDay && settingHours > currentHours) {
    return {
      disabledHours: () => range(0, currentHours), //设置为当天现在这小时之后，只禁用当天该小时之前的时间
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  } else if (date && settingDay === currentDay && settingHours < currentHours) {
    return {
      disabledHours: () => range(0, currentHours), //若先设置了的小时小于当前的，再设置日期为当天，需要禁用当天现在这小时之前的时间和所有的分
      disabledMinutes: () => range(0, 59),
      disabledSeconds: () => range(0, 59),
    };
  } else {
    return {
      disabledHours: () => [], //设置为当天之后的日期，则不应有任何时间分钟的限制
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  }
};
// 只有一位数字时添加“0”
const checkTime = function (i: number) {
  if (i < 10) {
    if (i < 0) {
      i = "00";
    } else {
      i = "0" + i;
    }
  }

  return i;
};
export const countDownTime = (reminderTime: string) => {
  //获取当前时间距离截止时间的倒计时
  //参数为截止时间
  const remainingTime = new Date(reminderTime) - new Date(); //计算剩余毫秒数
  let days = parseInt(remainingTime / 1000 / 60 / 60 / 24, 10); //计算剩余天数
  let hours = parseInt((remainingTime / 1000 / 60 / 60) % 24, 10); //计算剩余小时数
  let minutes = parseInt((remainingTime / 1000 / 60) % 60, 10); //计算剩分钟数
  let seconds = parseInt((remainingTime / 1000) % 60, 10); //计算剩余秒数
  days = checkTime(days).toString();
  hours = checkTime(hours).toString();
  minutes = checkTime(minutes).toString();
  seconds = checkTime(seconds).toString();
  return days + " : " + hours + " : " + minutes + " : " + seconds;
};
let timer: any = null;
// 获取倒计时时间
export const countDown = (
  dom: string,
  reminderTime: string,
  status: number
) => {
  clearInterval(timer);
  timer = setInterval(function () {
    if (document.getElementById(dom)) {
      (document.getElementById(dom) as HTMLDivElement).innerHTML = reminderTime
        ? countDownTime(reminderTime)
        : "";
    }
  }, 1000);
  // if (status === 1) {
  //   // clearInterval(timer);
  // }
  return countDownTime(reminderTime);
};
//毫秒数转换成时间
export const getCurrentTime = function (milliseconds?: string) {
  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1;
  var day = myDate.getDate();
  var hour = myDate.getHours();
  var minute = myDate.getMinutes();
  var second = myDate.getSeconds();

  month = checkTime(month).toString();
  day = checkTime(day).toString();
  hour = checkTime(hour).toString();
  minute = checkTime(minute).toString();
  second = checkTime(second).toString();

  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
  );
};
