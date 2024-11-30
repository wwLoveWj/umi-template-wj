import React from "react";
import "./style.less";
export default function WjMore() {
  return (
    <div className="button-container">
      <button className="button-3d">
        <div className="button-top">
          <span className="material-icons">❮</span>
        </div>
        <div className="button-bottom"></div>
        <div className="button-base"></div>
      </button>
      <button className="button-3d">
        <div className="button-top">
          <span className="material-icons">❯</span>
        </div>
        <div className="button-bottom"></div>
        <div className="button-base"></div>
      </button>
    </div>
  );
}
