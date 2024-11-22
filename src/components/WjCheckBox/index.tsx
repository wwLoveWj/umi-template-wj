import React, { useState } from "react";
import "./style.less";
export default function WjCheckBox({
  onChange,
}: {
  onChange: (checked: boolean) => void;
}) {
  const [checked, setchecked] = useState(true);
  return (
    <div className="container">
      <label className="switch">
        <input className="togglesw" type="checkbox" checked={checked} />
        <div className="indicator left"></div>
        <div className="indicator right"></div>
        <div
          className="button"
          onClick={() => {
            if (onChange) onChange(!checked);
            setchecked(!checked);
          }}
        ></div>
      </label>
    </div>
  );
}
