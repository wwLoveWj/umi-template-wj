import React, { useState } from "react";
import { InputNumber, Button } from "antd";
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
  value = { dayOfWeek: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0 },
  onChange,
}: {
  value: any;
  onChange: (params: any) => void;
}) {
  const [disabled, setDisabled] = useState(false);
  let obj: any = {
    dayOfWeek: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  };
  const onChangeAllInput = (e: any, unit: string) => {
    obj[unit] = e;
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
            disabled={disabled}
            value={value[item?.unit]}
            min={0}
            id={item?.unit}
            name={item?.unit}
            style={{ width: "60px", marginRight: "5px" }}
            max={item?.max}
            defaultValue={0}
            onChange={(e) => onChangeAllInput(e, item?.unit)}
            placeholder={item?.chinese}
          />
          <label htmlFor={item?.unit}>{item?.chinese}</label>
        </div>
      ))}
      <Button
        type="primary"
        onClick={() => {
          setDisabled(true);
          onChange(obj);
        }}
      >
        确定
      </Button>
      <Button
        onClick={() => {
          setDisabled(false);
        }}
      >
        修改
      </Button>
    </div>
  );
}
