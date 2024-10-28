import React, { useState, useEffect } from "react";
import axios from "axios";
import { Col, Progress, Row } from "antd";
import { uploadImage } from "@/utils/index";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import styles from "./style.less";
import { getToken } from "@/utils/localToken";
import { imgInfoQueryAPI } from "@/service/api/file";
import { useRequest } from "ahooks";
import WjLoading from "@/components/WjLoading";
const UploadPage = ({
  getImgUrl,
}: {
  getImgUrl: ({ data }: { data: { filename: string; path: string } }) => void;
}) => {
  const [upLoadProgress, setupLoadProgress] = useState(0);
  const [displayClear, setDisplayClear] = useState(false);
  const getStrokeColor = () => {
    return upLoadProgress > 50 ? "green" : "red";
  };
  // 查询图片上传列表
  const { run: queryImgListRun, data: imageUrlList } =
    useRequest(imgInfoQueryAPI);
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
      <Row className={styles?.imgList} gutter={10}>
        {imageUrlList?.map((item) => (
          <Col key={item?.imgId} className={styles?.imgCol}>
            <img src={item?.imgUrl} alt="文件上传图片" />
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

                {/* 清除图片 */}
                {/* <span
            style={{ display: displayClear ? "block" : "none" }}
            className={styles.clearImg}
            onClick={(e) => {
              e.preventDefault();
              setDisplayClear(false);
              setupLoadProgress(0);
            }}
          >
            <CloseCircleOutlined />
          </span> */}
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
    </>
  );
};

export default UploadPage;
