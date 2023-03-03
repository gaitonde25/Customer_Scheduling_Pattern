import "./App.css";
import BarChart from "react-bar-chart";
import { DatePicker } from "antd";
import { useState, useEffect } from "react";
import ProcessData from "./ProcessSchData";
import GetPrevDate from "./GetPrevDate";

const { RangePicker } = DatePicker;

function App() {
  const [itemRes, setItemRes] = useState([]);
  const [prInfoRes, setPrInfoRes] = useState([]);
  const [schRes, setSchRes] = useState([]);

  const [isLinkActive, setIsLinkActive] = useState(true);
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);

  const onChange = (date, dateString) => {
    setData(itemRes[dateString]);
    console.log(itemRes[dateString]);
  };

  const setPercentageData = (data) => {
    let sum = 0;
    let res = [];
    Object.keys(data).forEach(function (idx) {
      sum += data[idx];
    });
    Object.keys(data).forEach(function (idx) {
      let obj = {
        text: "Prior " + idx,
        value: (data[idx] * 100) / sum,
      };
      if (obj.value > 0) res.push(obj);
    });
    if (res.length > 0) {
      setData2(res);
    } else {
      setData2(null);
    }
    console.log(res);
  };

  const onRangeChange = (x, range) => {
    let getPrevDateStart = GetPrevDate(range[0], 1);
    let getPrevDateEnd = GetPrevDate(range[1], 0);
    let res = prInfoRes[getPrevDateEnd];
    Object.keys(prInfoRes[getPrevDateStart]).forEach(function (idx) {
      res[idx] -= prInfoRes[getPrevDateStart][idx];
    });
    if (getPrevDateEnd === getPrevDateStart) setData2(null);
    else setPercentageData(res);
  };

  const handleBarClick = (ele, id) => {
    if (isLinkActive) {
      setData(schRes[ele.text]);
      setIsLinkActive(false);
    }
  };

  useEffect(() => {
    let res = ProcessData();
    setItemRes(res.itemRes);
    setSchRes(res.schRes);
    setPrInfoRes(res.prInfo);
  }, []);
  return (
    <>
      <h1
        style={{ fontSize: "4em", fontFamily: "ui-serif", textAlign: "center" }}
      >
        Customer Scheduling Pattern
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DatePicker onChange={onChange} />
        {data && (
          <BarChart
            ylabel="Schedules"
            width={700}
            height={500}
            margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
            data={data}
            onBarClick={handleBarClick}
          />
        )}
      </div>
      <h1
        style={{ fontSize: "4em", fontFamily: "ui-serif", textAlign: "center" }}
      >
        Prior Scheduling Time
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10%",
        }}
      >
        <RangePicker onChange={onRangeChange} />
        {data2 && (
          <BarChart
            ylabel="% of Schedules"
            width={800}
            height={500}
            margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
            data={data2}
            onBarClick={handleBarClick}
          />
        )}
      </div>
    </>
  );
}

export default App;
