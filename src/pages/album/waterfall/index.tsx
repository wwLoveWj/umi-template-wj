import React from "react";
import { imgInfoQueryAPI } from "@/service/api/file";
import { useRequest } from "ahooks";
import "./style.less";
export default function Waterfall() {
  // 查询图片上传列表
  const { data: imageUrlList } = useRequest(imgInfoQueryAPI);
  return (
    <div className="waterfall">
      <div className="tall">
        <img src={require("@/assets/imgs/login.png")} alt="" />
        <span>1</span>
      </div>
      {imageUrlList?.map((item) => (
        <div>
          <img
            src={item?.imgUrl}
            alt="文件上传图片"
            id={item?.imgId}
            loading="lazy"
          />
          <span>{item?.id}</span>
        </div>
      ))}
    </div>
  );
}
