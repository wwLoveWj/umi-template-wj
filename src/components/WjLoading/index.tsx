import React from "react";
import styles from "./style.less";
export default function Index({
  upLoadProgress,
  style,
  fontSize,
}: {
  /**
   * 进度条进度数
   */
  upLoadProgress: number;
  style?: any;
  fontSize?: string | number;
}) {
  return (
    <div className={styles?.loading} style={style}>
      <div
        className={styles?.loadingContent}
        style={{ "--per": upLoadProgress + "%" }}
        id="box"
      >
        {/* 添加svg波浪 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.0"
          viewBox="0 0 600 140"
          className={styles?.boxWaves}
        >
          <path d="M 0 70 Q 75 20,150 70 T 300 70 T 450 70 T 600 70 L 600 140 L 0 140 L 0 70Z"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.0"
          viewBox="0 0 600 140"
          className={styles?.boxWaves}
        >
          <path d="M 0 70 Q 75 20,150 70 T 300 70 T 450 70 T 600 70 L 600 140 L 0 140 L 0 70Z"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.0"
          viewBox="0 0 600 140"
          className={styles?.boxWaves}
        >
          <path d="M 0 70 Q 75 20,150 70 T 300 70 T 450 70 T 600 70 L 600 140 L 0 140 L 0 70Z"></path>
        </svg>
      </div>
      <div
        className={styles?.boxText}
        style={{ fontSize }}
      >{`${upLoadProgress}%`}</div>
    </div>
  );
}
