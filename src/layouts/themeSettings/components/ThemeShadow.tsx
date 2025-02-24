import React from "react";
import classNames from "classnames";
import { useModel } from "umi";
import { storage } from "@/utils/storage";
import "../style.scss";
export default function ThemeShadow() {
  const { boxBorderMode, setBorderMode } = useModel("themeColor"); // 系统主题变量
  // 设置盒子模式
  const switchBoxMode = (isInit: boolean = false, type: string) => {
    if (
      (type === "shadow-mode" && !boxBorderMode) ||
      (type === "border-mode" && boxBorderMode)
    ) {
      return;
    }
    setBoxMode(isInit, type);
  };

  // 设置盒子边框 ｜ 阴影 样式
  const setBoxMode = (isInit: boolean = false, type: string) => {
    setTimeout(() => {
      const el = document.documentElement;
      el.setAttribute("data-box-mode", type);

      if (!isInit) {
        setBorderMode(!boxBorderMode);
        storage.set("borderMode", !boxBorderMode);
      }
    }, 50);
  };
  return (
    <div>
      <p className="title" style={{ marginTop: "40px" }}>
        盒子样式
      </p>
      <div className="box-style">
        <div v-if="false">{boxBorderMode}</div>
        <div
          className={classNames("button", {
            "is-active": !boxBorderMode,
          })}
          onClick={() => switchBoxMode(false, "shadow-mode")}
        >
          阴影
        </div>
        <div
          className={classNames("button", {
            "is-active": boxBorderMode,
          })}
          onClick={() => switchBoxMode(false, "border-mode")}
        >
          边框
        </div>
      </div>
    </div>
  );
}
