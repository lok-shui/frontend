// 转为时分秒
export function timeFormat(s: any) {
  const h = Math.floor(s / 3600); // Math.floor()向下取整
  const m = Math.floor((s - h * 24 * 3600) / 3600);
  const minute = Math.floor((s - h * 24 * 3600 - m * 3600) / 60);
  const second = s - h * 24 * 3600 - m * 3600 - minute * 60;
  const result =
    h > 0 ? h + "小时" : "" + (minute > 0 ? minute + "分" : "") + second + "秒";
  return result;
}
// 时间判断
export function useTime(s: any) {
  if (s < 0) {
    s = Math.abs(s);
  }
  const h = Math.floor(s / 3600);
  const m = Math.floor((s - h * 24 * 3600) / 3600);
  const minute = Math.floor((s - h * 24 * 3600 - m * 3600) / 60);
  const second = s - h * 24 * 3600 - m * 3600 - minute * 60;
  if (h > 9999) {
    return h + "小时";
  } else if (h > 999 && h <= 9999) {
    return h + "小时" + (minute > 0 ? minute + "分" : "");
  } else if (h > 0 && h <= 999) {
    return h + "小时" + minute + "分" + second + "秒";
  } else {
    return (minute > 0 ? minute + "分" : "") + second + "秒";
  }
}
export function serviceusetime(s: any) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s - h * 24 * 3600) / 3600);
  const minute = Math.floor((s - h * 24 * 3600 - m * 3600) / 60);
  const second = s - h * 24 * 3600 - m * 3600 - minute * 60;
  let serviceusetime = {
    h: h,
    minute: minute,
    second: second
  };
  return serviceusetime;
}
// 次数判断
export function useNum(num: any) {
  const account =
    num / 100000000 > 1
      ? (num / 100000000).toFixed(2) + "亿次"
      : num / 1000000 > 1
      ? (num / 1000000).toFixed(2) + "百万次"
      : num / 10000 > 1
      ? (num / 10000).toFixed(2) + "万次"
      : num + "次";
  return account;
}
export function serviceusenum(num: any) {
  let serviceusenum = {
    account: "",
    unit: ""
  };
  serviceusenum.account =
    num / 100000000 > 1
      ? (num / 100000000).toFixed(2)
      : num / 1000000 > 1
      ? (num / 1000000).toFixed(2)
      : num / 10000 > 1
      ? (num / 10000).toFixed(2)
      : num;
  serviceusenum.unit =
    num / 100000000 > 1
      ? "亿次"
      : num / 1000000 > 1
      ? "百万次"
      : num / 10000 > 1
      ? "万次"
      : "次";
  return serviceusenum;
}
// 获取前几天的时间戳
export function timeStamp(day: any) {
  var today = new Date();

  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

  today.setTime(targetday_milliseconds); //注意，这行是关键代码

  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  console.log("date", tYear + "-" + tMonth + "-" + tDate);

  return tYear + "-" + tMonth + "-" + tDate;

  function doHandleMonth(month: any) {
    var m = month;
    if (month.toString().length == 1) {
      m = "0" + month;
    }
    return m;
  }
}

// UTC时间转为本地时间
export function utcToLocalTime(time: number) {
  const date = new Date(time);
  const year = date.getFullYear();
  /* 在日期格式中，月份是从0开始的，因此要加0
   * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
   * */
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  // 拼接
  return (
    year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  );
}
