export default (num) => {
  for (
    var t = [
        { num: 1e8, text: "亿" },
        { num: 1e7, text: "千万" },
        { num: 1e4, text: "万" },
      ],
      n = 0,
      i = t;
    n < i.length;
    n++
  ) {
    var o = i[n];
    if (num > o.num - 1) {
      var r = String(Math.floor((num / o.num) * 10) / 10),
        a = r.split(".");
      return "0" === a[1] || a[0].length > 2 ? a[0] + o.text : r + o.text;
    }
  }
  return num;
};
