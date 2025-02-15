import { Tooltip } from "antd";
import { UpOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import "./style.scss";

export default ({ scrollToTop }) => {
  const [showButton, setShowButton] = useState(false);
  const scrollThreshold = 2000; // 设置阈值
  // macos 用户 按 shift + 6 可以唤出更多表情……
  const EmojiText: { [key: string]: string } = {
    "0": "O_O", // 空
    "200": "^_^", // 成功
    "400": "T_T", // 错误请求
    "500": "X_X", // 服务器内部错误，无法完成请求
  };

  //   const scrollToTop = () => {
  //     debugger;
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   };

  // 监听键盘 ^ 键，回到顶部
  const handleKeyDown = (event: KeyboardEvent) => {
    debugger;
    if (event.key === "ArrowUp") {
      event.preventDefault();
      scrollToTop();
    }
  };

  useEffect(() => {
    // 监听滚动位置
    setShowButton(window.scrollY > scrollThreshold);
  }, []);

  useEffect(() => {
    // 监听滚动位置
    window.addEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <>
      <Tooltip
        placement="topLeft"
        title={`按下 ^ 键也能回到顶部哦 ${EmojiText[200]}`}
      >
        <div className="back-to-top" onClick={scrollToTop}>
          <div className="back-to-top-btn">
            <UpOutlined />
            <p>顶部</p>
          </div>
        </div>
      </Tooltip>
    </>
  );
};
