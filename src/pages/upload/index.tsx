import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Col, Progress, Row } from "antd";
// import { uploadImage } from "@/utils/index";
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
import useImageUpload from "./hooks/useImageUpload";

const UploadPage = ({
  getImgUrl,
}: {
  getImgUrl: ({ data }: { data: { filename: string; path: string } }) => void;
}) => {
  const [upLoadProgress, setupLoadProgress] = useState(0);
  // const [displayClear, setDisplayClear] = useState("");
  const [showImgUrl, setShowImgUrl] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const viewerRef = useRef(null);
  const { upLoadProgress1, getUploadUrl, uploadImage } = useImageUpload({
    value: upLoadProgress,
    onChange: setupLoadProgress,
  });

  const getStrokeColor = () => {
    return upLoadProgress > 50 ? "green" : "red";
  };

  // 删除图片url
  const { run: imgInfoDeleteAPIRun } = useRequest(imgInfoDeleteAPI, {
    manual: true,
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
    const res = await getUploadUrl(
      formData,
      token,
      "http://localhost:3007/file/upload"
    );
    getImgUrl && getImgUrl(res);
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
  };

  return (
    <>
      <Row className={styles?.imgList} gutter={[10, 10]}>
        {imageUrlList?.map((item: API.ImageUploadType, index: number) => (
          <Col key={item?.imgId} className={styles?.imgCol} span={6}>
            <img
              // onMouseEnter={(e) => {
              //   setDisplayClear(e.target.id);
              // }}
              // onMouseLeave={() => {
              //   setDisplayClear("");
              // }}
              src={item?.imgUrl}
              alt="文件上传图片"
              id={item?.imgId}
              loading="lazy"
              onClick={() => {
                debugger;
                setImgIdx(index);
                setShowImgUrl(!!item?.imgUrl);
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
              // style={
              //   displayClear === item?.imgId
              //     ? { display: "block" }
              //     : { display: "none" }
              // }
            >
              <CloseCircleOutlined />
            </span>
          </Col>
        ))}
        {[0, 100]?.includes(upLoadProgress1) ? (
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
      <WjViewer
        viewerRef={viewerRef}
        isShowViewer={showImgUrl}
        imageUrlList={imageUrlList}
        currentimgIdx={imgIdx}
        value={imgIdx}
        onChange={setImgIdx}
        onChgisShowViewer={(param) => setShowImgUrl(param)}
      />
    </>
  );
};

export default UploadPage;
