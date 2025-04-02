import React, { useState, useEffect, useRef } from "react";
import { Space, Button, Col, Row } from "antd";
import { EyeOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { history } from "umi";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import {
  ArticleInfoListQueryAPI,
  ArticleInfoDelAPI,
} from "@/service/api/article";
import styles from "./style.scss";

const Index: React.FC = () => {
  //   删除文章列表数据接口
  const { data: articleList } = useRequest(async () => {
    const res = await ArticleInfoListQueryAPI({});
    return res?.list;
  });
  const toDetail = (item: API.ArticleTableDataType) => {
    history.push(
      {
        pathname: "/article/detail",
      },
      item
    );
  };

  const toEdit = (record: API.ArticleTableDataType) => {
    history.push({ pathname: "/article/edit" }, { editorId: record?.editorId });
    // history.push(`/article/edit/${record?.editorId}`);
  };
  return (
    <>
      <Button
        style={{ marginBottom: "20px" }}
        type="primary"
        onClick={() => {
          history.push({ pathname: "/article/create" }, { editorId: "" });
        }}
      >
        写文章
      </Button>
      <Row className={styles.articleList}>
        {articleList?.map((item: API.ArticleTableDataType) => (
          <Col
            className={styles.articleItem}
            key={item.id}
            onClick={() => toDetail(item)}
          >
            <div className={styles?.articleTop}>
              <img src={item.imgBg} />
              <span className={styles?.typeName}>{"nodejs"}</span>
            </div>
            <div className={styles.articleBottom}>
              <h2>{item.title}</h2>
              <div className={styles.articleInfo}>
                <div className={styles.articleTxt}>
                  <div className={styles.iconfont}>
                    <FieldTimeOutlined />
                  </div>
                  <span>{dayjs(item.createTime).format("YYYY-MM-DD")}</span>
                  <div className={styles.line}></div>
                  <div className={styles.iconfont}>
                    <EyeOutlined />
                  </div>
                  <span>{item.count}</span>
                </div>
                <Button
                  size="small"
                  className={styles.btn}
                  onClick={(e) => {
                    e.stopPropagation();
                    toEdit(item);
                  }}
                >
                  编辑
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Index;
