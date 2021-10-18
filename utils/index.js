//金额格式
export const fmoney = (s, n = 2) => {
  let t = "";
  if (n) {
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    let l = s
        .split(".")[0]
        .split("")
        .reverse(),
      r = s.split(".")[1];

    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
    }
    return (
      t
        .split("")
        .reverse()
        .join("") +
      "." +
      r
    );
  } else {
    return s;
  }
};