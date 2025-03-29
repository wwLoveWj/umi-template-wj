import React, { useEffect, useState } from "react";
import { FilesDragAndDrop } from "./FilesDragAndDropHook";
import classList from "./FilesDragAndDrop.scss";
import { onUploadImage } from "@/utils/index";

export default function Upload({
  onImgBg,
  imgSrc = "",
}: {
  onImgBg: (imgSrc: string) => void;
  imgSrc: string;
}) {
  debugger;
  const [isSuccess, setIsSuccess] = useState("");

  const onUpload = async (files, success) => {
    const result = (await onUploadImage(files)) || "";
    setIsSuccess(result);
    onImgBg(result);
  };

  useEffect(() => {
    setIsSuccess(imgSrc);
  }, [imgSrc]);
  return (
    <FilesDragAndDrop
      onUpload={onUpload}
      count={1}
      formats={["jpg", "png", "gif"]}
    >
      {isSuccess ? (
        <div className={classList["articleTop"]}>
          <img src={isSuccess} alt="" />
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
