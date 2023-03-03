import data from "./data";
const GetPrevDate = (date, isSmall) => {
  let keys = [];
  let obj = {};
  data = data.map((ele, idx) => {
    obj[ele.item_date] = 1;
    return ele;
  });
  Object.keys(obj).forEach(function (idx) {
    keys.push(idx);
  });
  keys = keys.sort();

  let ans = keys[0];
  for (let i = 0; i < keys.length; i++) {
    if (isSmall) {
      if (keys[i] >= date) return ans;
    } else {
      if (keys[i] > date) return ans;
    }
    ans = keys[i];
  }
  return ans;
};

export default GetPrevDate;
