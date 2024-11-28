import React from "react";
import { InputNumber } from "antd";
import "../style.less";

const timeConfig = [
  {
    // min: 1900,
    max: 7,
    unit: "dayOfWeek",
    chinese: "周",
  },
  {
    // min: 1,
    max: 12,
    unit: "month",
    chinese: "月",
  },
  {
    // min: 1,
    max: 31,
    unit: "day",
    chinese: "日",
  },
  {
    max: 23,
    unit: "hour",
    chinese: "时",
  },
  {
    max: 59,
    unit: "minute",
    chinese: "分",
  },
  {
    max: 59,
    unit: "second",
    chinese: "秒",
  },
];
interface TimeType {
  dayOfWeek: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}
export default function TimeInput({
  value = [
    {
      dayOfWeek: "*",
      month: "*",
      day: "*",
      hour: "*",
      minute: "*",
      second: "*",
    },
  ],
  onChange,
}: {
  value: any;
  onChange: (params: any) => void;
}) {
  const onChangeAllInput = (e: any, unit: string) => {
    let result = [...value];
    result[0][unit] = e;
    onChange(result);
  };
  return (
    <div
      style={{
        width: "100%",
        gap: "10px",
        display: "flex",
        boxSizing: "border-box",
      }}
      className="time-notice"
    >
      {timeConfig?.map((item) => (
        <div key={item?.unit} style={{ display: "flex", alignItems: "center" }}>
          <InputNumber
            value={value[0][item?.unit]}
            min={0}
            id={item?.unit}
            name={item?.unit}
            style={{ width: "60px", marginRight: "5px" }}
            max={item?.max}
            defaultValue={"*"}
            onChange={(e) => onChangeAllInput(e, item?.unit)}
            placeholder={item?.chinese}
          />
          <label htmlFor={item?.unit}>{item?.chinese}</label>
        </div>
      ))}
    </div>
  );
}
