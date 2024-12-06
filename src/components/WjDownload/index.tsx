import React from "react";
import "./style.less";
export default function WjDownload() {
  return (
    <div className="container-download">
      <label className="label-download">
        <input type="checkbox" className="input-download" />
        <span className="circle-download">
          <svg
            className="icon-download"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 19V5m0 14-4-4m4 4 4-4"
            ></path>
          </svg>
          <div className="square"></div>
        </span>
        <p className="title-download">Download</p>
        <p className="title-download">Open</p>
      </label>
    </div>
  );
}
