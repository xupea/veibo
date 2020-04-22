const padding = (num) => (num < 10 ? "0".concat(num) : num);

export default (value) => {
  const date = new Date(value);
  if (
    Number.isNaN(date.getTime()) ||
    ("string" === typeof value &&
      (-1 !== value.indexOf("-") || -1 !== value.indexOf(".")))
  )
    return value;

  const now = new Date();
  const interval = (now - date) / 1000;

  let formatTime = "";

  // 如果小于1天 == 86400秒
  if (interval < 86400) {
    // 同一天
    if (date.getDate() === now.getDate()) {
      if (interval < 60) {
        formatTime = "刚刚";
      } else {
        if (interval < 3600) {
          formatTime = `${(interval / 60).toFixed()}分钟前`;
        } else {
          formatTime = `${(interval / 3600).toFixed()}小时前`;
        }
      }
    } else {
      formatTime = `昨天 ${padding(date.getHours())}${padding(
        date.getMinutes()
      )}`;
    }
  } else {
    if (date.getFullYear() === now.getFullYear()) {
      formatTime = `${date.getMonth() + 1}-${date.getDate()}-${padding(
        date.getHours()
      )}:${padding(date.getMinutes())}`;
    } else {
      formatTime = `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()}`;
    }
  }

  return formatTime;
};
