import React, { useState } from "react";
import styles from "./style.less";
import classnames from "classnames";
import { RightOutlined, LeftOutlined, CloseOutlined } from "@ant-design/icons";
export default function Viewer({
  isShowViewer,
  imageUrlList,
  onChgisShowViewer, //是否展示查看器的方法
  currentimgIdx, //当前选中的图片
}: {
  isShowViewer: boolean;
  imageUrlList: any[];
  onChgisShowViewer: (param: boolean) => void;
  currentimgIdx: number;
}) {
  const [imgIdx, setImgIdx] = useState(currentimgIdx);
  return (
    <>
      {isShowViewer && (
        <div className={styles?.overlayImg}>
          <img src={imageUrlList[imgIdx]?.imgUrl} alt="" />
          <div
            className={classnames(
              styles?.clearOverlayImg,
              styles?.switchImages
            )}
            onClick={() => onChgisShowViewer(false)}
          >
            <CloseOutlined />
          </div>

          {imgIdx > 0 && (
            <div
              className={classnames(
                styles?.clearOverlayLT,
                styles?.switchImages
              )}
              onClick={() => {
                setImgIdx(imgIdx - 1);
              }}
            >
              <LeftOutlined />
            </div>
          )}
          {imgIdx < imageUrlList?.length - 1 && (
            <div
              className={classnames(
                styles?.clearOverlayGT,
                styles?.switchImages
              )}
              onClick={() => {
                setImgIdx(imgIdx + 1);
              }}
            >
              <RightOutlined />
            </div>
          )}
        </div>
      )}
    </>
  );
}
