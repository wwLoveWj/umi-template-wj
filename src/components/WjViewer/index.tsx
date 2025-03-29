import React, { forwardRef, useImperativeHandle, useState } from "react";
import styles from "./style.less";
import classnames from "classnames";
import { RightOutlined, LeftOutlined, CloseOutlined } from "@ant-design/icons";
import { useControllableValue } from "ahooks";

export default forwardRef(function Viewer(props: {
  isShowViewer: boolean;
  imageUrlList: API.ImageUploadType[];
  onChgisShowViewer: (param: boolean) => void;
  currentimgIdx: number;
  viewerRef: any;
}) {
  const {
    isShowViewer,
    imageUrlList,
    onChgisShowViewer, //是否展示查看器的方法
    currentimgIdx, //当前选中的图片
    viewerRef,
  } = props;
  const [imgIdx, setImgIdx] = useControllableValue<number>(props, {
    defaultValue: currentimgIdx,
  });
  useImperativeHandle(viewerRef, () => ({
    setImgIdx,
  }));
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
});
