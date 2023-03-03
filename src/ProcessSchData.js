import data from "./data";

function getDifferenceInDays(date1, date2) {
  const date_1 = new Date(date1);
  const date_2 = new Date(date2);
  const diffInMs = Math.abs(date_1 - date_2);
  return diffInMs / (1000 * 60 * 60 * 24);
}

const sortObj = (obj) => {
  return Object.keys(obj)
    .sort()
    .reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, {});
};

const preSum = (data) => {
  data = sortObj(data);
  let prev = null;
  Object.keys(data).forEach(function (idx) {
    if (prev) {
      Object.keys(prev).forEach(function (key) {
        if (data[idx][key]) {
          data[idx][key] += prev[key];
        } else {
          data[idx][key] = prev[key];
        }
      });
    }
    prev = data[idx];
  });
  return data;
};

const getPriorInfo = (data) => {
  let res = {};
  Object.keys(data).forEach(function (idx) {
    Object.keys(data[idx]).forEach(function (key) {
      if (res[idx]) {
        let pr = getDifferenceInDays(idx, key);
        res[idx][pr] = data[idx][key];
      } else {
        res[idx] = {
          [getDifferenceInDays(idx, key)]: data[idx][key],
        };
      }
    });
  });
  return preSum(res);
};

const retItemData = (data, isItm) => {
  let res = {};
  let slots = ["09-12", "12-15", "15-18", "18-09"];
  Object.keys(data).forEach(function (idx) {
    Object.keys(data[idx]).forEach(function (key) {
      let obj = {
        text: isItm ? key : slots[key],
        value: data[idx][key],
      };
      if (res[idx]) {
        res[idx].push(obj);
      } else {
        res[idx] = [obj];
      }
    });
  });
  return res;
};

const getSlot = (time) => {
  if (time >= "09:00:00" && time < "12:00:00") {
    return 0;
  } else if (time >= "12:00:00" && time < "15:00:00") {
    return 1;
  } else if (time >= "15:00:00" && time < "18:00:00") {
    return 2;
  } else return 3;
};

const ProcessSchData = () => {
  let itmRes = {};
  let schRes = {};
  data.map((ele, idx) => {
    let schDate = ele.schedule_time.split(" ")[0];
    let schTime = ele.schedule_time.split(" ")[1];
    // first
    if (itmRes[ele.item_date]) {
      if (itmRes[ele.item_date][schDate]) {
        itmRes[ele.item_date][schDate]++;
      } else itmRes[ele.item_date][schDate] = 1;
    } else {
      itmRes[ele.item_date] = {
        [schDate]: 1,
      };
    }
    // second
    if (!schRes[schDate]) {
      schRes[schDate] = [0, 0, 0, 0];
    }
    schRes[schDate][getSlot(schTime)]++;
  });
  return {
    itemRes: retItemData(itmRes, 1),
    schRes: retItemData(schRes, 0),
    prInfo: getPriorInfo(itmRes),
  };
};

export default ProcessSchData;
