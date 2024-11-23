import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Col, Progress, Row } from "antd";
import { uploadImage } from "@/utils/index";
import {
  PlusOutlined,
  CloseCircleOutlined,
  RightOutlined,
  LeftOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import styles from "./style.less";
import { getToken } from "@/utils/localToken";
import { imgInfoQueryAPI, imgInfoDeleteAPI } from "@/service/api/file";
import { useRequest } from "ahooks";
import WjLoading from "@/components/WjLoading";
import classnames from "classnames";
import WjViewer from "@/components/WjViewer";
const UploadPage = ({
  getImgUrl,
}: {
  getImgUrl: ({ data }: { data: { filename: string; path: string } }) => void;
}) => {
  const [upLoadProgress, setupLoadProgress] = useState(0);
  const [displayClear, setDisplayClear] = useState("");
  const [showImgUrl, setShowImgUrl] = useState("");
  const [imgIdx, setImgIdx] = useState(0);
  const viewerRef = useRef(null);

  const getStrokeColor = () => {
    return upLoadProgress > 50 ? "green" : "red";
  };

  // 删除图片url
  const { run: imgInfoDeleteAPIRun } = useRequest(imgInfoDeleteAPI, {
    onSuccess: () => {
      queryImgListRun();
    },
  });
  // 查询图片上传列表
  const { run: queryImgListRun, data: imageUrlList } =
    useRequest(imgInfoQueryAPI);

  // 获取上传的url地址
  const getUrl = async (formData: any) => {
    let token = await getToken();
    axios({
      url: "http://localhost:3007/file/upload",
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
      onUploadProgress: function (progressEvent) {
        //原生获取上传进度的事件
        if (progressEvent?.event?.lengthComputable) {
          //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
          //   setupLoadProgress((progressEvent.loaded / progressEvent.total) * 100); //实时获取上传进度
          setupLoadProgress(
            Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            )
          );
        }
      },
    }).then((res) => {
      debugger;
      getImgUrl && getImgUrl(res);
      if (res.status === 200) {
        queryImgListRun();
        // setDisplayClear(true);
        // axios({
        //   url: "http://localhost:3007/imgOCR",
        //   method: "post",
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        //   data: { imgUrl: res.data.url },
        // }).then((res) => {
        //   console.log(res, "识别的文字----------");
        // });
      }
    });
  };

  return (
    <>
      <Row className={styles?.imgList} gutter={[10, 10]}>
        {imageUrlList?.map((item: API.ImageUploadType, index: number) => (
          <Col key={item?.imgId} className={styles?.imgCol} span={6}>
            <img
              src={item?.imgUrl}
              alt="文件上传图片"
              id={item?.imgId}
              onMouseEnter={(e) => {
                setDisplayClear(e.target.id);
              }}
              onClick={() => {
                viewerRef?.current?.setImgIdx(index);
                debugger;
                setImgIdx(index);
                setShowImgUrl(item?.imgUrl);
              }}
            />
            {/* <div className={styles.delectImg}>
              <DeleteOutlined />
            </div> */}
            {/* 清除图片 */}
            <span
              className={styles.clearImg}
              onClick={(e) => {
                console.log("我怎么又被删除了");
                imgInfoDeleteAPIRun({ imgId: item?.imgId });
              }}
              style={
                displayClear === item?.imgId
                  ? { display: "block" }
                  : { display: "none" }
              }
            >
              <CloseCircleOutlined />
            </span>
          </Col>
        ))}
        {[0, 100]?.includes(upLoadProgress) ? (
          <Col>
            <div className={styles.fileUpload}>
              <div
                className={styles.fileUploadContent}
                onClick={() => {
                  uploadImage(getUrl);
                }}
              >
                <PlusOutlined />
              </div>
              {/* <p>上传进度:{upLoadProgress}</p>
        <Progress
          percent={upLoadProgress}
          status="active"
          style={{ width: "300px" }}
          strokeColor={getStrokeColor()}
        /> */}
            </div>
          </Col>
        ) : (
          <WjLoading
            upLoadProgress={upLoadProgress}
            style={{ width: "100px", height: "100px" }}
            fontSize={18}
          ></WjLoading>
        )}
      </Row>
      {/* {showImgUrl && (
        <div className={styles?.overlayImg}>
          <img src={imageUrlList[imgIdx]?.imgUrl} alt="" />
          <div
            className={classnames(
              styles?.clearOverlayImg,
              styles?.switchImages
            )}
            onClick={() => setShowImgUrl("")}
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
      )} */}
      {!!imgIdx && (
        <WjViewer
          viewerRef={viewerRef}
          isShowViewer={!!showImgUrl}
          imageUrlList={imageUrlList}
          currentimgIdx={imgIdx}
          onChgisShowViewer={(param) => setShowImgUrl(param)}
        />
      )}
    </>
  );
};

export default UploadPage;
