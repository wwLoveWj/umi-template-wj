import React, { useState } from "react";
import { FilesDragAndDrop } from "./FilesDragAndDropHook";
import classList from "./FilesDragAndDrop.scss";

export default function Upload() {
  const [isSuccess, setIsSuccess] = useState(false);
  const onUpload = (files, success) => {
    console.log(files);
    debugger;
    setIsSuccess(success);
  };
  return (
    <FilesDragAndDrop
      onUpload={onUpload}
      count={1}
      formats={["jpg", "png", "gif"]}
    >
      {isSuccess ? (
        <div className={classList["articleTop"]}>
          <img
            src="https://img0.baidu.com/it/u=1558344751,1233544091&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1734714000&t=dd1aa39bf0714b025dc361d83ea87fcf"
            alt=""
          />
        </div>
      ) : (
        <div className={classList["FilesDragAndDrop__area"]}>
          传下文件试试？
          <span
            role="img"
            aria-label="emoji"
            className={classList["area__icon"]}
          >
            &#128526;
          </span>
        </div>
      )}
    </FilesDragAndDrop>
  );
}
